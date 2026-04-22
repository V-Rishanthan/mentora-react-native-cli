import { useNavigation, useRoute } from '@react-navigation/native';
import { Brain } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/authContext';
import { getGeminiResponse } from '../../services/geminiService';
import { uploadImageForUser } from '../../services/storageService';
import { addSubjectForUser } from '../../services/teacherService';
import {
  clearTeacherData,
  getTeacherData,
} from '../../utils/teacherRegistrationStore';
import Button from '../../components/Button';
import SectionTitle from '../../components/SectionTitle';

export default function TeacherSubjectSuggestion() {
  const { user, userProfile, updateTeacherProfile } = useAuth();
  const [userInput, setUserInput] = useState('');
  const [aiOutput, setAiOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [previousData, setPreviousData] = useState(null); // Store previous screens data
  const route = useRoute();
  const subjectId = route?.params?.subjectId || null;

  const loadPreviousData = async () => {
    try {
      const savedData = await getTeacherData();
      console.log('Loaded previous data from AsyncStorage:', savedData);

      if (Object.keys(savedData).length === 0) {
        // no saved local data; fall back to profile for existing teacher
        if (userProfile && userProfile.role === 'teacher') {
          setPreviousData(userProfile);

          const subjectList = Array.isArray(userProfile.subjects) ? userProfile.subjects : [];
          const existingSubject = subjectId
            ? subjectList.find(s => s.subjectAddedAt === subjectId || s.subjectId === subjectId || s.name === subjectId)
            : subjectList[0];

          const existingContent = (existingSubject && Array.isArray(existingSubject.content)) ? existingSubject.content : [];
          const normalized = existingContent.map(c => (typeof c === 'string' ? { title: c } : { title: c.title }));
          setSelected(normalized);
          if (existingSubject?.name || existingSubject?.subjectName) {
            setUserInput(existingSubject.name || existingSubject.subjectName);
          }
          return;
        }

        Alert.alert('No Data Found', 'Please go back and fill the registration form.');
        router.back();
        return;
      }

      setPreviousData(savedData);

      if (savedData.subjects && Array.isArray(savedData.subjects)) {
        const subjectList = savedData.subjects;
        const currentSubject = subjectId
          ? subjectList.find(s => s.subjectAddedAt === subjectId || s.subjectId === subjectId || s.name === subjectId)
          : subjectList[subjectList.length - 1];

        const existingContent = (currentSubject && Array.isArray(currentSubject.content)) ? currentSubject.content : [];
        const normalized = existingContent.map(c => (typeof c === 'string' ? { title: c } : { title: c.title }));
        setSelected(normalized);
        if (currentSubject?.name || currentSubject?.subjectName) {
          setUserInput(currentSubject.name || currentSubject.subjectName);
        }
      }
    } catch (error) {
      console.error('Error loading previous data:', error);
      Alert.alert('Error', 'Failed to load your data. Please start over.');
      router.back();
    }
  };

  const handleSendMessage = async () => {
    if (!userInput) return;
    setIsLoading(true);
    setAiOutput([]); // Clear previous output (this is my Referance)
    // setUserInput("")
    const subjectToAsk = userInput;

    // const Prompt = `Expert Educator: Provide a structured list of topics for ${subjectToAsk}.`;
    const Prompt = `List the core topics for "${subjectToAsk}".
Constraints:
- Output a plain bulleted list ONLY.
- No introductory text or concluding remarks.
- No descriptions or explanations for the topics.
- Max 12-15 items.
- Use a simple "Topic Name" format.`;

    try {
      // Call the service and pass the prompt
      const result = await getGeminiResponse(Prompt);

      // display the data
      const parsedList = result
        .split('\n') // Split by line
        .filter(line => line.trim() !== '') // Remove empty lines
        .map(line => {
          return line
            .replace(/^\s*[\d.)*•-]+\s*/, '') // Removes: "1.", "1)", "*", "-", "•" and spaces
            .trim();
        });
      // just check the output
      console.log('Gemini Response:', result);
      setAiOutput(parsedList);
    } catch (err) {
      setAiOutput([]);
      Alert.alert('AI Unavailable', 'Could not reach the AI. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // handle route
  const router = useNavigation();

  // Load data from AsyncStorage when component mounts
  useEffect(() => {
    loadPreviousData();
  }, []);

  const handleCompleteRegistration = async () => {
    if (selected.length === 0) {
      Alert.alert('Topics Required', 'Please select at least one topic for this subject.');
      return;
    }

    setRegistrationLoading(true);

    try {
      const uid = user?.uid;
      if (!uid) {
        Alert.alert('Error', 'You must be logged in to save a subject.');
        return;
      }

      // Check if the subject already exists in the teacher's Firestore profile
      const subjectList = Array.isArray(userProfile?.subjects) ? userProfile.subjects : [];
      const existingIdx = subjectList.findIndex(
        s => s.subjectAddedAt === subjectId || s.subjectId === subjectId,
      );

      if (existingIdx !== -1) {
        // ── PATH A: Update topics on an already-saved Firestore subject ──
        const existingContent = Array.isArray(subjectList[existingIdx].content)
          ? subjectList[existingIdx].content
          : [];
        const existingNormalized = existingContent.map(c =>
          typeof c === 'string' ? { title: c } : { title: c.title },
        );

        // Merge: keep existing, append new unique ones
        const newItems = selected.filter(
          s => !existingNormalized.find(e => e.title === s.title),
        );
        const mergedContent = [...existingNormalized, ...newItems];

        const updatedSubjects = subjectList.slice();
        updatedSubjects[existingIdx] = {
          ...updatedSubjects[existingIdx],
          content: mergedContent,
        };

        const res = await updateTeacherProfile({ subjects: updatedSubjects });

        if (res.success) {
          setSelected(mergedContent);
          Alert.alert('Updated!', 'Subject topics have been updated.', [
            {
              text: 'Go to Home',
              onPress: () =>
                router.reset({ index: 0, routes: [{ name: 'TeacherHome' }] }),
            },
          ]);
        } else {
          Alert.alert('Update Failed', res.error || 'Could not update subject topics.');
        }
      } else {
        // ── PATH B: Brand-new subject (just created in AddSubject) — save to Firestore ──
        const savedData = await getTeacherData();
        const subjects = Array.isArray(savedData.subjects) ? savedData.subjects : [];
        // Pick the subject matching subjectId, or the last one added
        const subjectFromStorage =
          subjects.find(s => s.subjectAddedAt === subjectId) ||
          subjects[subjects.length - 1] ||
          null;

        if (!subjectFromStorage) {
          Alert.alert('Error', 'Subject data not found. Please go back and fill the subject form.');
          return;
        }

        // Upload thumbnail if it's a local file path
        let thumbnailUrl = subjectFromStorage.thumbnail || '';
        if (thumbnailUrl && !thumbnailUrl.startsWith('http')) {
          try {
            thumbnailUrl = await uploadImageForUser(uid, thumbnailUrl);
          } catch (uploadErr) {
            console.warn('Thumbnail upload failed, continuing without it:', uploadErr);
            thumbnailUrl = '';
          }
        }

        const subjectObj = {
          name: subjectFromStorage.name || userInput || '',
          category: subjectFromStorage.category || '',
          duration: subjectFromStorage.duration || '',
          description: subjectFromStorage.description || '',
          thumbnail: thumbnailUrl,
          subjectAddedAt: subjectFromStorage.subjectAddedAt || new Date().toISOString(),
          content: selected,
        };

        // Save to Firestore: subjects/{docId} subcollection + append to user doc subjects array
        const addRes = await addSubjectForUser(uid, subjectObj, thumbnailUrl);
        if (!addRes.success) {
          throw addRes.error || new Error('Failed to save subject to Firestore');
        }

        // Clear temp AsyncStorage registration data
        await clearTeacherData();

        Alert.alert('Subject Added!', 'Your subject has been saved successfully.', [
          {
            text: 'Go to Home',
            onPress: () =>
              router.reset({ index: 0, routes: [{ name: 'TeacherHome' }] }),
          },
        ]);
      }
    } catch (error) {
      console.error('handleCompleteRegistration error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setRegistrationLoading(false);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      eyboardShouldPersistTaps="handled"
      className="flex-1 px-6 mt-5 bg-secondary"
    >
      <View className="w-full ">
        <Image
          source={require('../../assets/logo-2.png')}
          className="w-32 h-32"
          resizeMode="contain"
        />
      </View>

      {/* Title Content */}
      <SectionTitle
        hero={'Build Your Teaching Profile'}
        sub={
          'Select your subjects to connect with students who need your expertise'
        }
      />

      {/* Subject fiels */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="px-8"
      >
        <View className="p-4 mb-5">
          {/* AI Button  */}

          <View className="w-full items-end mb-3">
            <TouchableOpacity
              className="bg-white flex-row gap-2 rounded-lg px-4 py-2 items-center"
              onPress={handleSendMessage}
              disabled={isLoading || !userInput.trim()}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#8681FB" />
              ) : (
                <Brain size={18} color="#8681FB" />
              )}
              <Text className=" font-medium text-primary ml-2">
                {isLoading ? 'Processing...' : 'AI Assistance'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Subject input */}
          <View className="flex-row items-center rounded-xl border border-light px-4">
            <TextInput
              className="flex-1 text-gray text-base py-4"
              placeholder="Subject"
              placeholderTextColor="#9ca3af"
              value={userInput}
              onChangeText={setUserInput}
            />
          </View>

          {/* Tags container */}

          <View className="bg-white rounded-xl border border-light p-4 min-h-44 mt-6">
            {selected.length === 0 ? (
              <Text className="text-gray-400 text-base">
                No subjects added yet
              </Text>
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {selected.map((selectedSubject, idx) => (
                  <View
                    key={idx}
                    className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full flex-row items-center"
                  >
                    <Text className="text-primary font-light text-xs mr-2">
                      {selectedSubject.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSelected(selected.filter(item => item.title !== selectedSubject.title));
                      }}
                    >
                      <Text className="text-primary font-bold">✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* AI Assistance Suggestion */}
          {aiOutput?.length > 0 && (
            <View className="mt-6">
              <Text className="text-lg font-bold text-primary mb-2">
                Recommended for: {userInput}
              </Text>

              <View className="bg-white/50 rounded-2xl p-2">
                {aiOutput?.map((subject, idx) => (
                  <TouchableOpacity
                    key={idx}
                    className="mt-2 flex-row items-center  p-3 rounded-xl "
                    onPress={() => {
                      const title = subject;

                      if (!selected.find(s => s.title === title)) {
                        setSelected(prev => [...prev, { title }]);
                      }
                    }}
                  >
                    <Image
                      source={require('../../assets/check-mark.png')}
                      className="w-5 h-5 mr-3"
                      resizeMode="contain"
                    />
                    <Text className="text-gray-800 text-base flex-1">
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
        {/* button */}
        <View className="mb-6">
          <Button
            text={
              registrationLoading
                ? 'Creating Account...'
                : 'Complete Registration'
            }
            onPress={handleCompleteRegistration}
            disabled={registrationLoading || selected.length === 0}
          />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
