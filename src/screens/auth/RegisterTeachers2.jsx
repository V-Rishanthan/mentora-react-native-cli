import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { Animated } from "react-native";
import {
  getTeacherData,
  clearTeacherData,
} from "../../utils/teacherRegistrationStore";
import { useAuth } from "../../context/authContext";
import Button from "../../components/Button";
import SectionTitle from "../../components/SectionTitle";

export default function RegisterTeachers2() {
  const navigation = useNavigation();
  const { registerTeacher } = useAuth();

  // Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, []);

  const [formData, setFormData] = useState({
    qualification: "",
    yearsOfExperience: "",
    specialization: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validate step-2 fields
  const validateForm = () => {
    if (!formData.qualification.trim()) {
      Alert.alert("Error", "Please enter your qualification");
      return false;
    }
    if (!formData.yearsOfExperience.trim() || isNaN(formData.yearsOfExperience)) {
      Alert.alert("Error", "Please enter valid years of experience");
      return false;
    }
    if (!formData.specialization.trim()) {
      Alert.alert("Error", "Please enter your specialization");
      return false;
    }
    if (!formData.bio.trim() || formData.bio.trim().length < 50) {
      Alert.alert("Error", "Bio must be at least 50 characters long");
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Load step-1 data (username, email, password) from AsyncStorage
      const step1Data = await getTeacherData();

      if (!step1Data.email || !step1Data.password) {
        Alert.alert("Error", "Registration data is missing. Please go back and re-enter your details.");
        return;
      }

      // Build complete teacher registration payload
      const teacherPayload = {
        username: step1Data.username?.trim() || "",
        email: step1Data.email?.trim() || "",
        password: step1Data.password || "",
        qualification: formData.qualification.trim(),
        yearsOfExperience: formData.yearsOfExperience.trim(),
        specialization: formData.specialization.trim(),
        bio: formData.bio.trim(),
        // Subject fields start empty; teacher adds them from TeacherHome → AddSubject
        subjects: [],
        subjectName: "",
        category: "",
        duration: "",
        description: "",
        thumbnail: "",
      };

      // Register teacher account in Firebase Auth + Firestore
      const result = await registerTeacher(teacherPayload);

      if (!result.success) {
        Alert.alert("Registration Failed", result.error || "Something went wrong. Please try again.");
        return;
      }

      // Clear temp registration data from AsyncStorage
      await clearTeacherData();

      // Navigate directly to TeacherHome
      navigation.reset({
        index: 0,
        routes: [{ name: "TeacherHome" }],
      });
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
      console.error("RegisterTeachers2 error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }} className="flex-1 bg-secondary">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full">
          <Image
            source={require("../../assets/logo-2.png")}
            className="w-32 h-32"
            resizeMode="contain"
          />
        </View>

        <SectionTitle
          hero={"Let's Build Your Teaching Profile"}
          sub={"Tell us about your qualifications so students can trust your expertise."}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="px-8 mt-2"
        >
          {/* Qualification */}
          <View className="flex-row items-center rounded-xl border border-light px-4 mb-5">
            <TextInput
              value={formData.qualification}
              onChangeText={(value) => handleChange("qualification", value)}
              className="flex-1 text-grayPro-800 text-base py-4"
              placeholder="Qualification (e.g. B.Sc Mathematics)"
              placeholderTextColor="#9ca3af"
              returnKeyType="next"
            />
          </View>

          {/* Years of Experience */}
          <View className="flex-row items-center rounded-xl border border-light px-4 mb-5">
            <TextInput
              value={formData.yearsOfExperience}
              onChangeText={(value) => handleChange("yearsOfExperience", value)}
              className="flex-1 text-grayPro-800 text-base py-4"
              placeholder="Years of Experience"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              returnKeyType="next"
            />
          </View>

          {/* Specialization */}
          <View className="flex-row items-center rounded-xl border border-light px-4 mb-5">
            <TextInput
              value={formData.specialization}
              onChangeText={(value) => handleChange("specialization", value)}
              className="flex-1 text-grayPro-800 text-base py-4"
              placeholder="Specialization (e.g. Algebra, Physics)"
              placeholderTextColor="#9ca3af"
              returnKeyType="next"
            />
          </View>

          {/* Bio */}
          <View className="rounded-xl border border-light px-4 mb-5">
            <TextInput
              value={formData.bio}
              onChangeText={(value) => handleChange("bio", value)}
              className="text-grayPro-800 text-base py-4"
              placeholder="Tell us about yourself, your teaching philosophy, and what makes you unique... (min 50 characters)"
              placeholderTextColor="#9ca3af"
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
              style={{ minHeight: 128 }}
            />
          </View>

          {/* Complete Registration Button */}
          <View className="mt-4 mb-10">
            <Button
              text={loading ? "Creating Account..." : "Complete Registration"}
              onPress={handleContinue}
              disabled={loading}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </Animated.View>
  );
}

