import { useNavigation } from "@react-navigation/native";
import { Star, Timer, BookOpen } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useAuth } from "../context/authContext";

const { width } = Dimensions.get('window');
// const CARD_WIDTH = width * 0.82; // Card takes up 82% of screen width
const CARD_WIDTH = width * 0.65;   // 1 full + next half peek
const SPACING = 16;               // gap between cards
const SIDE_PADDING = 20;          // left/right padding

export default function CourseCard() {
  const navigation = useNavigation();
  const { fetchCourseData, loadingCourses } = useAuth();

  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchCourseData();
      if (result.success) {
        setCourses(result.data);
        const uniqueCategories = [
          "All",
          ...new Set(result.data.map((c) => c.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      }
    };
    fetchData();
  }, []);

  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  const handleCoursePress = (course) => {
    navigation.push("CourseDetails", { course });
  };

  const renderCourse = ({ item }) => {
    const thumbUri = typeof item.thumbnail === "string" 
      ? item.thumbnail 
      : item.thumbnail?.uri;

    return (
      <TouchableOpacity
        className="mr-5 mb-20 rounded-[32px] overflow-hidden shadow-lg bg-gray-200"
        style={{ 
            height: 240, 
            width: CARD_WIDTH, // Fixed width for slider
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
        }} 
        activeOpacity={0.9}
        onPress={() => handleCoursePress(item)}
      >
        <ImageBackground
          source={thumbUri ? { uri: thumbUri } : require("../assets/course/course-1.png")}
          className="w-full h-full"
          resizeMode="cover"
        >
          <View className="flex-1 bg-black/30 justify-end p-6">
            <View className="absolute top-5 left-5">
              {item.category && (
                <View className="bg-white/95 px-3 py-1.5 rounded-xl">
                  <Text className="text-[10px] text-primary font-black uppercase tracking-widest">
                    {item.category}
                  </Text>
                </View>
              )}
            </View>

            <View>
              <Text 
                className="text-white text-xl font-bold leading-tight mb-3"
                numberOfLines={2}
              >
                {item.subjectName}
              </Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="flex-row items-center mr-4">
                    <Timer size={14} color="#FFFFFF" strokeWidth={2.5} />
                    <Text className="text-white text-[11px] font-bold ml-1">2h 30m</Text>
                  </View>
                  <View className="flex-row items-center">
                    <BookOpen size={14} color="#FFFFFF" strokeWidth={2.5} />
                    <Text className="text-white text-[11px] font-bold ml-1">12 Lessons</Text>
                  </View>
                </View>

                <View className="flex-row items-center bg-white/20 px-2 py-1 rounded-lg">
                   <Star size={12} color="#FFD700" fill="#FFD700" />
                   <Text className="text-white text-[10px] font-bold ml-1">4.8</Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  if (loadingCourses) {
    return (
      <View className="h-[240px] justify-center items-center">
        <ActivityIndicator size="small" color="#8681FB" />
      </View>
    );
  }

  return (
    <View>
      {/* Category Filter - Keep this at the top */}
      <View className="mb-4">
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`mr-3 px-5 py-2 rounded-full border ${
                selectedCategory === item 
                  ? "bg-primary border-primary" 
                  : "bg-white border-gray-100"
              }`}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                className={`font-bold text-xs ${
                  selectedCategory === item ? "text-white" : "text-gray-400"
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* The Main Horizontal Slider */}
      <FlatList
        data={filteredCourses}
        renderItem={renderCourse}
        horizontal // Enables horizontal scrolling
        showsHorizontalScrollIndicator={false} // Hides the bar
        keyExtractor={(item) => String(item.id)}
        snapToInterval={CARD_WIDTH + 20} // Snap effect (Card width + margin)
        decelerationRate="fast"
        contentContainerStyle={{ paddingRight: width - (SIDE_PADDING + CARD_WIDTH), paddingRight: 20 }}
        ListEmptyComponent={() => (
          <View style={{ width: width - 40 }} className="items-center justify-center py-10">
            <Text className="text-gray-400">No courses in this category</Text>
          </View>
        )}
      />
    </View>
  );
}