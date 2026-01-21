import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Video,
  ShieldCheck,
  ChevronRight,
  UserPlus,
  Hash,
} from "lucide-react-native";
import { useAuth } from "../../context/authContext";
import { useNavigation } from "@react-navigation/native";

const LiveHome = () => {
  const { username, liveStream } = useAuth();

  //  live id (display only)
  const myLiveId = liveStream || "Not generated";
  const displayName = username || "Guest User";

  const navigation = useNavigation();

  //  user input live id (to join/host)
  const [joinLiveId, setJoinLiveId] = useState("");

  const initial = useMemo(() => {
    const n = displayName.trim();
    return n.length ? n[0].toUpperCase() : "U";
  }, [displayName]);

  //  navigate only if user typed live id
  const handleLive = () => {
    const id = joinLiveId.trim();

    if (!id) {
      Alert.alert("Missing Live ID", "Please enter a Live ID to continue.");
      return;
    }

    navigation.navigate("LiveHost", {
      liveId: id, //  pass to LiveHost
      userName: displayName, 
    });
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Background */}
      <View className="absolute top-0 left-0 right-0 h-[45%] bg-primary rounded-b-[60px]" />
      <View className="absolute top-[-60] right-[-60] w-72 h-72 bg-indigo-600 rounded-full opacity-50" />
      <View className="absolute top-[120] left-[-80] w-56 h-56 bg-indigo-500 rounded-full opacity-20" />

      <SafeAreaView className="flex-1 px-6 pt-20">
        {/* Header */}
        <View className="mb-10">
          <Text className="text-white text-4xl font-black tracking-tight">
            Live Session
          </Text>
          <Text className="text-indigo-100 text-lg font-medium opacity-90">
            Host or join instantly
          </Text>
        </View>

        {/* Identity Card */}
        <View className="bg-white/10 border border-white/20 rounded-[40px] p-6 mb-10 flex-row items-center shadow-xl">
          <View className="h-20 w-20 rounded-3xl bg-white items-center justify-center shadow-2xl">
            <Text className="text-indigo-600 text-3xl font-black">
              {initial}
            </Text>
          </View>

          <View className="ml-5 flex-1">
            <View className="flex-row items-center">
              <ShieldCheck color="#A5B4FC" size={18} />
              <Text className="text-indigo-100 ml-2 font-bold uppercase tracking-widest text-[10px]">
                Live Ready
              </Text>
            </View>

            <Text className="text-white text-2xl font-bold mt-1" numberOfLines={1}>
              {displayName}
            </Text>

            {/* My Live ID */}
            <View className="flex-row items-center mt-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full self-start">
              <Hash size={14} color="#E0E7FF" />
              <Text className="text-indigo-100 text-xs font-bold ml-2">
                My Live ID: {myLiveId}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Card */}
        <View className="bg-white rounded-[45px] p-8 shadow-2xl shadow-indigo-200/50">
          <Text className="text-slate-900 text-2xl font-black mb-2">
            Join another live
          </Text>
          <Text className="text-slate-400 mb-6 font-medium">
            Enter a live ID to continue.
          </Text>

          {/* Enter Live ID */}
          <View className="mb-8">
            <Text className="text-slate-500 ml-1 mb-2 font-bold text-xs uppercase tracking-widest">
              Live ID
            </Text>

            <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-5 h-16">
              <UserPlus size={20} color="#6366f1" />
              <TextInput
                value={joinLiveId}
                onChangeText={setJoinLiveId}
                placeholder="Enter Live ID"
                placeholderTextColor="#94A3B8"
                className="flex-1 ml-4 text-slate-900 font-bold text-lg"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Start / Join Button */}
          <TouchableOpacity
            onPress={handleLive}
            activeOpacity={0.85}
            className="h-18 rounded-[28px] bg-primary flex-row items-center justify-between px-6 shadow-xl shadow-indigo-300"
            style={{ height: 72 }}
          >
            <View className="flex-row items-center">
              <View className="bg-white/20 p-4 rounded-2xl">
                <Video color="white" size={26} strokeWidth={2.6} />
              </View>

              <View className="ml-4">
                <Text className="text-white text-xl font-black">
                  Start Live
                </Text>
                <Text className="text-indigo-100 text-xs font-semibold mt-1">
                  Enter LiveHost with ID
                </Text>
              </View>
            </View>

            <ChevronRight color="white" size={26} strokeWidth={3} />
          </TouchableOpacity>

          <Text className="text-center text-slate-400 mt-8 text-xs font-medium">
            Live sessions are encrypted and secure.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LiveHome;
