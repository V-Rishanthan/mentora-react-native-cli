import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';

import Clipboard from '@react-native-clipboard/clipboard';
import {
  ArrowLeft,
  Plus,
  Search,
  Copy,
  Settings,
  MoreHorizontal,
  Fingerprint,
  X,
} from 'lucide-react-native';

import { ConversationList } from '@zegocloud/zimkit-rn';

const ChatHome = () => {




  const route = useRoute();
  const navigation = useNavigation();

 


  //  receive teacherChatId as well
  const { userID, userName, teacherChatId, courseName } = route.params || {};

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userIdInput, setUserIdInput] = useState('');

  const initial = (userName || 'U').trim().charAt(0).toUpperCase();

  //  copy TEACHER chat id (not student/userID)
  const copyToClipboard = () => {
    if (!teacherChatId) {
      Alert.alert('Missing', 'Teacher Chat ID not available');
      return;
    }
    Clipboard.setString(String(teacherChatId));
    Alert.alert('Success', 'Teacher Chat ID copied to clipboard!');
  };

  const handleStartChat = () => {
    const targetUserId = userIdInput.trim();

    if (!targetUserId) {
      Alert.alert('Missing', 'Please enter a user ID');
      return;
    }

    if (targetUserId === userID) {
      Alert.alert('Invalid', "You can't chat with yourself.");
      return;
    }

    //  Open 1-to-1 chat (peer chat)
    navigation.navigate('MessageListPage', {
      conversationID: targetUserId,
      conversationName: targetUserId,
      conversationType: 0,
      appBarActions: [
        {
          icon: 'goBack',
          onPressed: () => navigation.goBack(),
        },
      ],
    });

    console.log('Starting chat with:', targetUserId);

    setIsModalVisible(false);
    setUserIdInput('');
  };

  //  quick action: start chat with teacher instantly
  const startTeacherChat = () => {
    if (!teacherChatId) {
      Alert.alert('Missing', 'Teacher Chat ID not available');
      return;
    }
    if (String(teacherChatId) === String(userID)) {
      Alert.alert('Invalid', "You can't chat with yourself.");
      return;
    }

    navigation.navigate('MessageListPage', {
      conversationID: String(teacherChatId),
      conversationName: courseName || 'Teacher',
      conversationType: 0,
    });
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* Background Header Decoration */}
      <View className="absolute top-0 left-0 right-0 h-80 bg-primary rounded-b-[60px]" />

      <SafeAreaView className="flex-1">
        {/* Top Navbar */}
        <View className="px-6 py-2 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <ArrowLeft size={26} color="white" />
          </TouchableOpacity>

          <Text className="text-white text-xl font-bold tracking-tight">
            Messages
          </Text>

          <TouchableOpacity className="p-2 -mr-2">
            <MoreHorizontal size={26} color="white" />
          </TouchableOpacity>
        </View>

        {/* Glass Profile Card */}
        <View className="px-6 mt-4">
          <View className="bg-white rounded-[32px] p-5 shadow-lg shadow-black/20 border border-white/50">
            <View className="flex-row items-center">
              <View className="p-1 rounded-2xl border-2 border-indigo-50">
                <View className="w-14 h-14 rounded-xl bg-primary items-center justify-center">
                  <Text className="text-white text-2xl font-black">
                    {initial}
                  </Text>
                </View>
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-gray-900 text-lg font-bold leading-tight">
                  {userName || 'Chat User'}
                </Text>

                {/*  Copy Teacher ID */}
                <TouchableOpacity
                  onPress={copyToClipboard}
                  className="flex-row items-center mt-1.5 bg-gray-50 self-start px-3 py-1 rounded-full border border-gray-100"
                >
                  <Fingerprint size={12} color="#6366f1" />
                  <Text className="text-gray-500 text-[10px] font-bold ml-1.5 uppercase tracking-tighter">
                    Teacher ID: {teacherChatId || 'Not Found'}
                  </Text>
                  <Copy size={10} color="#94A3B8" className="ml-2" />
                </TouchableOpacity>

                {/*  Optional: start teacher chat button */}
                {!!teacherChatId && (
                  <TouchableOpacity
                    onPress={startTeacherChat}
                    activeOpacity={0.8}
                    className="mt-3 bg-primary/10 self-start px-3 py-2 rounded-xl border border-primary/20"
                  >
                    <Text className="text-primary font-bold text-xs">
                      Chat with Teacher
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <Settings size={20} color="#6366f1" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Chat Section */}
        <View className="flex-1 mt-8 bg-white rounded-t-[50px] shadow-2xl">
          {/* Header & Search */}
          <View className="px-8 pt-10 pb-4">
            <View className="flex-row items-center bg-gray-100 px-5 py-3.5 rounded-2xl mb-6">
              <Search size={20} color="#94A3B8" />
              <TextInput
                placeholder="Search..."
                className="ml-3 flex-1 text-gray-900 font-medium"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-black text-gray-900">
                  Recent
                </Text>
                <View className="h-1.5 w-6 bg-primary rounded-full mt-1" />
              </View>

              <TouchableOpacity
                onPress={() => setIsModalVisible(true)}
                activeOpacity={0.7}
                className="bg-primary w-14 h-14 rounded-2xl items-center justify-center shadow-xl shadow-indigo-300"
              >
                <Plus size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* List Area */}
          <View className="flex-1 px-4">
            {/* <ConversationList /> */}
<ConversationList
  onPressed={(conversation) => {
    const safeType =
      conversation.type === 2 || conversation.type === 1 ? 2 : 0;

    navigation.navigate('MessageListPage', {
      conversationID: String(conversation.conversationID),
      conversationName:
        conversation.conversationName || String(conversation.conversationID),
      conversationType: safeType,
      appBarActions: [{ icon: 'goBack', onPressed: () => navigation.goBack() }],
    });
  }}
/>


          </View>
        </View>
      </SafeAreaView>

      {/* Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        onBackButtonPress={() => setIsModalVisible(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.4}
        style={{ margin: 0, justifyContent: 'center', alignItems: 'center' }}
      >
        <View className="w-11/12 max-w-sm bg-white rounded-2xl">
          {/* Modal Header */}
          <View className="p-5 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">
                New Message
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="p-2"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-500 text-sm mt-1">
              Enter user ID to start chatting
            </Text>
          </View>

          {/* Modal Body */}
          <View className="p-5">
            <Text className="text-gray-700 font-medium mb-2">User ID</Text>
            <TextInput
              placeholder="Enter user ID"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 mb-6"
              autoCapitalize="none"
              autoCorrect={false}
              value={userIdInput}
              onChangeText={setUserIdInput}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="flex-1 border border-gray-300 py-3 rounded-xl items-center"
                activeOpacity={0.7}
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleStartChat}
                className="flex-1 bg-primary py-3 rounded-xl items-center"
                activeOpacity={0.7}
                disabled={!userIdInput.trim()}
                style={{ opacity: userIdInput.trim() ? 1 : 0.5 }}
              >
                <Text className="text-white font-medium">Start Chat</Text>
              </TouchableOpacity>
            </View>

            {!!teacherChatId && (
              <TouchableOpacity
                onPress={() => {
                  setUserIdInput(String(teacherChatId));
                }}
                className="mt-4 bg-primary/10 py-3 rounded-xl items-center border border-primary/20"
                activeOpacity={0.8}
              >
                <Text className="text-primary font-bold">
                  Use Teacher ID ({teacherChatId})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChatHome;
