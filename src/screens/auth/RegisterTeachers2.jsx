import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from "../../components/Button";
import SectionTitle from "../../components/SectionTitle";

export default function RegisterTeachers() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    qualification: "",
    yearsOfExperience: "",
    specialization: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  // Load saved data when component mounts
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('@teacher_registration_data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData((prev) => ({
          ...prev,
          ...parsedData,
        }));
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    // Validation
    if (!formData.qualification.trim()) {
      Alert.alert("Error", "Please enter your qualification");
      return;
    }

    if (
      !formData.yearsOfExperience.trim() ||
      isNaN(formData.yearsOfExperience)
    ) {
      Alert.alert("Error", "Please enter valid years of experience");
      return;
    }

    if (!formData.specialization.trim()) {
      Alert.alert("Error", "Please enter your specialization");
      return;
    }

    if (!formData.bio.trim() || formData.bio.trim().length < 50) {
      Alert.alert("Error", "Bio must be at least 50 characters long");
      return;
    }

    setLoading(true);

    try {
      // Save professional info to storage
      const existingData = await AsyncStorage.getItem('@teacher_registration_data');
      const parsedData = existingData ? JSON.parse(existingData) : {};
      
      const updatedData = {
        ...parsedData,
        qualification: formData.qualification.trim(),
        yearsOfExperience: formData.yearsOfExperience.trim(),
        specialization: formData.specialization.trim(),
        bio: formData.bio.trim(),
      };
      
      await AsyncStorage.setItem('@teacher_registration_data', JSON.stringify(updatedData));

      // Navigate to subjects screen
      navigation.navigate("addSubject");
    } catch (error) {
      Alert.alert("Error", "Failed to save data. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View className="flex-1 px-6 mt-4 bg-secondary">
      <View className="w-full ">
        <Image
          source={require("../../assets/logo-2.png")}
          className="w-32 h-32"
          resizeMode="contain"
        />
      </View>
      {/* Title Content */}
      <SectionTitle
        hero={"Let's Build Your Learning Profile"}
        sub={
          "Provide some quick information to unlock personalized courses and guidance."
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="px-8"
      >
        {/* Qualification */}
        <View className="flex-row items-center rounded-xl border border-light px-4  mb-5">
          <TextInput
            value={formData.qualification}
            onChangeText={(value)=>handleChange("qualification", value)}
            className="flex-1 text-grayPro-800 text-base py-4"
            placeholder="Qualification"
            placeholderTextColor="#9ca3af"
          />
        </View>
        {/*  Years of Experience*/}
        <View className="flex-row items-center rounded-xl border border-light px-4  mb-5">
          <TextInput
          value={formData.yearsOfExperience}
            onChangeText={(value) => handleChange("yearsOfExperience", value)}
            className="flex-1 text-grayPro-800 text-base py-4"
            placeholder="Years of Experience"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
          />
        </View>
        {/* Specialization */}
        <View className="flex-row items-center rounded-xl border border-light px-4  mb-5">
          <TextInput
          value={formData.specialization}
            onChangeText={(value) => handleChange("specialization", value)}
            className="flex-1 text-grayPro-800 text-base py-4"
            placeholder="Specialization"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Bio Field */}
        <View className="rounded-xl border border-light px-4 mb-5">
          <TextInput
           value={formData.bio}
            onChangeText={(value) => handleChange("bio", value)}
            className="text-grayPro-800 text-base py-4 min-h-32"
            placeholder="Tell us about yourself, your teaching philosophy, and what makes you unique..."
            placeholderTextColor="#9ca3af"
            multiline={true}
            numberOfLines={5}
            textAlignVertical="top"
            style={{ minHeight: 128 }}
          />
        </View>
        {/* button */}
        <View className="mt-8">
         <Button 
              text={loading ? "Saving..." : "Continue"} 
              onPress={handleContinue}
              disabled={loading}
            />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}