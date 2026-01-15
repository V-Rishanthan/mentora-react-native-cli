// App.js
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContextProvider, useAuth } from "./src/context/authContext";

// Import screens
import WelcomeScreen from "./src/screens/shared/WelcomeScreen";
import LandingScreen from "./src/screens/shared/Landing";
import RoleScreen from "./src/screens/shared/Role";
import LoginScreen from "./src/screens/auth/Login";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import RegisterTeachersScreen from "./src/screens/auth/RegisterTeachers";
import RegisterTeachers2 from "./src/screens/auth/RegisterTeachers2";
import TeacherSubjectSuggestion from "./src/screens/auth/TeacherSubjectSuggestion";
import AddSubject from "./src/screens/auth/AddSubject";
import CourseDetails from "./src/components/CourseDetails"

// Import tab screens (create these if you don't have them)
import HomeScreen from "./src/screens/tabs/Home";
import ProfileScreen from "./src/screens/tabs/Profile";
import SearchScreen from "./src/screens/tabs/Search";
import CoursesScreen from "./src/screens/tabs/Courses";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator (Equivalent to Expo's (tabs))
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e5e5e5',
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main App Navigator with Auth Logic
function AppNavigator() {
  const { isAuthenticated, isLoading, userProfile } = useAuth();

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#8681FB" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // Authenticated users - Show tabs or appropriate screen based on role
        <>
          {userProfile?.role === 'teacher' ? (
            // Teacher-specific screens
            <>
              <Stack.Screen name="TeacherHome" component={HomeScreen} />
              <Stack.Screen name="TeacherSubjectSuggestion" component={TeacherSubjectSuggestion} />
              <Stack.Screen name="AddSubject" component={AddSubject} />
            </>
          ) : (
            // Student/regular user - Show tabs
            <Stack.Screen name="MainTabs" component={TabNavigator} />
          )}
          
          {/* Common authenticated screens accessible from anywhere */}
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        // Unauthenticated users - Auth flow
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Role" component={RoleScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="RegisterTeachers" component={RegisterTeachersScreen} />
          {/* <Stack.Screen name="RegisterTeachers_2" component={RegisterTeachers2Screen} /> */}
          <Stack.Screen name="RegisterTeachers2" component={RegisterTeachers2} />
          <Stack.Screen name="TeacherSubjectSuggestion" component={TeacherSubjectSuggestion} />
          <Stack.Screen name="AddSubject" component={AddSubject} />
         
        </>
      )}
      <Stack.Screen name="CourseDetails" component={CourseDetails} />
    </Stack.Navigator>
  );
}

// Root App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthContextProvider>
    </SafeAreaProvider>
  );
}