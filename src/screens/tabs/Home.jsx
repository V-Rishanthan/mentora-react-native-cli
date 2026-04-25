import { Search, X, Bell, BookOpen } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/authContext";
import ProgressCircle from "../../components/ProgressCircle";
import CourseCard from "../../components/CourseCard";
import { LinearGradient } from "expo-linear-gradient"; // add if available, else replace with View

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const { userProfile, courseData } = useAuth();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const firstName = useMemo(() => {
    const name = userProfile?.username || "";
    return name.split(" ")[0] || "Learner";
  }, [userProfile?.username]);

  const initial = useMemo(() => {
    return firstName.charAt(0).toUpperCase();
  }, [firstName]);

  const skills = [
    { percentage: 55, label: "React", color: "#6C63FF" },
    { percentage: 80, label: "Next.js", color: "#6C63FF" },
    { percentage: 95, label: "Java", color: "#6C63FF" },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* ── Hero Header with Gradient ── */}
      <View style={styles.heroSection}>
        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <View style={styles.logoWrapper}>
              <Image
                source={require("../../assets/logo-2.png")}
                style={{ width: 34, height: 34 }}
                resizeMode="contain"
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.greetingText}>{greeting}</Text>
              <Text style={styles.nameText}>{firstName} 👋</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.iconBtn}>
              <Bell size={18} color="#fff" />
              {/* Notification dot */}
              <View style={styles.notifDot} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.avatarBtn}
            >
              <Text style={styles.avatarText}>{initial}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero headline */}
        <View style={styles.heroTextBlock}>
          <Text style={styles.heroSub}>Explore & Learn</Text>
          <Text style={styles.heroTitle}>Find Your</Text>
          <Text style={styles.heroTitleAccent}>Favorite Course ✨</Text>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>240+</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>18k</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.9★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>

        {/* ── Search Bar ── */}
        <View style={styles.searchCard}>
          <Search size={18} color="#6C63FF" />
          <TextInput
            style={styles.searchInput}
            placeholderTextColor="#b0aac8"
            placeholder="Search courses, topics..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearBtn}
            >
              <X size={15} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── My Skills ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Skills</Text>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.skillsCard}>
            <View style={styles.skillsRow}>
              {skills.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <ProgressCircle
                    percentage={skill.percentage}
                    label={skill.label}
                    color={skill.color}
                    size={82}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Popular Courses ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Courses</Text>
            {courseData?.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{courseData.length} available</Text>
              </View>
            )}
          </View>

          <CourseCard searchQuery={searchQuery} />
        </View>
      </View>
    </ScrollView>
  );
};

const PURPLE = "#6C63FF";
const PURPLE_DARK = "#4A42CC";
const PURPLE_DEEP = "#2E2880";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F3FF",
  },

  /* ── Hero ── */
  heroSection: {
    backgroundColor: PURPLE,
    paddingTop: 52,
    paddingHorizontal: 22,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    position: "relative",
  },
  decorCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -50,
    right: -50,
  },
  decorCircle2: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: 10,
    left: -30,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  greetingText: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  nameText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B6B",
    borderWidth: 1.5,
    borderColor: PURPLE,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: PURPLE,
    fontSize: 16,
    fontWeight: "900",
  },

  heroTextBlock: {
    marginBottom: 24,
  },
  heroSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  heroTitleAccent: {
    color: "#FFE066",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    letterSpacing: -0.5,
  },

  statsStrip: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  /* ── Body ── */
  body: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  /* ── Search ── */
  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 28,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#2d2b4e",
    marginLeft: 10,
    fontWeight: "500",
  },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── Sections ── */
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#1a1836",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  seeAllBtn: {
    backgroundColor: "#ede9ff",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  seeAllText: {
    color: PURPLE,
    fontSize: 12,
    fontWeight: "700",
  },

  /* ── Skills Card ── */
  skillsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  skillsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  skillItem: {
    alignItems: "center",
  },

  /* ── Badge ── */
  badge: {
    backgroundColor: "#ede9ff",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: PURPLE,
    fontSize: 12,
    fontWeight: "700",
  },
});

export default HomeScreen;