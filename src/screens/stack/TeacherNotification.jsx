import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MessageSquare, Clock, ChevronRight } from 'lucide-react-native';

const NOTIFICATIONS = [
  { id: '1', studentName: "Luca Romano", chatId: "CH-9821", subject: "Dutch Grammar", date: new Date() },
  { id: '2', studentName: "Sophie Chen", chatId: "CH-4432", subject: "Conversation Lab", date: new Date(Date.now() - 3600000) },
  { id: '3', studentName: "Marcus Smith", chatId: "CH-1109", subject: "Vocabulary Mastery", date: new Date(Date.now() - 86400000) },
  { id: '4', studentName: "Elena Rodriguez", chatId: "CH-2210", subject: "Business Dutch", date: new Date(Date.now() - 172800000) },
];

// Array of your tailwind brand background classes
const BRAND_COLORS = [
  'bg-brand-orange',
  'bg-brand-yellow',
  'bg-brand-blue',
  'bg-brand-purple',
  'bg-brand-pink'
];

const NotificationCard = ({ studentName, chatId, subject, date, bgColor }) => {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(date).replace(/(\d+ [A-Za-z]+), (\d+),/, '$1 $2 •').replace(/\s(?=[ap]m)/i, '').toUpperCase();

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      // Added dynamic bgColor here
      className={`${bgColor} mx-4 my-2 p-5 rounded-[32px] flex-row items-center border border-black/5`}
    >
      {/* Student Icon - White background to pop against pastel card */}
      <View className="bg-white/80 w-14 h-14 rounded-2xl items-center justify-center shadow-sm">
        <MessageSquare size={24} color="#8681FB" strokeWidth={2.2} />
      </View>

      <View className="flex-1 ml-4">
        <View className="flex-row items-center mb-1">
          <Clock size={10} color="#6B6D6E" />
          <Text className="text-grayPro-600 text-[10px] font-bold tracking-widest uppercase ml-1">
            {formattedDate}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className="text-grayPro-800 text-lg font-bold">{studentName}</Text>
          <View className="bg-white/60 px-2 py-0.5 rounded-md ml-2 border border-black/5">
            <Text className="text-grayPro-500 text-[10px] font-bold">{chatId}</Text>
          </View>
        </View>
        
        <Text className="text-primary text-sm font-bold mt-0.5">
          {subject}
        </Text>
      </View>

      <View className="bg-white/40 p-1.5 rounded-full">
        <ChevronRight size={18} color="#4E5050" strokeWidth={3} />
      </View>
    </TouchableOpacity>
  );
};

const NotificationScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center px-4 py-5">
        <TouchableOpacity 
          onPress={() => navigation?.goBack()}
          className="w-10 h-10 bg-grayPro-100 rounded-full items-center justify-center mr-4"
        >
          <ArrowLeft size={24} color="#1A1A1A" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-grayPro-800">Activity Log</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {NOTIFICATIONS.map((item, index) => {
          // Select color based on index so it's consistent on every render
          const colorClass = BRAND_COLORS[index % BRAND_COLORS.length];
          
          return (
            <NotificationCard 
              key={item.id} 
              {...item} 
              bgColor={colorClass} 
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;