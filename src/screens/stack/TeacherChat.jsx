import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ConversationList, ZIMKit } from '@zegocloud/zimkit-rn';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../../context/authContext';

const TeacherChat = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { username, userProfile } = useAuth();

  const teacherChatId = route?.params?.teacherChatId || userProfile?.teacherChatId || '';
  const teacherName = username || 'Teacher';

  const [zimReady, setZimReady] = useState(false);

  const appConfig = {
    appID: 68270551,
    appSign: '0485d64e055a2c832518605cd8ed32437f6d8081956add41b054165279d1d98f',
  };

  // Safe mapping
  const getSafeConversationType = (t) => {
    if (t === 1 || t === 2) return 2; // group
    return 0; // peer
  };

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        if (!teacherChatId) return;

        //  init
        ZIMKit.init(appConfig.appID, appConfig.appSign);

        //  connect (await to avoid race)
        await ZIMKit.connectUser(
          { userID: String(teacherChatId), userName: teacherName },
          '',
        );

        if (mounted) setZimReady(true);
      } catch (e) {
        console.log('ZIM boot error:', e);
        if (mounted) setZimReady(false);
      }
    };

    boot();

    return () => {
      mounted = false;
    };
  }, [teacherChatId, teacherName]);

  if (!teacherChatId) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600 text-base">Teacher Chat ID not available</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="h-14 bg-primary flex-row items-center px-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold ml-4">Teacher Messages</Text>
        </View>

        {/*  Render only when ready */}
        {!zimReady ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="mt-3 text-gray-500">Connecting chat...</Text>
          </View>
        ) : (
          <View className="flex-1">
            <ConversationList
              onPressed={(conversation) => {
                const safeType = getSafeConversationType(conversation?.type);

                navigation.navigate('MessageListPage', {
                  conversationID: String(conversation?.conversationID),
                  conversationName:
                    conversation?.conversationName || String(conversation?.conversationID),
                  conversationType: safeType,
                  appBarActions: [
                    { icon: 'goBack', onPressed: () => navigation.goBack() },
                  ],
                });
              }}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default TeacherChat;
