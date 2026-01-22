import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send, Bot, User, ChevronLeft, Sparkles } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { getGeminiResponse } from "../../services/geminiService";

const Chat = () => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [hasResponse, setHasResponse] = useState(false);
  const scrollViewRef = useRef(null);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const subject = inputText;
    setResponseText("");
    setHasResponse(false);
    setLoading(true);

    try {
      const prompt = `Write about the core topics for "${subject}".
      Constraints:
      - Output exactly TWO paragraphs only.
      - No bullet points or numbering.
      - No headings.
      - No introductory or concluding sentences.
      - Each paragraph should naturally mention multiple core topics.
      - Keep the language simple and clear.
      - Do not include explanations or examples.`;

      const response = await getGeminiResponse(prompt);
      setResponseText(response);
      setHasResponse(true);
      
      // Scroll to show response after a short delay
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error(error);
      setResponseText("Sorry, I couldn't generate a response. Please try again.");
      setHasResponse(true);
    } finally {
      setLoading(false);
      setInputText("");
    }
  };

  // Scroll to end when response appears
  useEffect(() => {
    if (hasResponse && responseText) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [hasResponse, responseText]);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-50">
      {/* Header - Fixed at top */}
      <View className="bg-primary pt-4 pb-4 px-6 shadow-lg">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="bg-white/20 p-2 rounded-xl"
          >
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <View className="ml-4">
            <Text className="text-white text-xl font-black">Mentora AI Tutor</Text>
            <View className="flex-row items-center">
              <View className="h-2 w-2 rounded-full bg-emerald-400 mr-2" />
              <Text className="text-indigo-100 text-xs font-medium">Always active</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Input Section - Fixed below header */}
      <View className="bg-white px-6 py-4 border-b border-slate-200 shadow-sm">
        <View className="flex-row items-center space-x-3">
          <View className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl px-5 py-2 flex-row items-center shadow-sm">
            <TextInput
              className="flex-1 text-slate-900 text-base py-2"
              placeholder="Which subject would you like me to summarize today?"
              placeholderTextColor="#94a3b8"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={200}
              style={{ 
                maxHeight: 100,
                minHeight: 40,
                textAlignVertical: 'center'
              }}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              editable={!loading}
            />
          </View>
          
          <TouchableOpacity 
            onPress={handleSendMessage}
            disabled={loading || !inputText.trim()}
            className={`h-12 w-12 rounded-2xl items-center justify-center shadow-md ml-5 ${
              loading || !inputText.trim() ? 'bg-slate-300' : 'bg-primary'
            }`}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Send size={20} color="white"  />
            )}
          </TouchableOpacity>
        </View>
        
        {/* Prompt hint */}
        <View className="mt-2 ml-1">
          <Text className="text-slate-500 text-xs">
            Try: "Physics", "World History", "Algebra", or any subject you'd like to learn about
          </Text>
        </View>
      </View>

      {/* Response Area - Scrollable */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{ 
            padding: 24,
            paddingTop: 16,
            paddingBottom: 40
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!hasResponse ? (
            // Initial empty state
            <View className="flex-1 items-center justify-center py-20">
              <View className="h-24 w-24 rounded-full bg-indigo-50 items-center justify-center mb-6">
                <Sparkles size={40} color="#4f46e5" />
              </View>
              <Text className="text-slate-600 text-lg font-semibold text-center mb-2">
                Ask About Any Subject
              </Text>
              <Text className="text-slate-500 text-center text-base leading-6 max-w-md">
                I'll provide a concise, two-paragraph summary of the core topics for any subject you choose.
              </Text>
              <View className="mt-10 bg-slate-100 rounded-2xl p-5">
                <Text className="text-slate-700 font-medium mb-2">Example prompts:</Text>
                <View className="space-y-2">
                  <Text className="text-slate-600">• "Summarize Calculus concepts"</Text>
                  <Text className="text-slate-600">• "Tell me about World War II"</Text>
                  <Text className="text-slate-600">• "Explain Biology fundamentals"</Text>
                </View>
              </View>
            </View>
          ) : (
            // Response display
            <View className="space-y-6">
              {/* User's query */}
              <View className="flex-row justify-end mb-6">
                <View className="max-w-[85%]">
                  <View className="flex-row items-center justify-end mb-2">
                    <View className="h-8 w-8 rounded-full bg-indigo-600 items-center justify-center ml-3">
                      <User size={16} color="white" />
                    </View>
                    <Text className="text-slate-500 text-sm font-medium ml-2">You asked:</Text>
                  </View>
                  <View className="bg-indigo-600 p-5 rounded-[24px] rounded-tr-none shadow-md shadow-indigo-200">
                    <Text className="text-white text-base leading-6">
                      {inputText}
                    </Text>
                  </View>
                </View>
              </View>

              {/* AI Response */}
              <View className="flex-row">
                <View className="max-w-[85%]">
                  <View className="flex-row items-center mb-2">
                    <View className="h-8 w-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
                      <Bot size={16} color="#4f46e5" />
                    </View>
                    <Text className="text-slate-500 text-sm font-medium">AI Tutor response:</Text>
                  </View>
                  <View className="bg-white border border-slate-100 p-5 rounded-[24px] rounded-tl-none shadow-sm">
                    {loading ? (
                      <View className="py-4">
                        <ActivityIndicator size="large" color="#4f46e5" />
                        <Text className="text-slate-500 text-center mt-3">
                          Generating your summary...
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-slate-700 text-base leading-7">
                        {responseText}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Ask another button */}
              {!loading && hasResponse && (
                <View className="mt-10 pt-8 border-t border-slate-200">
                  <TouchableOpacity
                    onPress={() => {
                      setHasResponse(false);
                      setResponseText("");
                      setInputText("");
                    }}
                    className="bg-white border border-slate-300 rounded-2xl p-4 flex-row items-center justify-center space-x-3 shadow-sm"
                  >
                    <Sparkles size={18} color="#4f46e5" />
                    <Text className="text-indigo-600 font-semibold text-base">
                      Ask about another subject
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;