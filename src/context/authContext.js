// src/context/authContext.js
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/confic';
import { getAuthErrorMessage } from '../utils/firebaseErrors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [selectedRole, setSelectedRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from AsyncStorage
    const checkStoredAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Fetch user profile
          if (parsedUser.uid) {
            const profile = await fetchUserProfile(parsedUser.uid);
            if (profile) {
              setUserProfile(profile);
              setSelectedRole(profile.role || null);
            }
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking stored auth:', error);
        setIsLoading(false);
      }
    };

    checkStoredAuth();

    // Firebase auth state listener
    const unsub = onAuthStateChanged(auth, async firebaseUser => {
      console.log(
        'Firebase auth state changed:',
        firebaseUser?.email || 'No user',
      );

      if (firebaseUser) {
        // Save user to AsyncStorage
        await AsyncStorage.setItem(
          '@user',
          JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          }),
        );

        setIsAuthenticated(true);
        setUser(firebaseUser);

        // Fetch user profile from Firestore
        try {
          const profile = await fetchUserProfile(firebaseUser.uid);
          if (profile) {
            setUserProfile(profile);
            setSelectedRole(profile.role || null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        // Clear AsyncStorage on logout
        await AsyncStorage.removeItem('@user');
        setIsAuthenticated(false);
        setUser(null);
        setSelectedRole(null);
        setUserProfile(null);
      }
    });

    return unsub;
  }, []);

  // Function to fetch all courses (teachers) data
  const fetchCourseData = async () => {
    try {
      setLoadingCourses(true);
      console.log('Fetching course data...');

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'teacher'));
      const querySnapshot = await getDocs(q);

      const courses = [];
      querySnapshot.forEach(doc => {
        const userData = doc.data();
        courses.push({
          id: userData.userId || doc.id,
          category: userData.category || 'Uncategorized',
          description: userData.description || 'No description available',
          subjectName: userData.subjectName || 'Untitled Subject',
          subjects: userData.subjects || [],
          thumbnail: userData.thumbnail ? { uri: userData.thumbnail } : null,
          instructor: userData.username || 'Anonymous Instructor',
          rating: userData.rating || 0,
          duration: userData.duration || '0h',
          isVerified: userData.isVerified || false,
          qualification: userData.qualification || '',
          specialization: userData.specialization || '',
          yearsOfExperience: userData.yearsOfExperience || 0,
          availableForHire: userData.availableForHire || false,
          totalStudents: userData.totalStudents || 0,
          totalClasses: userData.totalClasses || 0,
        });
      });

      console.log(`Fetched ${courses.length} courses`);
      setCourseData(courses);
      return { success: true, data: courses };
    } catch (error) {
      console.error('Error fetching course data:', error);
      setCourseData([]);
      return {
        success: false,
        error: error.message || 'Failed to fetch courses',
      };
    } finally {
      setLoadingCourses(false);
    }
  };

  // Function to fetch user profile
  const fetchUserProfile = async userId => {
    try {
      if (!userId) return null;

      console.log('Fetching profile for user:', userId);
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (userDoc.exists()) {
        const profileData = userDoc.data();
        console.log('User profile found:', profileData);
        setUserProfile(profileData);
        return profileData;
      } else {
        console.log('No user profile found in Firestore');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      if (!email || !password) {
        return {
          success: false,
          error: 'Please enter both email and password',
        };
      }

      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful for user:', response.user.email);

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        '@user',
        JSON.stringify({
          uid: response.user.uid,
          email: response.user.email,
        }),
      );

      // Fetch user profile
      const profile = await fetchUserProfile(response.user.uid);

      return {
        success: true,
        message: 'Login successfully',
        user: response.user,
        profile: profile,
      };
    } catch (error) {
      const userFriendlyMessage = getAuthErrorMessage(error.code);
      return {
        success: false,
        error: userFriendlyMessage,
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Sign out from Firebase Authentication
      await signOut(auth);

      // Clear AsyncStorage
      await AsyncStorage.removeItem('@user');

      setUser(null);
      setIsAuthenticated(false);
      setUserProfile(null);
      setSelectedRole(null);

      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      const userFriendlyMessage = getAuthErrorMessage(error.code);
      return {
        success: false,
        error: userFriendlyMessage || 'Failed to log out. Please try again.',
      };
    }
  };

  // Register Students
  const register = async (
    username,
    email,
    password,
    role,
    gender = '',
    subject = '',
  ) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      console.log('Response.user', response?.user);

      // Create user document in Firestore
      await setDoc(doc(db, 'users', response?.user?.uid), {
        username: username,
        email: email,
        gender: gender,
        subjectInterest: subject,
        role: role,
        userId: response?.user?.uid,
        createdAt: new Date().toISOString(),
      });

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        '@user',
        JSON.stringify({
          uid: response.user.uid,
          email: response.user.email,
        }),
      );

      return { success: true, data: response?.user };
    } catch (error) {
      console.error('Registration error:', error.code);
      const userFriendlyMessage = getAuthErrorMessage(error.code);
      return { success: false, error: userFriendlyMessage };
    }
  };

  // Register Teacher
  const registerTeacher = async teacherData => {
    try {
      // Validation
      if (!teacherData.email || !teacherData.password) {
        return {
          success: false,
          error: 'Email and password are required',
        };
      }

      console.log('Starting teacher registration for:', teacherData.email);

      // 1. Create user with email and password
      const response = await createUserWithEmailAndPassword(
        auth,
        teacherData.email,
        teacherData.password,
      );

      console.log('Firebase user created:', response.user.uid);

      // 2. Create teacher document in Firestore
      await setDoc(doc(db, 'users', response.user.uid), {
        username: teacherData.username?.trim() || '',
        email: teacherData.email.toLowerCase().trim(),
        role: 'teacher',
        qualification: teacherData.qualification?.trim() || '',
        yearsOfExperience: Number(teacherData.yearsOfExperience) || 0,
        specialization: teacherData.specialization?.trim() || '',
        bio: teacherData.bio?.trim() || '',
        subjects: Array.isArray(teacherData.subjects)
          ? teacherData.subjects
          : [],
        hourlyRate: Number(teacherData.hourlyRate) || 0,
        subjectName: teacherData.subjectName?.trim() || '',
        category: teacherData.category || '',
        duration: teacherData.duration || '',
        description: teacherData?.description?.trim() || '',
        thumbnail: teacherData?.thumbnail || '',
        isVerified: false,
        rating: 0,
        totalStudents: 0,
        totalClasses: 0,
        availableForHire: true,
        userId: response.user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        '@user',
        JSON.stringify({
          uid: response.user.uid,
          email: response.user.email,
        }),
      );

      // Update global role
      setSelectedRole('teacher');

      return {
        success: true,
        data: response.user,
        message: 'Teacher registration successful',
      };
    } catch (error) {
      console.error('Registration error:', error.code, error.message);
      let errorMessage = getAuthErrorMessage(error.code);

      if (!errorMessage) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters.';
            break;
          case 'auth/admin-restricted-operation':
            errorMessage =
              'Registration is temporarily unavailable. Please try again later.';
            break;
          default:
            errorMessage =
              error.message || 'Registration failed. Please try again.';
        }
      }

      return {
        success: false,
        error: errorMessage,
        code: error.code,
      };
    }
  };

  // Role management
  const setGlobalRole = role => {
    setSelectedRole(role);
    console.log('selectedRole:', role);
  };

  // Clear role
  const clearRole = () => {
    setSelectedRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        registerTeacher,
        logout,
        selectedRole,
        setGlobalRole,
        clearRole,
        userProfile,
        fetchUserProfile,
        fetchCourseData,
        courseData,
        loadingCourses,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be wrapped inside AuthContextProvider');
  }
  return value;
};
