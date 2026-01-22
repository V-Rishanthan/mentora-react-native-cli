// App.js
import React, { useEffect } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from "react-native";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContextProvider, useAuth } from "./src/context/authContext";
import { Home, BookOpen, Search, User,MessageSquareMore ,Video,Brain } from 'lucide-react-native';

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
// import SearchScreen from "./src/screens/tabs/Search";
import ChatScreen from "./src/screens/tabs/Chat";
import Audience from "./src/screens/tabs/Audience";


// teacher tab
import TeacherHome from "./src/screens/stack/TeacherHome"
import TeacherChat from "./src/screens/stack/TeacherChat"

// Testing Componets
import ChatLogin from "./src/components/ChatLogin"
import ChatHome from "./src/components/ChatHome"
import { MessageListPage } from "@zegocloud/zimkit-rn";

// Video
import LiveHome from './src/components/livestreaming/LiveHome'
import LiveHost from './src/components/livestreaming/LiveHost'
import AudienceLive from './src/components/livestreaming/AudienceLive'







const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator (Equivalent to Expo's (tabs))
function TabNavigator() {
  // const insets = useSafeAreaInsets();
  return (
 
  
    <Tab.Navigator
    screenOptions={({ route }) => ({
    headerShown: false,
    tabBarShowLabel: false, // Cleaner, more premium look without text
    tabBarActiveTintColor: "#FFFFFF",
    tabBarInactiveTintColor: "rgba(255,255,255,0.5)",

    tabBarStyle: {
      position: "absolute",
      left: 20,
      right: 20,
      // bottom: 1 + insets.bottom,
      height: 75,
      // borderRadius: 35,
      backgroundColor: "#8681FB", // Your primary purple
      borderTopWidth: 0,
      
      // Sophisticated Shadow
      shadowColor: "#8681FB",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 15,
      paddingTop: 12,
    },

    tabBarIcon: ({ focused, color }) => {
      let IconComponent;
      if (route.name === "Home") IconComponent = Home;
      else if (route.name === "Chat") IconComponent = Brain;
      else if (route.name === "Audience") IconComponent = Video;
      else if (route.name === "Profile") IconComponent = User;
      // else if (route.name === "Audience") IconComponent = User;

      return (
        <View className="items-center justify-center">
          {/* 1. Animated Glow Background */}
          <View
            className={`absolute w-14 h-14 rounded-full items-center justify-center ${
              focused ? "bg-white/10" : "bg-transparent"
            }`}
            style={{
              // Adds a subtle 'bloom' effect when selected
              transform: [{ scale: focused ? 1 : 0.8 }]
            }}
          />

          {/* 2. Floating Icon with Dynamic Weight */}
          <View
            style={{
              transform: [{ translateY: focused ? -5 : 0 }], // Icon lifts up when active
            }}
          >
            <IconComponent
              size={24}
              color={color}
              strokeWidth={focused ? 2.8 : 2.0}
            />
          </View>

          {/* 3. Minimalist "Active" Pill */}
          {focused && (
            <View 
              className="w-8 h-1 bg-white rounded-full absolute -bottom-3" 
              style={{ shadowColor: '#fff', shadowOpacity: 0.5, shadowRadius: 4 }}
            />
          )}
        </View>
      );
    },
  })}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Chat" component={ChatScreen} />



  {/* <Tab.Screen name="Search" component={SearchScreen} /> */}
  <Tab.Screen name="Audience" component={Audience} />
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
              <Stack.Screen name="TeacherHome" component={TeacherHome} />
              <Stack.Screen name="TeacherSubjectSuggestion" component={TeacherSubjectSuggestion} />
              <Stack.Screen name="AddSubject" component={AddSubject} />
              <Stack.Screen name="TeacherChat" component={TeacherChat} />
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
      <Stack.Screen name="ChatLogin"  component={ChatLogin} />
      <Stack.Screen name="MessageListPage"  component={MessageListPage} />
      <Stack.Screen name="ChatHome"  component={ChatHome} />
      <Stack.Screen name="LiveHome"  component={LiveHome} />
      <Stack.Screen name="LiveHost"  component={LiveHost} />
      <Stack.Screen name="AudienceLive"  component={AudienceLive} />


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