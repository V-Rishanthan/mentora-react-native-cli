import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ZIMKit } from '@zegocloud/zimkit-rn';
import { useAuth } from '../context/authContext';
import {
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  User,
  Hash,
} from 'lucide-react-native';

const ChatLogin = () => {
  const navigation = useNavigation();
  const route = useRoute();

  //  from previous screen (CourseDetails)
  const { teacherChatId, courseName } = route?.params || {};

  //  logged in user data
  const { username, userProfile } = useAuth();

  const [userID, setUserID] = useState(''); //  will be studentChatId (no random)
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const appConfig = {
    appID: 68270551,
    appSign:
      '0485d64e055a2c832518605cd8ed32437f6d8081956add41b054165279d1d98f',
  };

  useEffect(() => {
    ZIMKit.init(appConfig.appID, appConfig.appSign);
  }, []);

  //  derive student chat id from profile (supports both names)
  const studentChatId = useMemo(() => {
    return (
      userProfile?.studentChatId ||
      userProfile?.studentChatID || //  because you saved studentChatID in register()
      ''
    );
  }, [userProfile]);

  //  set login identity from profile
  useEffect(() => {
    if (studentChatId) setUserID(String(studentChatId));
    if (username) setUserName(username);
  }, [studentChatId, username]);

  const initial = useMemo(() => {
    const n = (userName || 'U').trim();
    return n.length ? n[0].toUpperCase() : 'U';
  }, [userName]);

  const chatToLogin = async () => {
    try {
      if (!userID || !userName) return;

      setLoading(true);

      //  connect current (student) user
      await ZIMKit.connectUser({ userID, userName }, '');

      //  go to home and pass both ids so ChatHome can start conversation with teacher
      navigation.navigate('ChatHome', {
        userID,
        userName,
        teacherChatId: teacherChatId || '',
        courseName: courseName || '',
      });
    } catch (e) {
      console.log('ZIM login error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Decorative Background Elements */}
      <View className="absolute top-0 left-0 right-0 h-[45%] bg-primary rounded-b-[60px]" />
      <View
        className="absolute top-[-50] right-[-50] w-64 h-64 bg-indigo-600 rounded-full opacity-50"
        style={{ transform: [{ scale: 1.2 }] }}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 px-6 pt-20">
          {/* Header Section */}
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-white text-4xl font-black tracking-tight">
                Connect.
              </Text>
              <Text className="text-indigo-100 text-lg font-medium opacity-90">
                Secure Chat Gateway
              </Text>
            </View>
            <View className="bg-white/20 p-4 rounded-3xl border border-white/30">
              <MessageCircle color="white" size={32} strokeWidth={2.5} />
            </View>
          </View>

          {/*  NEW: Top IDs Bar */}
          <View className="bg-white/10 border border-white/20 rounded-3xl px-5 py-4 mb-6">
            <Text className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-2">
              Chat IDs
            </Text>

            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-indigo-100 text-[11px] font-bold">
                  Student Chat ID
                </Text>
                <Text className="text-white text-lg font-black">
                  {userID || 'Not Found'}
                </Text>
              </View>

              <View className="w-[1px] h-10 bg-white/20" />

              <View className="flex-1 ml-3">
                <Text className="text-indigo-100 text-[11px] font-bold">
                  Teacher Chat ID
                </Text>
                <Text className="text-white text-lg font-black">
                  {teacherChatId || 'Not Found'}
                </Text>
              </View>
            </View>

            {!!courseName && (
              <Text className="text-indigo-100 mt-2 text-xs font-medium opacity-90">
                Course: {courseName}
              </Text>
            )}
          </View>

          {/* Identity Card */}
          <View className="bg-white/10 border border-white/20 rounded-[40px] p-6 mb-8 items-center flex-row shadow-xl">
            <View className="h-20 w-20 rounded-3xl bg-white items-center justify-center shadow-2xl">
              <Text className="text-indigo-600 text-3xl font-black">
                {initial}
              </Text>
            </View>
            <View className="ml-5 flex-1">
              <View className="flex-row items-center">
                <ShieldCheck color="#A5B4FC" size={18} />
                <Text className="text-indigo-100 ml-2 font-bold uppercase tracking-widest text-[10px]">
                  Verified Identity
                </Text>
              </View>
              <Text className="text-white text-2xl font-bold truncate">
                {userName || 'Guest User'}
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-[45px] p-8 shadow-2xl shadow-indigo-200/50">
            <Text className="text-slate-900 text-2xl font-black mb-1">
              Welcome back
            </Text>
            <Text className="text-slate-400 mb-8 font-medium">
              Your credentials are ready for sync.
            </Text>

            {/* Student ID */}
            <View className="space-y-5">
              <View>
                <Label text="Student Chat ID" />
                <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-5 h-16">
                  <Hash size={20} color="#6366f1" />
                  <Text className="flex-1 ml-4 text-slate-900 font-bold text-lg">
                    {userID || 'Not Found'}
                  </Text>
                </View>
              </View>

              {/* Username */}
              <View className="mt-4">
                <Label text="Chat Handle" />
                <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-5 h-16">
                  <User size={20} color="#6366f1" />
                  <Text className="flex-1 ml-4 text-slate-900 font-bold text-lg">
                    {userName}
                  </Text>
                </View>
              </View>

              {/* Teacher ID */}
              <View className="mt-4">
                <Label text="Teacher Chat ID" />
                <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-5 h-16">
                  <Hash size={20} color="#6366f1" />
                  <Text className="flex-1 ml-4 text-slate-900 font-bold text-lg">
                    {teacherChatId || 'Not Found'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Main Action Button */}
            <TouchableOpacity
              onPress={chatToLogin}
              activeOpacity={0.8}
              disabled={loading || !userID || !userName || !teacherChatId}
              className={`mt-10 rounded-[25px] flex-row items-center justify-center shadow-lg shadow-indigo-300 ${
                loading ? 'bg-indigo-400' : 'bg-primary'
              }`}
              style={{ height: 64 }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-white text-xl font-bold mr-2">
                    Start Chatting
                  </Text>
                  <ChevronRight color="white" size={20} strokeWidth={3} />
                </>
              )}
            </TouchableOpacity>

            <Text className="text-center text-slate-400 mt-6 text-xs font-medium">
              By entering, you agree to our{' '}
              <Text className="text-indigo-500 underline">Terms</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

// Simple Label Sub-component
const Label = ({ text }) => (
  <Text className="text-slate-500 ml-1 mb-2 font-bold text-xs uppercase tracking-widest">
    {text}
  </Text>
);

export default ChatLogin;
