import { 
  View, 
  Text, 
  Image, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../context/authContext'
import Button from '../../components/Button'

const Role = () => {
  const navigation = useNavigation() 
  const { setGlobalRole } = useAuth()

  const handleStudentRole = () => {
    setGlobalRole("student")
    console.log("Role set to: student")
   navigation.push("Login");
  }

  const handleTeacherRole = () => {
    setGlobalRole("teacher")
    console.log("Role set to: teacher")
    navigation.push('RegisterTeachers')
  }

  const handleLogin = () => {
    navigation.navigate('Login')
  }

  const handleSignUp = () => {
    navigation.navigate('Register')
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Background Pattern */}
      <Image
        source={require("../../assets/bg-pattern.jpg")}
        className="absolute w-full h-full"
        resizeMode="cover"
      />

      {/* Overlay */}
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/5" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Content */}
        <View className="flex-1 px-6 pt-20 pb-10">
          {/* Header */}
          <View className="items-center mb-10">
            <Text className="text-3xl font-bold text-black mb-2 text-center">
              Choose Your Role
            </Text>
            <Text className="text-base text-gray-500 text-center leading-6">
              Select how you'd like to use Select Mentora
            </Text>
          </View>

          {/* Role Cards Container */}
          <View className="flex flex-col gap-6 mb-10">
            {/* Student Card */}
            <TouchableOpacity
              className="bg-white rounded-2xl p-6 flex-row items-center gap-4"
              activeOpacity={0.7}
              onPress={handleStudentRole}
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              {/* Icon */}
              <View className="bg-primary/10 p-3 rounded-xl">
                <Image
                  source={require("../../assets/book.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>

              {/* Text Content */}
              <View className="flex-1">
                <Text className="text-xl font-semibold text-black mb-1">
                  I'm a Student
                </Text>
                <Text className="text-base text-gray-500 leading-6">
                  Browse subjects, enroll in courses, and track your learning
                </Text>
              </View>
              
              {/* Arrow */}
              <View className="w-8 h-8 bg-primary/20 rounded-full items-center justify-center">
                <Text className="text-primary text-lg">→</Text>
              </View>
            </TouchableOpacity>

            {/* Teacher Card */}
            <TouchableOpacity
              className="bg-white rounded-2xl p-6 flex-row items-center gap-4"
              activeOpacity={0.7}
              onPress={handleTeacherRole}
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              {/* Icon */}
              <View className="bg-accent/10 p-3 rounded-xl">
                <Image
                  source={require("../../assets/university.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>

              {/* Text Content */}
              <View className="flex-1">
                <Text className="text-xl font-semibold text-black mb-1">
                  I'm a Teacher
                </Text>
                <Text className="text-base text-gray-500 leading-6">
                  Create classes, manage students, and share your expertise
                </Text>
              </View>
              
              {/* Arrow */}
              <View className="w-8 h-8 bg-accent/20 rounded-full items-center justify-center">
                <Text className="text-accent text-lg">→</Text>
              </View>
            </TouchableOpacity>
          </View>

     

          {/* Direct Login/Signup */}
          <View className="mt-8">
            <Button 
              text="Login" 
              onPress={handleLogin}
              className="w-full py-4"
            />

            <View className="flex flex-row justify-center items-center mt-6">
              <Text className="text-base text-gray-600">
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={handleSignUp} className="ml-1">
                <Text className="text-base text-primary font-semibold underline">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Additional Info */}
          <View className="mt-12 p-4 bg-gray-pro-100 rounded-xl">
            <Text className="text-gray-600 text-sm text-center">
              You can change your role later in settings. 
              Each role offers different features and capabilities.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Role