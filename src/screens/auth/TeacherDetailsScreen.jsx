import { useState } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import SectionTitle from '../../components/SectionTitle';
import { saveTeacherData } from '../../utils/teacherRegistrationStore';

export default function TeacherDetailsScreen() {
  const navigation = useNavigation();
  const [qualification, setQualification] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [about, setAbout] = useState('');

  const onNext = async () => {
    if (!qualification.trim() || !yearsOfExperience.trim() || !specialization.trim()) {
      Alert.alert('Missing fields', 'Please fill qualification, years of experience and specialization');
      return;
    }

    await saveTeacherData({
      qualification: qualification.trim(),
      yearsOfExperience: yearsOfExperience.trim(),
      specialization: specialization.trim(),
      bio: about.trim(),
    });

    navigation.navigate('AddSubject');
  };

  return (
    <View className="flex-1 bg-secondary px-6 pt-8">
      <SectionTitle hero={'Teacher Details'} sub={'Tell us about your background'} />

      <View className="mt-6">
        <Text className="text-gray mb-2">Qualification</Text>
        <TextInput
          value={qualification}
          onChangeText={setQualification}
          placeholder="e.g. MSc Mathematics"
          className="bg-white rounded-lg p-4 mb-4"
        />

        <Text className="text-gray mb-2">Years of Experience</Text>
        <TextInput
          value={yearsOfExperience}
          onChangeText={setYearsOfExperience}
          placeholder="e.g. 3"
          keyboardType="numeric"
          className="bg-white rounded-lg p-4 mb-4"
        />

        <Text className="text-gray mb-2">Specialization</Text>
        <TextInput
          value={specialization}
          onChangeText={setSpecialization}
          placeholder="e.g. Algebra, Exam Prep"
          className="bg-white rounded-lg p-4 mb-4"
        />

        <Text className="text-gray mb-2">About</Text>
        <TextInput
          value={about}
          onChangeText={setAbout}
          placeholder="Short bio"
          multiline
          className="bg-white rounded-lg p-4 mb-6 h-28"
        />

        <Button text={'Next'} onPress={onNext} />
      </View>
    </View>
  );
}
