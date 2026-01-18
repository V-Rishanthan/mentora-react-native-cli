import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BookOpen, Play, Bell, Calendar, Plus, Clock, Tag, Users } from 'lucide-react-native';
import { useAuth } from '../../context/authContext';

const { width: screenWidth } = Dimensions.get('window');

const CourseCard = ({ course, onViewDetails }) => {
  return (
    <TouchableOpacity 
      className="mb-6"
      onPress={() => onViewDetails(course)}
      activeOpacity={0.9}
    >
      {/* Course Image Banner */}
      <View className="relative rounded-t-[24px] overflow-hidden">
        {course.thumbnail ? (
          <Image
            source={{ uri: course.thumbnail }}
            className="w-full h-48"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-48 bg-gradient-to-r from-primary to-purple-600 items-center justify-center">
            <BookOpen size={60} color="white" />
          </View>
        )}
        
        {/* Category Badge */}
        <View className="absolute top-4 left-4 bg-black/70 px-3 py-1.5 rounded-full">
          <Text className="text-white text-xs font-bold">
            {course.category || 'COURSE'}
          </Text>
        </View>
      </View>

      {/* Course Content */}
      <View className="bg-white p-6 rounded-b-[24px] border border-grayPro-100 shadow-sm">
        {/* Title */}
        <Text className="text-xl font-bold text-grayPro-800 mb-3">
          {course.title || 'Untitled Course'}
        </Text>

        {/* Description */}
        {course.description && (
          <Text className="text-grayPro-600 text-sm mb-4 leading-5" numberOfLines={3}>
            {course.description}
          </Text>
        )}

        {/* Course Info */}
        <View className="flex-row items-center justify-between mb-5">
          {/* Duration */}
          <View className="flex-row items-center">
            <Clock size={16} color="#6B7280" />
            <Text className="text-grayPro-600 text-sm ml-2">
              {course.duration || 'Flexible'}
            </Text>
          </View>

          {/* Category */}
          <View className="flex-row items-center">
            <Tag size={16} color="#6B7280" />
            <Text className="text-grayPro-600 text-sm ml-2">
              {course.category || 'General'}
            </Text>
          </View>

          {/* Students (mock data) */}
          <View className="flex-row items-center">
            <Users size={16} color="#6B7280" />
            <Text className="text-grayPro-600 text-sm ml-2">0</Text>
          </View>
        </View>

        {/* View Course Button */}
        <TouchableOpacity 
          className="bg-primary flex-row items-center justify-center py-4 rounded-xl"
          onPress={() => onViewDetails(course)}
        >
          <Text className="text-white font-bold text-lg mr-2">Explore Course</Text>
          <Play size={18} color="white" fill="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const TeacherHome = () => {
  const navigation = useNavigation();
  const { user: authUser, userProfile, selectedRole } = useAuth();
  
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

  // Extract teacher's courses from profile data
  useEffect(() => {
    if (authUser && userProfile && selectedRole === 'teacher') {
      console.log("Teacher Profile Data:", userProfile);
      
      // Create course data from teacher's profile
      const courses = [];
      
      // If teacher has subjectName from AddSubject screen, create a course from it
      if (userProfile.subjectName) {
        courses.push({
          id: '1',
          title: userProfile.subjectName,
          category: userProfile.category || 'General',
          description: userProfile.description || 'No description available',
          duration: userProfile.duration || 'Flexible hours',
          thumbnail: userProfile.thumbnail || null,
          createdAt: userProfile.subjectAddedAt || new Date().toISOString(),
        });
      }
      
      // If teacher has subjects array (from TeacherSubjectSuggestion screen)
      if (userProfile.subjectName && Array.isArray(userProfile.subjectName)) {
        userProfile.subjectName.forEach((subject, index) => {
          courses.push({
            id: `subject-${index + 2}`,
            title: subject,
            category: userProfile.specialization || 'General',
            description: `Comprehensive course covering all aspects of ${subject}. Perfect for beginners and intermediate learners.`,
            duration: '12 hours',
            thumbnail: `https://source.unsplash.com/random/400x300/?${subject.toLowerCase().replace(/\s+/g, ',')}`,
            createdAt: new Date().toISOString(),
          });
        });
      }
      
      // If teacher has other course data in profile
      if (userProfile.courses && Array.isArray(userProfile.courses)) {
        courses.push(...userProfile.courses);
      }
      
      setTeacherCourses(courses);
      console.log("Teacher Courses:", courses);
      setLoading(false);
    } else if (authUser && selectedRole !== 'teacher') {
      // Not a teacher, redirect or show message
      navigation.navigate('StudentHome');
    } else if (!authUser) {
      navigation.navigate('Login');
    } else {
      setLoading(false);
    }
  }, [authUser, userProfile, selectedRole]);

  const handleViewCourseDetails = (course) => {
    navigation.navigate('CourseDetails', { courseId: course.id });
  };

  const handleCreateCourse = () => {
    navigation.navigate('AddSubject');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-4 text-grayPro-600">Loading your courses...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView 
        className="px-5" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Header Section */}
        <View className="flex-row justify-between items-center mt-6">
          <View>
            <Text className="text-grayPro-400 text-base">Welcome back,</Text>
            <Text className="text-2xl font-bold text-black">
              {userProfile?.username || authUser?.displayName || 'Teacher'}
            </Text>
            {userProfile?.specialization && (
              <Text className="text-grayPro-500 text-sm mt-1">
                {userProfile.specialization}
              </Text>
            )}
          </View>
          <View className="flex-row items-center">
            {/* Notification */}
            <TouchableOpacity 
              className="bg-secondary w-12 h-12 rounded-full items-center justify-center mr-3 border border-grayPro-100"
              onPress={() => navigation.navigate('TeacherNotification')}
            >
              <Bell size={22} color="#8681FB" />
              <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" />
            </TouchableOpacity>

            {/* Profile Image */}
            <TouchableOpacity onPress={handleProfilePress}>
              <Image
                source={{ 
                  uri: userProfile?.photoURL || 
                       authUser?.photoURL || 
                       'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' 
                }}
                className="w-12 h-12 rounded-full border-2 border-grayPro-100"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Display */}
        <View className="mt-8 mb-2">
          <View className="flex-row items-center">
            <Calendar size={20} color="#8681FB" />
            <Text className="ml-3 text-grayPro-800 text-lg font-semibold">
              {formattedDate}
            </Text>
          </View>
        </View>

        {/* Page Title */}
        <View className="mt-8 mb-6">
          <Text className="text-3xl font-bold text-black">My Courses</Text>
          <Text className="text-grayPro-500 text-sm mt-2">
            Manage and explore your teaching courses
          </Text>
        </View>

        {/* Teacher's Created Courses */}
        {teacherCourses.length > 0 ? (
          teacherCourses.map((course, index) => (
            <CourseCard
              key={course.id || index}
              course={course}
              onViewDetails={handleViewCourseDetails}
            />
          ))
        ) : (
          <View className="mt-8 mb-6">
            <View className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-[32px] p-10 items-center justify-center">
              <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-6 shadow-lg">
                <BookOpen size={40} color="#4F46E5" />
              </View>
              <Text className="text-2xl font-bold text-grayPro-800 mb-3 text-center">
                No Courses Yet
              </Text>
              <Text className="text-grayPro-600 text-center mb-8 leading-6">
                Create your first course to share your knowledge and start teaching students
              </Text>
              <TouchableOpacity 
                className="bg-primary flex-row items-center px-8 py-4 rounded-full shadow-lg"
                onPress={handleCreateCourse}
              >
                <Plus size={24} color="white" className="mr-3" />
                <Text className="text-white font-bold text-lg">Create First Course</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Create New Course Button (shown when there are courses) */}
        {teacherCourses.length > 0 && (
          <TouchableOpacity 
            className="border-2 border-dashed border-primary rounded-[24px] p-8 items-center justify-center bg-primary/5 mb-10 mt-4"
            onPress={handleCreateCourse}
            activeOpacity={0.8}
          >
            <View className="w-20 h-20 bg-primary/20 rounded-full items-center justify-center mb-5">
              <Plus size={32} color="#4F46E5" />
            </View>
            <Text className="text-grayPro-800 font-bold text-xl mb-2">
              Add New Course
            </Text>
            <Text className="text-grayPro-500 text-center text-sm">
              Expand your teaching portfolio with another course
            </Text>
          </TouchableOpacity>
        )}

        {/* Stats Section (optional) */}
        {teacherCourses.length > 0 && (
          <View className="bg-grayPro-50 rounded-[24px] p-6 mb-6">
            <Text className="text-lg font-bold text-grayPro-800 mb-4">Teaching Overview</Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary">{teacherCourses.length}</Text>
                <Text className="text-grayPro-600 text-sm mt-1">Courses</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">0</Text>
                <Text className="text-grayPro-600 text-sm mt-1">Students</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600">0</Text>
                <Text className="text-grayPro-600 text-sm mt-1">Lessons</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TeacherHome;