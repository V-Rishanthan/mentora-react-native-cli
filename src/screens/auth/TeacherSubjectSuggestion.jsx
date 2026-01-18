import { useNavigation } from "@react-navigation/native";
import { Brain } from "lucide-react-native";
import { useEffect, useState } from "react";
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
} from "react-native";
import { useAuth } from "../../context/authContext";
import { getGeminiResponse } from "../../services/geminiService";
import { clearTeacherData, getTeacherData } from "../../utils/teacherRegistrationStore"; // Import storage utils
import Button from "../../components/Button";
import SectionTitle from "../../components/SectionTitle";


export default function TeacherSubjectSuggestion() {
  const { registerTeacher } = useAuth();
  const [userInput, setUserInput] = useState("");
  const [aiOutput, setAiOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [previousData, setPreviousData] = useState(null); // Store previous screens data

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
        .split("\n") // Split by line
        .filter((line) => line.trim() !== "") // Remove empty lines
        .map((line) => {
          return line
            .replace(/^\s*[\d.)*•-]+\s*/, "") // Removes: "1.", "1)", "*", "-", "•" and spaces
            .trim();
        });
      // just check the output
      console.log("Gemini Response:", result);
      setAiOutput(parsedList);
    } catch (err) {
      setAiOutput("Error: Could not reach the AI.");
    } finally {
      setIsLoading(false);
    }
  };

  // handle route
  const router = useNavigation()

 // Load data from AsyncStorage when component mounts
  useEffect(() => {
    loadPreviousData();
  }, []);


   const loadPreviousData = async () => {
    try {
      const savedData = await getTeacherData();
      console.log("Loaded previous data from AsyncStorage:", savedData);
      
      if (Object.keys(savedData).length === 0) {
        Alert.alert("No Data Found", "Please go back and fill the registration form.");
        router.back();
        return;
      }
      
      setPreviousData(savedData);
      
      // Load previously saved subjects if any
      if (savedData.subjects && Array.isArray(savedData.subjects)) {
        setSelected(savedData.subjects);
      }
    } catch (error) {
      console.error("Error loading previous data:", error);
      Alert.alert("Error", "Failed to load your data. Please start over.");
      router.back();
    }
  };

    // THIS IS THE MAIN FUNCTION - COMBINES BOTH DATA SOURCES
  const handleCompleteRegistration = async () => {
    // Check if we have previous data
    if (!previousData) {
      Alert.alert("Error", "No registration data found. Please start over.");
      return;
    }

    // Validate required fields from previous screens
    const requiredFields = ['username', 'email', 'password', 'qualification', 'yearsOfExperience', 'specialization', 'bio','subjectName','category','duration','description','thumbnail'];
    const missingFields = requiredFields.filter(field => !previousData[field]?.trim());
    
    if (missingFields.length > 0) {
      Alert.alert("Missing Information", `Please go back and fill: ${missingFields.map(f => f.replace(/([A-Z])/g, ' $1').trim()).join(', ')}`);
      return;
    }

    // Check if subjects are selected
    if (selected.length === 0) {
      Alert.alert("Subjects Required", "Please add at least one subject you teach.");
      return;
    }

    // LOG ALL DATA BEFORE REGISTRATION
  console.log("======= ALL TEACHER REGISTRATION DATA =======");
  console.log("📋 FROM ASYNC STORAGE (PREVIOUS SCREENS):");
  console.log("Username:", previousData.username);
  console.log("Email:", previousData.email);
  console.log("Password:", previousData.password ? "*** (hidden)" : "Not provided");
  console.log("Qualification:", previousData.qualification);
  console.log("Years of Experience:", previousData.yearsOfExperience);
  console.log("Specialization:", previousData.specialization);
  console.log("Bio:", previousData.bio);
  console.log("Subject Name:", previousData.subjectName);
  console.log("Category:", previousData.category);
  console.log("Duration:", previousData.duration);
  console.log("Description:", previousData.description);
  console.log("Thumbnail:", previousData.thumbnail);
  console.log("");
  

    setRegistrationLoading(true);

    try {
      //  COMBINE BOTH DATA SOURCES:
      // 1. Data from AsyncStorage (previous screens)
      // 2. Data from current screen (selected subjects)
      
      const completeTeacherData = {
        // From AsyncStorage (Screen 1 & 2):
        username: previousData.username,
        email: previousData.email,
        password: previousData.password,
        qualification: previousData.qualification,
        yearsOfExperience: previousData.yearsOfExperience,
        specialization: previousData.specialization,
        bio: previousData.bio,

        // subject related info
        subjectName:previousData.subjectName,
        category: previousData.category,
        duration: previousData.duration,
        description: previousData.description,
        thumbnail: previousData.thumbnail,

        
        // From current screen state (Screen 3):
        subjects: selected,
        
       
      };

     

      // PASS COMBINED DATA TO AUTH CONTEXT
      const result = await registerTeacher(completeTeacherData);
      console.log(result)
      
      if (result.success) {
        console.log("Teacher registration successful!");
        
        // Clear AsyncStorage after successful registration
        await clearTeacherData();
        
        // Show success message
        Alert.alert(
          " Registration Successful!",
          "Your teacher account has been created successfully. Welcome to Mentora!",
          
        );
      } else {
        Alert.alert("Registration Failed", result.error || "Something went wrong. Please try again.");
        console.error("Registration error:", result.error);
      }
      
    } catch (error) {
      console.error("Unexpected error during registration:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
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
          source={require("../../assets/logo-2.png")}
          className="w-32 h-32"
          resizeMode="contain"
        />
      </View>

      {/* Title Content */}
      <SectionTitle
        hero={"Build Your Teaching Profile"}
        sub={
          "Select your subjects to connect with students who need your expertise"
        }
      />

      {/* Subject fiels */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              {isLoading ? "Processing..." : "AI Assistance"}
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
                      {selectedSubject}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        // REMOVE logic: Filter out the clicked subject
                        setSelected(
                          selected.filter((item) => item !== selectedSubject)
                        );
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
                      // Logic to "select" this tag
                      if (!selected.includes(subject)) {
                        setSelected((prev) => [...prev, subject]);
                      }

                      console.log("Selected:", subject);
                    }}
                  >
                    <Image
                      source={require("../../assets/check-mark.png")}
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
              text={registrationLoading ? "Creating Account..." : "Complete Registration"} 
              onPress={handleCompleteRegistration}
              disabled={registrationLoading || selected.length === 0}
            />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
