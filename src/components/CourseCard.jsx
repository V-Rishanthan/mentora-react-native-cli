import { useNavigation } from "@react-navigation/native";
import { Star, Timer, BookOpen, User2 } from "lucide-react-native";
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

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.65;
const SIDE_PADDING = 20;

// ── Rotating dummy course folder images ──────────────────────────────────────
const DUMMY_IMAGES = [
  require("../assets/course/course-1.png"),
  require("../assets/course/course-2.png"),
  require("../assets/course/course-3.png"),
  require("../assets/course/course-4.png"),
  require("../assets/course/course-5.png"),
];

export default function CourseCard({ searchQuery = "" }) {
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

  // Apply both category filter and search query filter
  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (c.subjectName || "").toLowerCase().includes(q) ||
      (c.category || "").toLowerCase().includes(q) ||
      (c.instructor || "").toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleCoursePress = (course) => {
    navigation.push("CourseDetails", { course });
  };

  const renderCourse = ({ item, index }) => {
    // Resolve thumbnail — stored as plain string URL or object with .uri
    const thumbUri =
      typeof item.thumbnail === "string" && item.thumbnail.length > 0
        ? item.thumbnail
        : item.thumbnail?.uri || null;

    // Fallback to rotating course folder image
    const imageSource = thumbUri
      ? { uri: thumbUri }
      : DUMMY_IMAGES[index % DUMMY_IMAGES.length];

    // Topics/subjects count
    const topicsCount = Array.isArray(item.subjects)
      ? item.subjects.length
      : 0;

    // Duration label
    const durationLabel = item.duration && item.duration !== "0h"
      ? item.duration
      : "Flexible";

    return (
      <TouchableOpacity
        style={{
          height: 240,
          width: CARD_WIDTH,
          marginRight: 20,
          marginBottom: 20,
          borderRadius: 32,
          overflow: "hidden",
          shadowColor: "#8681FB",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.18,
          shadowRadius: 12,
          elevation: 8,
        }}
        activeOpacity={0.9}
        onPress={() => handleCoursePress(item)}
      >
        <ImageBackground
          source={imageSource}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        >
          {/* Dark gradient overlay */}
          <View
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.32)", justifyContent: "flex-end", padding: 18 }}
          >
            {/* Category badge - top left */}
            <View style={{ position: "absolute", top: 16, left: 16 }}>
              {item.category ? (
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      color: "#8681FB",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                    }}
                  >
                    {item.category}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Rating badge - top right */}
            <View
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.2)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 10,
              }}
            >
              <Star size={11} color="#FFD700" fill="#FFD700" />
              <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700", marginLeft: 3 }}>
                {item.rating > 0 ? item.rating.toFixed(1) : "New"}
              </Text>
            </View>

            {/* Course title */}
            <Text
              style={{ color: "#fff", fontSize: 18, fontWeight: "800", lineHeight: 24, marginBottom: 10 }}
              numberOfLines={2}
            >
              {item.subjectName || item.description || "Untitled Course"}
            </Text>

            {/* Meta row */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Duration */}
                <View style={{ flexDirection: "row", alignItems: "center", marginRight: 14 }}>
                  <Timer size={13} color="#fff" strokeWidth={2.5} />
                  <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700", marginLeft: 4 }}>
                    {durationLabel}
                  </Text>
                </View>
                {/* Topics */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <BookOpen size={13} color="#fff" strokeWidth={2.5} />
                  <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700", marginLeft: 4 }}>
                    {topicsCount > 0 ? `${topicsCount} Topics` : "Topics"}
                  </Text>
                </View>
              </View>

              {/* Instructor */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <User2 size={11} color="rgba(255,255,255,0.8)" />
                <Text
                  style={{ color: "rgba(255,255,255,0.85)", fontSize: 10, fontWeight: "600", marginLeft: 3 }}
                  numberOfLines={1}
                >
                  {item.instructor || "Instructor"}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  if (loadingCourses) {
    return (
      <View style={{ height: 240, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#8681FB" />
        <Text style={{ color: "#9ca3af", marginTop: 8, fontSize: 13 }}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View>
      {/* Category Filter */}
      <View style={{ marginBottom: 16 }}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                marginRight: 10,
                paddingHorizontal: 18,
                paddingVertical: 8,
                borderRadius: 50,
                backgroundColor: selectedCategory === item ? "#8681FB" : "#fff",
                borderWidth: 1,
                borderColor: selectedCategory === item ? "#8681FB" : "#e5e7eb",
              }}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 12,
                  color: selectedCategory === item ? "#fff" : "#9ca3af",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Horizontal Course Slider */}
      <FlatList
        data={filteredCourses}
        renderItem={renderCourse}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        snapToInterval={CARD_WIDTH + 20}
        decelerationRate="fast"
        contentContainerStyle={{ paddingRight: 20 }}
        ListEmptyComponent={() => (
          <View
            style={{ width: width - 40, alignItems: "center", justifyContent: "center", paddingVertical: 40 }}
          >
            <BookOpen size={40} color="#d1d5db" />
            <Text style={{ color: "#9ca3af", marginTop: 12, fontSize: 14 }}>
              No courses available
            </Text>
          </View>
        )}
      />
    </View>
  );
}