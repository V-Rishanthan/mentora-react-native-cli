// utils/teacherRegistrationStore.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEACHER_REGISTRATION_KEY = 'teacher_registration_data';

export const saveTeacherData = async data => {
  try {
    // Get existing data
    const existingData = await getTeacherData();
    const mergedData = { ...existingData, ...data };

    await AsyncStorage.setItem(
      TEACHER_REGISTRATION_KEY,
      JSON.stringify(mergedData),
    );
    console.log('Teacher data saved:', mergedData);
    return true;
  } catch (error) {
    console.error('Error saving teacher data:', error);
    return false;
  }
};

export const getTeacherData = async () => {
  try {
    const data = await AsyncStorage.getItem(TEACHER_REGISTRATION_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting teacher data:', error);
    return {};
  }
};

export const clearTeacherData = async () => {
  try {
    await AsyncStorage.removeItem(TEACHER_REGISTRATION_KEY);
    console.log('Teacher data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing teacher data:', error);
    return false;
  }
};

export const getFullTeacherData = async () => {
  const data = await getTeacherData();
  console.log('Current teacher data:', data);
  return data;
};
