import { Search, X } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import ProgressCircle from "../../components/ProgressCircle";
import CourseCard from "../../components/CourseCard";

const HomeScreen = () => {

    const [searchQuery, setSearchQuery] = useState("");
  // Skills data
  const skills = [
    { percentage: 55, label: "React", color: "#8681FB" },
    { percentage: 80, label: "Next.js", color: "#8681FB" },
    { percentage: 95, label: "Java", color: "#8681FB" },
  ];

  const router = useNavigation()

  return (
    <ScrollView
      className="flex-1 px-6 relative bg-secondary mt-6"
      showsVerticalScrollIndicator={false}
    >
      <StatusBar translucent backgroundColor="transparent" 
                barStyle="dark-content" />
      {/* Header Section */}
      <View className="flex-row justify-between items-center mt-2">
        {/* Logo - Left side */}
        <View>
          <Image
            source={require("../../assets/logo-2.png")}
            className="w-32 h-32"
            resizeMode="contain"
          />
        </View>

        {/* Profile image - Right side */}
        <TouchableOpacity
        onPress={()=>router.push("Profile")}
        className="w-16 h-16 rounded-full overflow-hidden border">
          <Image
            source={require("../../assets/profile.jpg")}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      {/* Hero text */}
      <View className="mb-4">
        <Text className="text-3xl  font-outfit-semibold text-gray">
          Find your <Text className="text-primary">Favorite</Text>
        </Text>
        <Text className="text-3xl  font-outfit-semibold text-gray ">
          Online Course
        </Text>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center rounded-xl border border-light bg-white px-4">
        <Search size={20} color="#9ca3af" />
        <TextInput
          className="flex-1 text-base py-4 ml-3"
          placeholderTextColor="#9ca3af"
          placeholder="Search here..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <X size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Info box */}
      <View className="mt-6 bg-primary px-7 py-3 rounded-lg">
        <Text className="text-2xl text-center  text-WHITE font-outfit-semibold">
          My Activities
        </Text>
        <Text className="text-base text-white font-outfit-medium text-justify">
          Shows all subjects the user has started but not yet completed.
        </Text>
      </View>

      {/* Progress Circles Section */}
      <View className="mb-10 mt-8">
        {/* Progress Circles Row */}
        <View className="flex-row justify-between">
          {skills.map((skill, index) => (
            <ProgressCircle
              key={index}
              percentage={skill.percentage}
              label={skill.label}
              color={skill.color}
              size={90}
            />
          ))}
        </View>
      </View>

      {/*courses content Section */}
      <View className="mb-10">
        <Text className="font-outfit-semibold text-lg text-gray mb-4">
          Popular Courses
        </Text>
        {/*  courses content here */}
        <CourseCard />
      </View>
    </ScrollView>
  )
}

export default HomeScreen