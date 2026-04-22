import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  BookOpen,
  Play,
  Video,
  Calendar,
  Plus,
  Clock,
  Tag,
  Users,
  MessageSquareText,
  GraduationCap,
  Layers,
} from 'lucide-react-native';
import { useAuth } from '../../context/authContext';

const { width: screenWidth } = Dimensions.get('window');

// ─── Dummy course folder images (rotate through them as fallback) ───────────
const DUMMY_COURSE_IMAGES = [
  require('../../assets/course/course-1.png'),
  require('../../assets/course/course-2.png'),
  require('../../assets/course/course-3.png'),
  require('../../assets/course/course-4.png'),
  require('../../assets/course/course-5.png'),
];

const getDummyImage = (index) => DUMMY_COURSE_IMAGES[index % DUMMY_COURSE_IMAGES.length];

// ─── Course Card Component ───────────────────────────────────────────────────
const CourseCard = ({ course, index, onViewDetails }) => {
  const [imgError, setImgError] = useState(false);

  // Resolve thumbnail: could be string URL or null/undefined
  const hasRemoteThumb = !!course.thumbnail && typeof course.thumbnail === 'string' && !imgError;
  const topicsCount = Array.isArray(course.content) ? course.content.length : 0;

  return (
    <TouchableOpacity
      className="mb-6 rounded-[24px] overflow-hidden"
      style={{
        shadowColor: '#8681FB',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        backgroundColor: '#fff',
      }}
      onPress={() => onViewDetails(course)}
      activeOpacity={0.88}
    >
      {/* ── Course Thumbnail ── */}
      <View className="relative" style={{ height: 180 }}>
        {hasRemoteThumb ? (
          <Image
            source={{ uri: course.thumbnail }}
            style={{ width: '100%', height: 180 }}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <Image
            source={getDummyImage(index)}
            style={{ width: '100%', height: 180 }}
            resizeMode="cover"
          />
        )}

        {/* Dark overlay for text legibility */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: 'transparent',
          }}
          className="bg-gradient-to-t from-black/60 to-transparent"
        />

        {/* Category Badge */}
        <View className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full">
          <Text className="text-primary text-[10px] font-black uppercase tracking-widest">
            {course.category || 'Course'}
          </Text>
        </View>

        {/* Topics Count Badge */}
        {topicsCount > 0 && (
          <View className="absolute top-4 right-4 bg-primary px-3 py-1.5 rounded-full flex-row items-center">
            <Layers size={10} color="#fff" />
            <Text className="text-white text-[10px] font-bold ml-1">
              {topicsCount} {topicsCount === 1 ? 'Topic' : 'Topics'}
            </Text>
          </View>
        )}
      </View>

      {/* ── Course Details ── */}
      <View className="bg-white p-5">
        {/* Title */}
        <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={2}>
          {course.title || 'Untitled Course'}
        </Text>

        {/* Description */}
        {!!course.description && course.description !== 'No description available' && (
          <Text className="text-gray-500 text-sm mb-3 leading-5" numberOfLines={2}>
            {course.description}
          </Text>
        )}

        {/* Meta row */}
        <View className="flex-row items-center mb-4">
          <View className="flex-row items-center mr-5">
            <Clock size={14} color="#8681FB" />
            <Text className="text-gray-500 text-xs ml-1.5">
              {course.duration || 'Flexible'}
            </Text>
          </View>

          <View className="flex-row items-center mr-5">
            <Tag size={14} color="#8681FB" />
            <Text className="text-gray-500 text-xs ml-1.5">
              {course.category || 'General'}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Users size={14} color="#8681FB" />
            <Text className="text-gray-500 text-xs ml-1.5">
              {course.totalStudents || 0} Students
            </Text>
          </View>
        </View>

        {/* Topics preview */}
        {topicsCount > 0 && (
          <View className="bg-gray-50 rounded-xl p-3 mb-4">
            <Text className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
              Course Topics
            </Text>
            {course.content.slice(0, 3).map((topic, i) => (
              <View key={i} className="flex-row items-center mb-1">
                <View className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                <Text className="text-gray-600 text-xs flex-1" numberOfLines={1}>
                  {typeof topic === 'string' ? topic : topic?.title || topic?.name || `Topic ${i + 1}`}
                </Text>
              </View>
            ))}
            {topicsCount > 3 && (
              <Text className="text-primary text-xs font-semibold mt-1">
                +{topicsCount - 3} more topics
              </Text>
            )}
          </View>
        )}

        {/* Explore Button */}
        <TouchableOpacity
          className="bg-primary flex-row items-center justify-center py-3.5 rounded-xl"
          onPress={() => onViewDetails(course)}
        >
          <Text className="text-white font-bold text-sm mr-2">Explore Course</Text>
          <Play size={15} color="white" fill="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// ─── Stats Card ─────────────────────────────────────────────────────────────
const StatCard = ({ value, label, color }) => (
  <View className="flex-1 items-center bg-white rounded-2xl py-4 mx-1.5 shadow-sm">
    <Text style={{ color }} className="text-2xl font-black">
      {value}
    </Text>
    <Text className="text-gray-500 text-xs mt-1 font-medium">{label}</Text>
  </View>
);

// ─── Main TeacherHome Screen ─────────────────────────────────────────────────
const TeacherHome = () => {
  const navigation = useNavigation();
  const { user: authUser, userProfile, fetchUserProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [teacherCourses, setTeacherCourses] = useState([]);

  // Format current date
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  // Build course list from teacher's subjects stored in Firestore
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        // If userProfile not yet loaded, re-fetch it
        let profile = userProfile;
        if (!profile && authUser?.uid) {
          profile = await fetchUserProfile(authUser.uid);
        }

        if (profile) {
          const subjectsList = Array.isArray(profile.subjects) ? profile.subjects : [];
          console.log('Subjects from Firestore:', subjectsList);

          const courses = subjectsList.map((subject, index) => ({
            id: subject.subjectId || subject.subjectAddedAt || String(index),
            title:
              subject.name ||
              subject.subjectName ||
              subject.title ||
              'Untitled Subject',
            category: subject.category || 'General',
            description:
              subject.description ||
              subject.about ||
              null,
            duration: subject.duration ? `${subject.duration} hrs` : 'Flexible',
            // thumbnail is stored as a plain URL string
            thumbnail:
              typeof subject.thumbnail === 'string' && subject.thumbnail.length > 0
                ? subject.thumbnail
                : null,
            // content/topics array
            content: Array.isArray(subject.content)
              ? subject.content
              : Array.isArray(subject.topics)
                ? subject.topics
                : [],
            totalStudents: subject.totalStudents || 0,
            createdAt: subject.subjectAddedAt || subject.createdAt || new Date().toISOString(),
          }));

          setTeacherCourses(courses);
          console.log('Mapped teacher courses:', courses);
        }
      } catch (err) {
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      loadCourses();
    } else {
      navigation.navigate('Login');
    }
  }, [authUser, userProfile]);

  const handleViewCourseDetails = course => {
    navigation.navigate('CourseDetails', { courseId: course.id });
  };

  const handleCreateCourse = () => {
    navigation.navigate('AddSubject');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleLiveStreaming = () => {
    navigation.navigate('LiveHome');
  };

  // Teacher initial avatar
  const teacherInitial = useMemo(() => {
    const n = (userProfile?.username || 'T').trim();
    return n.length ? n[0].toUpperCase() : 'T';
  }, [userProfile?.username]);

  // Total topics across all courses
  const totalTopics = useMemo(
    () => teacherCourses.reduce((sum, c) => sum + (c.content?.length || 0), 0),
    [teacherCourses],
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#8681FB" />
        <Text className="mt-4 text-gray-500 font-medium">Loading your courses...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── Header ── */}
        <View className="bg-white px-5 pb-5 pt-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-gray-400 text-sm">Welcome back,</Text>
              <Text className="text-2xl font-black text-gray-900" numberOfLines={1}>
                {userProfile?.username || authUser?.displayName || 'Teacher'}
              </Text>
              {!!userProfile?.specialization && (
                <Text className="text-primary text-xs font-semibold mt-0.5">
                  {userProfile.specialization}
                </Text>
              )}
            </View>

            <View className="flex-row items-center">
              {/* Chat */}
              <TouchableOpacity
                className="bg-gray-100 w-11 h-11 rounded-full items-center justify-center mr-2"
                onPress={() => navigation.navigate('TeacherChat')}
              >
                <MessageSquareText size={20} color="#8681FB" />
                <View className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              </TouchableOpacity>

              {/* Live */}
              <TouchableOpacity
                onPress={handleLiveStreaming}
                className="bg-gray-100 w-11 h-11 rounded-full items-center justify-center mr-2"
              >
                <Video size={20} color="#8681FB" />
              </TouchableOpacity>

              {/* Avatar */}
              <TouchableOpacity
                onPress={handleProfilePress}
                className="w-11 h-11 rounded-full bg-primary items-center justify-center"
              >
                <Text className="text-white text-lg font-black">{teacherInitial}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date */}
          <View className="flex-row items-center mt-4">
            <Calendar size={16} color="#8681FB" />
            <Text className="ml-2 text-gray-600 text-sm font-medium">{formattedDate}</Text>
          </View>
        </View>

        {/* ── Stats Row ── */}
        {teacherCourses.length > 0 && (
          <View className="flex-row mx-5 mt-5">
            <StatCard
              value={teacherCourses.length}
              label="Courses"
              color="#8681FB"
            />
            <StatCard
              value={teacherCourses.reduce((s, c) => s + (c.totalStudents || 0), 0)}
              label="Students"
              color="#22C55E"
            />
            <StatCard
              value={totalTopics}
              label="Topics"
              color="#A855F7"
            />
          </View>
        )}

        {/* ── Section Header ── */}
        <View className="flex-row justify-between items-center px-5 mt-7 mb-4">
          <View>
            <Text className="text-xl font-black text-gray-900">My Courses</Text>
            <Text className="text-gray-400 text-xs mt-0.5">
              {teacherCourses.length > 0
                ? `${teacherCourses.length} course${teacherCourses.length > 1 ? 's' : ''} created`
                : 'No courses yet'}
            </Text>
          </View>

          <TouchableOpacity
            className="flex-row items-center bg-primary px-4 py-2.5 rounded-full"
            onPress={handleCreateCourse}
          >
            <Plus size={16} color="white" />
            <Text className="text-white text-xs font-bold ml-1">Add Course</Text>
          </TouchableOpacity>
        </View>

        {/* ── Course List ── */}
        <View className="px-5">
          {teacherCourses.length > 0 ? (
            teacherCourses.map((course, index) => (
              <CourseCard
                key={course.id || index}
                course={course}
                index={index}
                onViewDetails={handleViewCourseDetails}
              />
            ))
          ) : (
            /* ── Empty State ── */
            <View className="mt-4 bg-white rounded-[28px] p-10 items-center shadow-sm">
              <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-5">
                <GraduationCap size={44} color="#8681FB" />
              </View>
              <Text className="text-xl font-black text-gray-800 mb-2 text-center">
                No Courses Yet
              </Text>
              <Text className="text-gray-400 text-sm text-center leading-6 mb-8">
                Create your first course and start sharing your knowledge with students.
              </Text>
              <TouchableOpacity
                className="bg-primary flex-row items-center px-8 py-4 rounded-full"
                onPress={handleCreateCourse}
              >
                <Plus size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Create First Course
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TeacherHome;
