import { Eye, Mail, User, MoveRight } from "lucide-react-native";
import { useState,useRef,useEffect } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveTeacherData ,clearTeacherData} from "../../utils/teacherRegistrationStore";
import { Animated } from "react-native";


import Button from "../../components/Button";
import SectionTitle from "../../components/SectionTitle";

export default function RegisterTeachers() {

  // Define the animated value
    const fadeAnim = useRef(new Animated.Value(0)).current; 
  
    // 
    useEffect(() => {
      const animation = Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      });
      animation.start();
  
      return () => animation.stop(); // This prevents the crash
    }, []);

  const navigation = useNavigation();
  // const [loading, setLoading] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  // const [formData, setFormData] = useState({
  //   username: "",
  //   email: "",
  //   password: "",
  // });

  // const handleChange = (field, value) => {
  //   setFormData(prev => ({ ...prev, [field]: value }));
  // };

  // // Function to save teacher data to AsyncStorage
  // const saveTeacherData = async (data) => {
  //   try {
  //     await AsyncStorage.setItem('@teacher_registration_data', JSON.stringify(data));
  //     // log the data
   
  //     return { success: true };
  //   } catch (error) {
  //     console.error("Error saving teacher data:", error);
  //     return { success: false, error };
  //   }
  // };

  // const handleContinue = async () => {
  //   // Validation
  //   if (!formData.username.trim()) {
  //     Alert.alert("Error", "Please enter your full name");
  //     return;
  //   }
    
  //   if (!formData.email.trim()) {
  //     Alert.alert("Error", "Please enter your email");
  //     return;
  //   }
    
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(formData.email)) {
  //     Alert.alert("Error", "Please enter a valid email address");
  //     return;
  //   }
    
  //   if (!formData.password || formData.password.length < 6) {
  //     Alert.alert("Error", "Password must be at least 6 characters long");
  //     return;
  //   }

  //   setLoading(true);
    
  //   try {
  //     // Save basic info to storage
  //     const saveResult = await saveTeacherData({
  //       username: formData.username.trim(),
  //       email: formData.email.trim(),
  //       password: formData.password,
  //     });
      
  //     if (saveResult.success) {
  //       // Navigate to next screen
  //       navigation.navigate("RegisterTeachers_2");
  //     } else {
  //       Alert.alert("Error", "Failed to save data. Please try again.");
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to save data. Please try again.");
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });


  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
const handleContinue = async () => {
    // Validation
    if (!formData.username.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }
    
    if (!formData.email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    
    if (!formData.password || formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    
    try {
      // Save basic info to storage
      await saveTeacherData({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      
      // Navigate to next screen
      navigation.push("RegisterTeachers2");
      // router.push("./addSubject");
    } catch (error) {
      Alert.alert("Error", "Failed to save data. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      className="flex-1 px-6 mt-2 relative bg-secondaryflex-1 bg-white"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Animated.View 
        style={{ opacity: fadeAnim }}
        className="flex-1 px-6 pt-10">
         

          {/* Logo */}
          <View className="w-full ">
            <Image
              source={require("../../assets/logo-2.png")}
              className="w-32 h-32"
              resizeMode="contain"
            />
          </View>

          {/* Title Content */}
          <SectionTitle
            hero={"Create Account"}
            sub={"Register to Start your Exciting Teaching Process"}
          />

          {/* Input fields */}
          <View className="mt-8">
            {/* Full Name */}
            <View className="mb-5">
              <Text className="text-gray-600 mb-2 ml-1">Full Name</Text>
              <View className="flex-row items-center rounded-xl border border-light px-4 bg-white">
                <TextInput
                  value={formData.username}
                  onChangeText={(value) => handleChange("username", value)}
                  className="flex-1 text-black text-base py-4"
                  placeholder="Enter your full name"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                <User size={20} color={"#c7c7c8"} />
              </View>
            </View>

            {/* Email */}
            <View className="mb-5">
              <Text className="text-gray-600 mb-2 ml-1">Email</Text>
              <View className="flex-row items-center rounded-xl border border-light px-4 bg-white">
                <TextInput
                  value={formData.email}
                  onChangeText={(value) => handleChange("email", value)}
                  className="flex-1 text-black text-base py-4"
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
                <Mail size={20} color={"#c7c7c8"} />
              </View>
            </View>

            {/* Password */}
            <View className="mb-8">
              <Text className="text-gray-600 mb-2 ml-1">Password</Text>
              <View className="flex-row items-center rounded-xl border border-light px-4 bg-white">
                <TextInput
                  value={formData.password}
                  onChangeText={(value) => handleChange("password", value)}
                  className="flex-1 text-black text-base py-4"
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Eye size={20} color={"#c7c7c8"} />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-500 text-sm mt-2 ml-1">
                Must be at least 6 characters
              </Text>
            </View>

            {/* Continue Button */}
            <View className="mt-8">
              <Button 
                text={loading ? "Saving..." : "Continue"} 
                onPress={handleContinue}
                disabled={loading}
                className="w-full py-4"
              />
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center items-center mt-8">
              <Text className="text-gray-600">
                Already have an account?
              </Text>
              <TouchableOpacity onPress={handleLogin} className="ml-2">
                <Text className="text-primary font-semibold">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>        
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}