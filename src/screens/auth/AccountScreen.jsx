import { useState } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import SectionTitle from '../../components/SectionTitle';
import { saveTeacherData } from '../../utils/teacherRegistrationStore';

export default function AccountScreen() {
  const navigation = useNavigation();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onNext = async () => {
    if (!fullname.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please fill fullname, email and password');
      return;
    }

    await saveTeacherData({
      username: fullname.trim(),
      email: email.trim(),
      password: password,
    });

    navigation.navigate('TeacherDetails');
  };

  return (
    <View className="flex-1 bg-secondary px-6 pt-8">
      <SectionTitle hero={'Create Account'} sub={'Basic account details'} />

      <View className="mt-6">
        <Text className="text-gray mb-2">Full name</Text>
        <TextInput
          value={fullname}
          onChangeText={setFullname}
          placeholder="Full name"
          className="bg-white rounded-lg p-4 mb-4"
        />

        <Text className="text-gray mb-2">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          className="bg-white rounded-lg p-4 mb-4"
        />

        <Text className="text-gray mb-2">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          className="bg-white rounded-lg p-4 mb-6"
        />

        <Button text={'Next'} onPress={onNext} />
      </View>
    </View>
  );
}
