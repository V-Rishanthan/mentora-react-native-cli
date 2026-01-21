import React, { useMemo } from 'react';
import { ArrowLeft, BookOpen, Clock, User } from 'lucide-react-native';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CourseDetails({ navigation, route }) {
  // In RN CLI + React Navigation, data comes from route.params
  const { course: courseParam } = route.params || {};

  // Accept both: object course OR stringified course
  const course = useMemo(() => {
    try {
      if (!courseParam) return null;

      if (typeof courseParam === 'string') {
        return JSON.parse(courseParam);
      }

      if (typeof courseParam === 'object') {
        return courseParam;
      }

      return null;
    } catch (e) {
      console.error('Error parsing courseParam:', e);
      console.log('Raw courseParam:', courseParam);
      return null;
    }
  }, [courseParam]);

  if (!course) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl text-grayPro-800 mb-4">
          Course data not available
        </Text>

        <TouchableOpacity
          className="mt-6 bg-primary px-6 py-3 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-outfit-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const getImageSource = () => {
    if (!course.thumbnail) {
      return require('../assets/course/course-2.png');
    }

    // string: base64 / url / path
    if (typeof course.thumbnail === 'string') {
      if (course.thumbnail.startsWith('data:image'))
        return { uri: course.thumbnail };
      if (course.thumbnail.startsWith('http')) return { uri: course.thumbnail };
      return { uri: course.thumbnail }; // local file path
    }

    // object: { uri }
    if (typeof course.thumbnail === 'object' && course.thumbnail?.uri) {
      return { uri: course.thumbnail.uri };
    }

    return require('../assets/course/course-2.png');
  };

  const imageSource = getImageSource();
  const subjects = Array.isArray(course.subjects) ? course.subjects : [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        <View className="relative">
          <Image
            source={imageSource}
            className="w-full h-64"
            resizeMode="cover"
          />

          {/* Back Button */}
          <TouchableOpacity
            className="absolute top-12 left-4 bg-black/30 w-10 h-10 rounded-full items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>

          <View className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
        </View>

        {/* Content */}
        <View className="px-5 pt-6">
          {/* Category */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="bg-green-50 px-4 py-2 rounded-full border border-green-100">
              <Text className="text-green-800 text-sm font-outfit-medium">
                {course.category || 'General'}
              </Text>
            </View>
            <View className="bg-gray-100 px-3 py-2 rounded-full text-green-800">
              <Text className="text-grayPro-700 text-sm font-outfit-medium">
                Teacher Chat ID : {course?.teacherChatId || 'Not created'}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-outfit-bold text-grayPro-800 mb-3">
            {course.subjectName || course.title || 'Course Title'}
          </Text>

          {/* Stats */}
          <View className="flex-row items-center gap-3 space-x-6 mb-6">
            <View className="flex-row items-center">
              <Clock size={18} color="#6B7280" />
              <Text className="font-outfit-medium ml-2 text-grayPro-700">
                {course.duration || '10 hours'}
              </Text>
            </View>

            <View className="flex-row items-center">
              <BookOpen size={18} color="#6B7280" />
              <Text className="font-outfit-medium ml-2 text-grayPro-700">
                {course.lessons || '24'} lessons
              </Text>
            </View>
          </View>

          {/* Instructor */}
          <View className="flex-row items-center mb-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
            {course.lecturerPic ? (
              <Image
                source={{ uri: course.lecturerPic }}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center">
                <User size={24} color="#4F46E5" />
              </View>
            )}

            <View className="ml-4 flex-1">
              <Text className="font-outfit-semibold text-lg text-grayPro-800">
                {course.teacherName || course.instructor || 'Not Found'}
              </Text>
              <Text className="text-grayPro-500 text-sm font-outfit-regular mt-1">
                {course.teacherTitle || 'Software Engineer'} ·{' '}
                {course.experience || '5+ years experience'}
              </Text>
              <Text className="text-primary text-xs font-outfit-medium mt-2">
                {course.instructorRating || '4.9'} Instructor Rating
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-8">
            <Text className="text-xl font-outfit-semibold text-grayPro-800 mb-4">
              About This Course
            </Text>
            <Text className="text-grayPro-600 leading-relaxed font-outfit-regular text-base">
              {course.description || 'No description available.'}
            </Text>
          </View>

          {/* Subjects Covered */}
          {subjects.length > 0 && (
            <View className="mb-8">
              <Text className="text-xl font-outfit-semibold text-grayPro-800 mb-4">
                Subjects Covered
              </Text>
              <View className="flex-row flex-wrap">
                {subjects.map((subject, idx) => (
                  <View
                    key={idx}
                    className="bg-gray-100 px-3 py-2 rounded-lg mr-2 mb-2"
                  >
                    <Text className="text-gray-600 font-outfit-medium text-sm">
                      {subject}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Curriculum Preview */}
          <View className="mb-8">
            <Text className="text-xl font-outfit-semibold text-grayPro-800 mb-4">
              Course Curriculum
            </Text>

            <View className="space-y-2">
              {subjects.map((lesson, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between py-3 px-4 bg-grayPro-50 rounded-lg"
                >
                  <View className="flex-row items-center">
                    <View className="w-6 h-6 bg-primary/10 rounded items-center justify-center mr-3">
                      <Text className="text-primary text-xs font-outfit-semibold">
                        {index + 1}
                      </Text>
                    </View>
                    <Text className="text-grayPro-700 font-outfit-regular">
                      {lesson}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Chat Now */}
          <TouchableOpacity
            className="bg-primary py-4 rounded-xl mb-10 items-center"
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('ChatLogin', {
                teacherChatId: course?.teacherChatId, //  teacher chat id
                courseName: course?.subjectName || course?.title || 'Course', //  course name
              })
            }
          >
            <Text className="text-white text-lg font-outfit-semibold">
              Chat Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
