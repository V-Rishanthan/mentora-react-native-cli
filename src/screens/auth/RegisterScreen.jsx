import {useNavigation} from "@react-navigation/native"
import { BookOpen, Eye, Mail, User, UsersRound } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/authContext";
import Button from "../../components/Button";
import SectionTitle from "../../components/SectionTitle";


const RegisterScreen = () => {


   // to Navigate
  const router = useNavigation();

  // use hooks
  const { register } = useAuth();

  // loading
  const [loading, setLoading] = useState(false);
  // get student input
  const usernameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const genderRef = useRef("");
  const subjectRef = useRef("");

    const handlelogin = () => {
    router.push("Login");
    console.log("working")
  };

  const handleRegisterStudents = async () => {
    // / Get current values
    const username = usernameRef.current;
    const email = emailRef.current;
    const password = passwordRef.current;
    const gender = genderRef.current;
    const subject = subjectRef.current;
    // Validation
    if (!username || !email || !password || !gender || !subject) {
      Alert.alert("Error", "Please fill all fields");
      return; //  Added return to stop
    }
    setLoading(true);

    try {
      // Pass all required parameters including gender and subject
      let response = await register(
        username,
        email,
        password,
        "student", // role
        gender, // gender
        subject // subject interest
      );

      console.log("Registration result:", response);

      if (response.success) {
        Alert.alert("Success", "Account created successfully!");
        router.replace("Home"); // Navigate to home
      } else {
        //  response.error not response.msg
        Alert.alert("Error Sign-up", response.error || "Registration failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 px-6 mt-5 relative bg-secondary">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
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
        sub={"Register to Start your Exciting Learning Process"}
      />

      {/* input field */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="px-8"
      >
        {/* Full name*/}
        <View className="flex-row items-center rounded-xl border border-light px-4 mb-5">
          <TextInput
            className="flex-1 text-gratext-grayPro-800 text-base py-4"
            placeholder="Full Name"
            placeholderTextColor="#9ca3af"
            onChangeText={(value) => (usernameRef.current = value)}
          />
          <User size={18} color={"#c7c7c8"} />
        </View>
        {/* Email*/}
        <View className="flex-row items-center rounded-xl border border-light px-4  mb-5">
          <TextInput
            className="flex-1 text-gratext-grayPro-800 text-base py-4"
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Mail size={18} color={"#c7c7c8"} />
        </View>
        {/* Password*/}
        <View className="flex-row items-center rounded-xl border border-light px-4 mb-5">
          <TextInput
            className="flex-1 text-grayPro-800 text-base py-4"
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            textContentType="password"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
          />
          <Eye size={18} color={"#c7c7c8"} />
        </View>
        {/* Gender*/}
        <View className="flex-row items-center rounded-xl border border-light px-4 mb-5">
          <TextInput
            className="flex-1 text-grayPro-800 text-base py-4"
            placeholder="Gender"
            placeholderTextColor="#9ca3af"
            onChangeText={(value) => (genderRef.current = value)}
          />
          <UsersRound size={18} color={"#c7c7c8"} />
        </View>
        {/* Subject Interest*/}
        <View className="flex-row items-center rounded-xl border border-light px-4 ">
          <TextInput
            className="flex-1 text-grayPro-800 text-base py-4"
            placeholder="Subject Interest"
            placeholderTextColor="#9ca3af"
            onChangeText={(value) => (subjectRef.current = value)}
          />
          <BookOpen size={18} color={"#c7c7c8"} />
        </View>

        <View className="mt-8">
          {loading ? (
            <ActivityIndicator size="small" color="#8681FB" />
          ) : (
            <Button text="Create a Account " onPress={handleRegisterStudents} />
          )}

          <View className="flex-row justify-center mt-4">
            <Text className="text-base text-black">
              Already have an account?
            </Text>

            <TouchableOpacity onPress={handlelogin}>
              <Text className="text-base text-blue-500 font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* patterns */}

      <Image
        source={require("../../assets/patterns.png")}
        className="absolute bottom-0 right-0 w-56 h-56"
        resizeMode="contain"
      />
    </View>
  )
}

export default RegisterScreen