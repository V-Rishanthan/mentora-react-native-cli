import React, { useRef, useState,useEffect } from 'react';
import {Animated} from 'react-native'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/authContext";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, EyeOff, Mail } from "lucide-react-native";

const LoginScreen = () => {

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
  const [loading, setLoading] = useState(false);
  const { login, selectedRole, logout } = useAuth();

  const handleSignUp = () => {
    if (selectedRole === "student") {
      navigation.navigate("Register");
    } else {
      navigation.navigate("RegisterTeachers");
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout successful from login page!");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  // assign the hooks
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    // get input value from the user and store it
    const email = emailRef.current;
    const password = passwordRef.current;

    // check if the both value valid
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      // use the context hooks and pass the props
      const response = await login(email, password);

      if (!response.success) {
        Alert.alert("Login Failed", response.error);
      }
      // If success is true, your auth context should handle the navigation
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View
     style={{ opacity: fadeAnim }}
     className="flex-1 bg-primary">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      
      {/* Top Section */}
      <View className="flex-1 px-6">
        <View className="flex-row items-start justify-between w-full mt-20">
          {/* Left */}
          <TouchableOpacity
            onPress={handleBack}
            className="bg-white w-10 h-10 rounded-full items-center justify-center"
          >
            <ArrowLeft size={22} color="#000" />
          </TouchableOpacity>

          {/* Right */}
          <View className="flex-row items-center">
            <Text className="text-white text-[14px]">
              Don't have an account?{" "}
            </Text>

            <TouchableOpacity onPress={handleSignUp}>
              <Text className="text-white font-semibold text-[14px]">
                Sign Up
              </Text>
            </TouchableOpacity>

            <Text className="text-white"> | </Text>

            <TouchableOpacity onPress={handleLogout}>
              <Text className="text-white font-semibold text-[14px]">
                LogOut
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* White Card */}
      <View className="h-2/3 bg-white mt-10 rounded-t-[40px] px-8 pt-10">
        <View>
          <Text className="text-4xl font-bold">Welcome Back</Text>
          <Text className="text-4xl font-bold mb-4">To Mentora</Text>

          <Text className="text-gray-500 text-lg mb-3">
            Sign in to continue your learning journey
          </Text>

          {selectedRole && (
            <View className="bg-green-50 w-32 px-3 py-1.5 rounded-full">
              <Text className="text-green-800 text-center text-sm font-medium">
                {selectedRole}
              </Text>
            </View>
          )}
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="space-y-6 pb-6 mt-10">
            {/* Email Input */}
            <View className="flex-row items-center rounded-xl border border-light px-4">
              <TextInput
                onChangeText={(value) => (emailRef.current = value)}
                className="flex-1 text-black text-base py-4"
                placeholder="Email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Mail size={18} color={"#c7c7c8"} />
            </View>
            
            {/* Password */}
            <View className="flex-row items-center rounded-xl border border-light px-4 mt-5">
              <TextInput
                onChangeText={(value) => (passwordRef.current = value)}
                className="flex-1 text-black text-base py-4"
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
              />
              <EyeOff size={18} color={"#c7c7c8"} />
            </View>

            {/* Button */}
            {loading ? (
              <View className="mt-8">
                <ActivityIndicator size="small" color="#8681FB" />
              </View>
            ) : (
              <View className="mt-8">
                <Button text="Login" onPress={handleLogin} />
              </View>
            )}

            {/* Spacer */}
            <View className="h-10" />
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default LoginScreen;