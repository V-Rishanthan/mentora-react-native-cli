import * as ImagePicker from "expo-image-picker";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Clock,
  FileText,
  Image as ImageIcon,
  Tag,
  Upload,
  X
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from "../../components/Button";

export default function AddSubject() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

  // Form state - consolidated into single object
  const [formData, setFormData] = useState({
    subjectName: "",
    category: "",
    duration: "",
    description: "",
    thumbnail: "",
  });

  // Update form data
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Categories
  const categories = [
    "Mathematics",
    "Science",
    "Programming & IT",
    "Languages",
    "Business",
    "Arts & Design",
    "Music",
    "Test Preparation",
    "Life Skills",
    "Health & Fitness",
    "Other",
  ];

  // Pick image from gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const type = asset.uri.split('.').pop();
        const imageUri = `data:image/${type};base64,${asset.base64}`;
        console.log(imageUri.substring(0, 20));
        setThumbnail(imageUri);
        handleChange("thumbnail", imageUri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Save teacher data function
  const saveTeacherData = async (data) => {
    try {
      const existingData = await AsyncStorage.getItem('@teacher_registration_data');
      const parsedData = existingData ? JSON.parse(existingData) : {};
      
      const updatedData = { ...parsedData, ...data };
      await AsyncStorage.setItem('@teacher_registration_data', JSON.stringify(updatedData));
      return { success: true };
    } catch (error) {
      console.error("Error saving teacher data:", error);
      return { success: false, error };
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validation
    if (!formData.subjectName.trim()) {
      Alert.alert("Required", "Please enter subject name");
      return;
    }
    if (!formData.category.trim()) {
      Alert.alert("Required", "Please select a category");
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert("Required", "Please enter subject description");
      return;
    }
    if (!formData.duration.trim()) {
      Alert.alert("Required", "Please enter duration");
      return;
    }

    setLoading(true);

    try {
      // Save to AsyncStorage
      const result = await saveTeacherData({
        subjectName: formData.subjectName.trim(),
        category: formData.category.trim(),
        duration: formData.duration,
        description: formData.description.trim(),
        thumbnail: formData.thumbnail,
        subjectAddedAt: new Date().toISOString(),
      });

      if (result.success) {
        navigation.navigate("teacherSubjectSuggestion");
      } else {
        Alert.alert("Error", "Failed to save subject. Please try again.");
      }

    } catch (error) {
      console.error("Error saving subject:", error);
      Alert.alert("Error", "Failed to save subject. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Character count for description
  const charCount = formData.description.length;
  const maxChars = 500;

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-primary pt-12 px-6 pb-6">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={handleBack}
            className="bg-white/20 w-10 h-10 rounded-full items-center justify-center mr-4"
          >
            <ArrowLeft size={22} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-outfit-bold text-white">
            Add New Subject
          </Text>
        </View>
        
        <View className="items-center">
          <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3">
            <BookOpen size={32} color="white" />
          </View>
          <Text className="text-white text-lg font-outfit-semibold text-center">
            Share Your Expertise
          </Text>
          <Text className="text-white/80 text-center mt-1 font-outfit">
            Fill in the details about your subject
          </Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 py-8">
          {/* Subject Name */}
          <View className="mb-8">
            <Text className="text-xl font-outfit-semibold text-grayPro-800 mb-4">
              Subject Name *
            </Text>
            
            <View className="flex-row items-center rounded-xl border border-grayPro-300 px-4 mb-2">
              <TextInput
                className="flex-1 text-grayPro-800 text-base py-4 font-outfit"
                placeholder="What subject will you teach?"
                placeholderTextColor="#9ca3af"
                value={formData.subjectName}
                onChangeText={(value) => handleChange("subjectName", value)}
              />
              <BookOpen size={18} color="#c7c7c8" />
            </View>
            
            <Text className="text-grayPro-500 text-sm font-outfit ml-1">
              Choose a clear and descriptive name
            </Text>
          </View>

          {/* Category Selection */}
          <View className="mb-8">
            <Text className="text-xl font-outfit-semibold text-grayPro-800 mb-4">
              Category *
            </Text>
            
            <TouchableOpacity
              onPress={() => setShowCategoryModal(true)}
              className="flex-row items-center rounded-xl border border-grayPro-300 px-4 py-4 mb-2"
            >
              <Tag size={18} color="#c7c7c8" className="mr-2" />
              <Text className={`flex-1 text-base ${formData.category ? 'text-grayPro-800' : 'text-grayPro-400'} font-outfit`}>
                {formData.category || "Select a category"}
              </Text>
              <ChevronDown size={20} color="#c7c7c8" />
            </TouchableOpacity>
            
            <Text className="text-grayPro-500 text-sm font-outfit ml-1">
              Help students find your subject
            </Text>
          </View>

          {/* Duration Selection */}
          <View className="mb-8">
            <Text className="text-xl font-outfit-semibold text-grayPro-800 mb-4">
              Time Duration (hours) *
            </Text>
            
            <View className="flex-row items-center rounded-xl border border-grayPro-300 px-4 mb-2">
              <TextInput
                className="flex-1 text-grayPro-800 text-base py-4 font-outfit"
                placeholder="e.g., 10 hours total"
                placeholderTextColor="#9ca3af"
                value={formData.duration}
                onChangeText={(value) => handleChange("duration", value)}
                keyboardType="numeric"
              />
              <Clock size={18} color="#c7c7c8" />
            </View>
            
            <Text className="text-grayPro-500 text-sm font-outfit ml-1">
              Estimated total teaching hours
            </Text>
          </View>

          {/* Description */}
          <View className="mb-8">
            <Text className="text-xl font-outfit-semibold text-grayPro-800 mb-4">
              Description *
            </Text>
            
            <View className="rounded-xl border border-grayPro-300 px-4 pt-4 mb-2">
              <View className="flex-row items-start">
                <FileText size={18} color="#c7c7c8" className="mr-2 mt-1" />
                <TextInput
                  className="flex-1 text-grayPro-800 text-base min-h-[140px] font-outfit"
                  placeholder="Describe what students will learn, your teaching approach, and any important details..."
                  placeholderTextColor="#9ca3af"
                  value={formData.description}
                  onChangeText={(value) => handleChange("description", value)}
                  multiline
                  textAlignVertical="top"
                />
              </View>
              
              <View className="flex-row justify-between items-center py-3 border-t border-grayPro-200">
                <Text className="text-grayPro-500 text-sm font-outfit">
                  Be detailed to attract students
                </Text>
                <Text className={`text-sm font-outfit ${
                  charCount > maxChars ? 'text-red-500' : 'text-grayPro-500'
                }`}>
                  {charCount}/{maxChars}
                </Text>
              </View>
            </View>
          </View>

          {/* Thumbnail Upload */}
          <View className="mb-10">
            <Text className="text-xl font-outfit-semibold text-grayPro-800 mb-4">
              Thumbnail Image
            </Text>
            
            {thumbnail ? (
              <View className="relative mb-3">
                <Image
                  source={{ uri: thumbnail }}
                  className="w-full h-56 rounded-xl"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => {
                    setThumbnail(null);
                    handleChange("thumbnail", "");
                  }}
                  className="absolute top-3 right-3 bg-grayPro-800/80 w-10 h-10 rounded-full items-center justify-center"
                >
                  <X size={20} color="white" />
                </TouchableOpacity>
                <View className="absolute bottom-3 left-3 bg-grayPro-800/80 px-3 py-1 rounded-full">
                  <Text className="text-white text-sm font-outfit">Tap to change</Text>
                </View>
              </View>
            ) : (
              <View className="border-2 border-dashed border-grayPro-300 rounded-xl p-6 items-center justify-center bg-grayPro-50 mb-3">
                <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-4">
                  <ImageIcon size={28} color="#4F46E5" />
                </View>
                <Text className="text-grayPro-700 text-lg font-outfit-medium mb-1 text-center">
                  Upload Thumbnail
                </Text>
                <Text className="text-grayPro-500 text-center mb-6 font-outfit">
                  Add an eye-catching image for your subject
                </Text>
                
                <View className="flex-row space-x-3 w-full">
                  <TouchableOpacity
                    onPress={pickImage}
                    className="flex-1 bg-primary py-3 rounded-lg items-center flex-row justify-center"
                  >
                    <Upload size={18} color="white" className="mr-2" />
                    <Text className="text-white font-outfit-semibold">Gallery</Text>
                  </TouchableOpacity>
                </View>
                
                <Text className="text-grayPro-400 text-sm mt-4 font-outfit">
                  Recommended: 16:9 ratio, max 5MB
                </Text>
              </View>
            )}
            
            <Text className="text-grayPro-500 text-sm font-outfit ml-1">
              A good thumbnail increases engagement
            </Text>
          </View>

          {/* Submit Button */}
          <View className="mb-8">
            <Button
              text={loading ? "Adding Subject..." : "Add Subject"}
              onPress={handleSubmit}
              disabled={loading}
              fullWidth
            />
            
            <TouchableOpacity
              onPress={handleBack}
              className="mt-4 py-3 items-center"
            >
              <Text className="text-grayPro-600 font-outfit">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View className="flex-1 bg-grayPro-800/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-outfit-bold text-grayPro-800">
                Select Category
              </Text>
              <TouchableOpacity
                onPress={() => setShowCategoryModal(false)}
                className="w-10 h-10 items-center justify-center"
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    handleChange("category", cat);
                    setShowCategoryModal(false);
                  }}
                  className={`py-4 px-4 rounded-xl mb-2 flex-row items-center ${
                    formData.category === cat ? 'bg-primary/10 border border-primary/30' : 'bg-grayPro-50'
                  }`}
                >
                  <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                    formData.category === cat ? 'bg-primary' : 'bg-grayPro-200'
                  }`}>
                    <Tag size={20} color={formData.category === cat ? 'white' : '#6B7280'} />
                  </View>
                  <Text className={`text-lg font-outfit ${
                    formData.category === cat ? 'text-primary font-outfit-semibold' : 'text-grayPro-700'
                  }`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              onPress={() => {
                handleChange("category", "");
                setShowCategoryModal(false);
              }}
              className="py-4 px-4 rounded-xl bg-grayPro-100 flex-row items-center justify-center mt-4"
            >
              <Text className="text-grayPro-600 font-outfit">Clear Selection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}