import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { geminiModel } from '../../services/gemini';

const FAQ_DATA = [
  {
    question: "How do I scan a crop for diseases?",
    answer: "Go to the Home screen and tap 'Crop Disease'. Point your camera at the leaf, or upload a photo from gallery. Our AI will analyze it instantly."
  },
  {
    question: "Why is my weather showing '--'?",
    answer: "Weather requires location permission. Go to your device Settings > Apps > AgroTech > Permissions > Location and enable it."
  },
  {
    question: "How do I change my password?",
    answer: "Navigate to Profile > Change Password. Enter your current password, then your new one. Minimum 6 characters."
  },
  {
    question: "Is my scan history saved?",
    answer: "Yes, all your crop scans are saved locally under Profile > My Crops & Scans. You can review past results anytime."
  },
  {
    question: "How accurate is the disease detection?",
    answer: "Our AI uses Google Gemini's advanced vision model with strong accuracy. However, always consult a local agricultural officer for critical decisions."
  },
  {
    question: "Can I use the chatbot offline?",
    answer: "No, the AgroTech AI chatbot requires an internet connection as it uses cloud-based AI (Google Gemini) to generate personalized responses."
  },
];

export default function HelpSupportScreen({ navigation }: any) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const askAI = async () => {
    if (!query.trim()) return;

    setIsAsking(true);
    setAiResponse('');

    try {
      const prompt = `You are AgroTech's customer support assistant. Answer the following user support question clearly and helpfully in 2-3 short sentences. 
      
      CONTEXT: AgroTech is a mobile farming app that provides crop disease detection via camera, weather-based farming advice, AI chatbot, fertilizer planning, crop suggestions, and sowing predictions.
      
      USER QUESTION: ${query}`;

      const result = await geminiModel.generateContent(prompt);
      const text = await result.response.text();
      setAiResponse(text.trim());
    } catch (err) {
      console.log("Help AI error:", err);
      setAiResponse("Sorry, I couldn't process your question right now. Please try again or email us at support@agrotech.com.");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView ref={scrollRef} className="px-6 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => navigation.goBack()} className="mr-4 p-2 bg-slate-900 rounded-2xl border border-slate-800 active:scale-95">
            <Ionicons name="arrow-back" size={22} color="#34d399" />
          </Pressable>
          <Text className="text-2xl font-extrabold text-white tracking-tight">
            Help & <Text className="text-emerald-400">Support</Text>
          </Text>
        </View>

        {/* AI Help Section */}
        <View className="bg-emerald-500/10 rounded-[28px] p-5 mb-8 border border-emerald-500/20 relative overflow-hidden">
          <View className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
          
          <View className="flex-row items-center mb-3 z-10">
            <Ionicons name="sparkles" size={18} color="#34d399" />
            <Text className="text-emerald-400 font-bold text-xs uppercase tracking-widest ml-2">
              AI Support
            </Text>
          </View>
          <Text className="text-slate-300 text-sm leading-6 mb-4 font-medium z-10">
            Can't find what you need? Ask our AI assistant anything about AgroTech.
          </Text>

          <View className="flex-row items-center z-10">
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Ask a question..."
              placeholderTextColor="#64748b"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-base mr-3"
              onSubmitEditing={askAI}
            />
            <Pressable 
              onPress={askAI} 
              disabled={isAsking}
              className="bg-emerald-500 w-12 h-12 rounded-2xl items-center justify-center active:scale-95 active:bg-emerald-600"
            >
              {isAsking ? (
                <ActivityIndicator size="small" color="#020617" />
              ) : (
                <Ionicons name="send" size={18} color="#020617" />
              )}
            </Pressable>
          </View>

          {/* AI Response */}
          {aiResponse ? (
            <View className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/50 mt-4 z-10">
              <View className="flex-row items-center mb-2">
                <Ionicons name="chatbubble-ellipses" size={14} color="#34d399" />
                <Text className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest ml-2">AI Response</Text>
              </View>
              <Text className="text-slate-300 text-sm leading-6 font-medium">{aiResponse}</Text>
            </View>
          ) : null}
        </View>

        {/* FAQ Section */}
        <Text className="text-lg font-bold text-slate-100 mb-4 px-1">
          Frequently Asked Questions
        </Text>

        <View className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden mb-8">
          {FAQ_DATA.map((faq, index) => (
            <Pressable 
              key={index}
              onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
              className={`p-5 ${index < FAQ_DATA.length - 1 ? 'border-b border-slate-800/80' : ''} active:bg-slate-800/60`}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-200 font-semibold text-[15px] flex-1 pr-4">
                  {faq.question}
                </Text>
                <Ionicons 
                  name={expandedFaq === index ? "chevron-up" : "chevron-down"} 
                  size={18} 
                  color="#64748b" 
                />
              </View>
              {expandedFaq === index && (
                <Text className="text-slate-400 text-sm leading-6 mt-3 font-medium">
                  {faq.answer}
                </Text>
              )}
            </Pressable>
          ))}
        </View>

        {/* Contact Section */}
        <Text className="text-lg font-bold text-slate-100 mb-4 px-1">
          Contact Us
        </Text>

        <View className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden mb-12">
          <Pressable 
            onPress={() => Linking.openURL('mailto:support@agrotech.com')}
            className="flex-row items-center p-5 border-b border-slate-800/80 active:bg-slate-800/60"
          >
            <View className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 mr-4">
              <Ionicons name="mail-outline" size={22} color="#34d399" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-200 font-semibold text-base">Email Support</Text>
              <Text className="text-slate-500 text-sm mt-0.5">support@agrotech.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </Pressable>

          <Pressable 
            onPress={() => Linking.openURL('tel:+911800123456')}
            className="flex-row items-center p-5 active:bg-slate-800/60"
          >
            <View className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 mr-4">
              <Ionicons name="call-outline" size={22} color="#34d399" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-200 font-semibold text-base">Phone Support</Text>
              <Text className="text-slate-500 text-sm mt-0.5">1800-123-456 (Toll Free)</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
