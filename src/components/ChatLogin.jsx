import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ZIMKit } from '@zegocloud/zimkit-rn';
import { useAuth } from '../context/authContext';
import {
  MessageCircle,
  ShieldCheck,
  Hash,
  ChevronRight,
  User,
} from 'lucide-react-native';

const APP_ID = 68270551;
const APP_SIGN =
  '0485d64e055a2c832518605cd8ed32437f6d8081956add41b054165279d1d98f';

const ChatLogin = () => {
  const navigation = useNavigation();
  const { username } = useAuth();

  const [userID, setUserID] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  //  prevent double init in dev
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    try {
      ZIMKit.init(APP_ID, APP_SIGN);
      console.log(' ZIMKit initialized');
    } catch (e) {
      console.log(' ZIMKit init error:', e);
    }
  }, []);

  // Prefill username from auth (but still editable)
  useEffect(() => {
    if (username) setUserName(username);
  }, [username]);

  const initial = useMemo(() => {
    const n = (userName || 'U').trim();
    return n.length ? n[0].toUpperCase() : 'U';
  }, [userName]);

  const chatToLogin = async () => {
    const id = userID.trim();
    const name = userName.trim();

    if (!id || !name) {
      Alert.alert('Missing Info', 'Please enter both User ID and Chat Handle.');
      return;
    }

    try {
      setLoading(true);
      await ZIMKit.connectUser({ userID: id, userName: name }, '');
      navigation.navigate('ChatHome', { userID: id, userName: name });
    } catch (e) {
      console.log('❌ ZIM login error:', e);
      Alert.alert('Login Failed', 'Could not connect to chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

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
          <View className="flex-row items-center justify-between mb-8">
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

          {/* Identity Card (Glassmorphism) */}
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
                {userName?.trim() ? userName : 'Guest User'}
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-[45px] p-8 shadow-2xl shadow-indigo-200/50">
            <Text className="text-slate-900 text-2xl font-black mb-1">
              Welcome back
            </Text>
            <Text className="text-slate-400 mb-8 font-medium">
              Enter your credentials to sync.
            </Text>

            {/* Inputs Container */}
            <View className="space-y-5">
              {/* ✅ User ID Input */}
              <View>
                <Label text="User ID" />
                <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-5 h-16">
                  <Hash size={20} color="#6366f1" />
                  <TextInput
                    className="flex-1 ml-4 text-slate-900 font-bold text-lg"
                    placeholder="Enter your user ID"
                    placeholderTextColor="#94A3B8"
                    value={userID}
                    onChangeText={setUserID}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* ✅ Username Input */}
              <View className="mt-4">
                <Label text="Chat Handle" />
                <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-5 h-16">
                  <User size={20} color="#6366f1" />
                  <TextInput
                    className="flex-1 ml-4 text-slate-900 font-bold text-lg"
                    placeholder="Enter display name"
                    placeholderTextColor="#94A3B8"
                    value={userName}
                    onChangeText={setUserName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>

            {/* Main Action Button */}
            <TouchableOpacity
              onPress={chatToLogin}
              activeOpacity={0.8}
              disabled={loading || !userID.trim() || !userName.trim()}
              className={`mt-10 rounded-[25px] flex-row items-center justify-center shadow-lg shadow-indigo-300 ${
                loading ? 'bg-indigo-400' : 'bg-primary'
              }`}
              style={{ height: 64, opacity: loading || !userID.trim() || !userName.trim() ? 0.7 : 1 }}
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
