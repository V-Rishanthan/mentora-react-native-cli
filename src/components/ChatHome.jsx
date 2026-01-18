import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import Clipboard from "@react-native-clipboard/clipboard";
import {
  ArrowLeft,
  Plus,
  Search,
  Copy,
  Settings,
  MoreHorizontal,
  Fingerprint,
} from "lucide-react-native";

import { ConversationList } from "@zegocloud/zimkit-rn";
import NewChatDialog from "../components/NewChatDialog";

const ChatHome = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userID, userName } = route.params || {};

  const [open, setOpen] = useState(false);

  const initial = (userName || "U").trim().charAt(0).toUpperCase();

  const copyToClipboard = () => {
    Clipboard.setString(userID || "");
    Alert.alert("Success", "User ID copied to clipboard!");
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* Background Header Decoration */}
      <View
        className="absolute top-0 left-0 right-0 h-80 bg-primary"
        style={{ borderBottomLeftRadius: 60, borderBottomRightRadius: 60 }}
      />

      < View className="flex-1">
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
                  {userName || "Chat User"}
                </Text>

                <TouchableOpacity
                  onPress={copyToClipboard}
                  className="flex-row items-center mt-1.5 bg-gray-50 self-start px-3 py-1 rounded-full border border-gray-100"
                >
                  <Fingerprint size={12} color="#6366f1" />
                  <Text className="text-gray-500 text-[10px] font-bold ml-1.5 uppercase tracking-tighter">
                    ID: {userID || "0000"}
                  </Text>
                  <Copy size={10} color="#94A3B8" className="ml-2" />
                </TouchableOpacity>
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
                onPress={() => setOpen(true)}
                className="bg-primary w-12 h-12 rounded-2xl items-center justify-center shadow-xl shadow-indigo-300"
              >
                <Plus size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* List Area */}
          <View className="flex-1 px-4">
            <ConversationList />
          </View>
        </View>
      </View>

      {/* Modal - placed outside SafeAreaView */}
      <NewChatDialog open={open} setOpen={setOpen} />
    </View>
  );
};

export default ChatHome;