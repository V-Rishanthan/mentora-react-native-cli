import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';

const NewChatDialog = ({ open, setOpen }) => {
  const handleStartChat = () => {
    setOpen(false);
  };

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={() => setOpen(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-black/40 justify-center px-6"
      >
        {/* Dialog Card */}
        <View className="bg-white rounded-3xl p-6 shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-lg font-bold text-gray-900">
              Start new chat
            </Text>

            <TouchableOpacity
              onPress={() => setOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
              activeOpacity={0.8}
            >
              <X size={18} color="#0F172A" />
            </TouchableOpacity>
          </View>

          {/* Input */}
          <Text className="text-sm text-gray-500 mb-2">User ID</Text>
          <TextInput
            placeholder="ex: user_123"
            placeholderTextColor="#94A3B8"
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 mb-6"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setOpen(false)}
              className="flex-1 bg-gray-100 py-3 rounded-2xl items-center"
              activeOpacity={0.85}
            >
              <Text className="text-gray-900 font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleStartChat}
              className="flex-1 bg-primary py-3 rounded-2xl items-center"
              activeOpacity={0.85}
            >
              <Text className="text-white font-semibold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default NewChatDialog;
