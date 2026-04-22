import { useState } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import SectionTitle from '../../components/SectionTitle';
import { getTeacherData, saveTeacherData } from '../../utils/teacherRegistrationStore';

export default function AddSubjectScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const onNext = async () => {
    if (!name.trim() || !category.trim()) {
      Alert.alert('Missing fields', 'Please fill subject name and category');
      return;
    }

    // create subject object and append to stored teacher data
    const subjectId = `subject_${Date.now()}`;
    const subject = {
      name: name.trim(),
      category: category.trim(),
      duration: duration.trim(),
      description: description.trim(),
      thumbnail: thumbnail.trim(),
      subjectAddedAt: subjectId,
      content: [],
    };

    const existing = await getTeacherData();
    const subjects = Array.isArray(existing.subjects) ? existing.subjects.slice() : [];
    subjects.push(subject);

    await saveTeacherData({ ...existing, subjects });

    navigation.navigate('TeacherSubjectSuggestion', { subjectId });
  };

  return (
    <View className="flex-1 bg-secondary px-6 pt-8">
      <SectionTitle hero={'Add Subject'} sub={'Provide subject details'} />

      <View className="mt-6">
        <Text className="text-gray mb-2">Subject Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Calculus Basics"
          className="bg-white rounded-lg p-4 mb-4"
        />

        <Text className="text-gray mb-2">Category</Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Mathematics"
          className="bg-white rounded-lg p-4 mb-4"
        />

        <Text className="text-gray mb-2">Duration</Text>
        <TextInput
          value={duration}
          onChangeText={setDuration}
          placeholder="e.g. 6 weeks or 10 hours"
          className="bg-white rounded-lg p-4 mb-4"
        />

        <Text className="text-gray mb-2">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Short description"
          multiline
          className="bg-white rounded-lg p-4 mb-4 h-24"
        />

        <Text className="text-gray mb-2">Thumbnail URL (optional)</Text>
        <TextInput
          value={thumbnail}
          onChangeText={setThumbnail}
          placeholder="https://..."
          className="bg-white rounded-lg p-4 mb-6"
        />

        <Button text={'Next (AI suggestions)'} onPress={onNext} />
      </View>
    </View>
  );
}
