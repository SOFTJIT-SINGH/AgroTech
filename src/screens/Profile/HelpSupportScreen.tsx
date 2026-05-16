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
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      {/* Header */}
      <View className="px-6 py-5 border-b border-agro-earth-100 flex-row items-center bg-white shadow-sm">
        <Pressable 
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.openDrawer()} 
          className="mr-4 p-2 bg-agro-earth-50 rounded-full border border-agro-earth-100 active:scale-90 transition-all"
        >
          <Ionicons name={navigation.canGoBack() ? "arrow-back" : "menu-outline"} size={22} color="#3e8e3e" />
        </Pressable>
        <View>
          <Text className="text-2xl font-extrabold text-agro-green-950 tracking-tight">Help & <Text className="text-agro-green-600">Support</Text></Text>
          <Text className="text-agro-earth-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">24/7 Assistance</Text>
        </View>
      </View>

      <ScrollView ref={scrollRef} className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* AI Help Section */}
        <View className="bg-white rounded-[32px] p-6 mb-10 border border-agro-earth-100 relative overflow-hidden shadow-xl shadow-agro-green-950/5">
          <View className="absolute -top-16 -right-16 w-48 h-48 bg-agro-green-500/5 rounded-full blur-3xl" />
          
          <View className="flex-row items-center mb-4 z-10">
            <View className="bg-agro-green-100 p-2 rounded-xl border border-agro-green-200">
              <Ionicons name="sparkles" size={18} color="#2d722d" />
            </View>
            <Text className="text-agro-green-700 font-black text-xs uppercase tracking-widest ml-3">
              AI Support Bot
            </Text>
          </View>
          
          <Text className="text-agro-green-950 text-xl font-black mb-3 z-10">
            How can we help you today?
          </Text>
          <Text className="text-agro-earth-600 text-[13px] leading-5 font-bold mb-6 z-10">
            Ask our intelligent assistant anything about AgroTech features or troubleshooting.
          </Text>

          <View className="flex-row items-center z-10">
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Type your question..."
              placeholderTextColor="#bab194"
              className="flex-1 bg-agro-earth-50 border border-agro-earth-100 rounded-2xl px-5 py-4 text-agro-green-950 font-bold text-base mr-3"
              onSubmitEditing={askAI}
            />
            <Pressable 
              onPress={askAI} 
              disabled={isAsking}
              className="bg-agro-green-600 w-14 h-14 rounded-2xl items-center justify-center shadow-lg shadow-agro-green-700/20 active:scale-90"
            >
              {isAsking ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="send" size={20} color="#ffffff" style={{ marginLeft: 3 }} />
              )}
            </Pressable>
          </View>

          {/* AI Response Area */}
          {aiResponse ? (
            <View className="bg-agro-green-50/80 p-5 rounded-2xl border border-agro-green-100 mt-6 z-10 animate-fade-in">
              <View className="flex-row items-center mb-3">
                <Ionicons name="chatbubble-ellipses" size={14} color="#3e8e3e" />
                <Text className="text-agro-green-700 font-black text-[10px] uppercase tracking-widest ml-2">AI Expert Response</Text>
              </View>
              <Text className="text-agro-green-950 text-[15px] leading-6 font-bold">{aiResponse}</Text>
            </View>
          ) : null}
        </View>

        {/* FAQ Section */}
        <View className="mb-10">
          <View className="flex-row items-center mb-6 px-1">
            <Text className="text-xl font-extrabold text-agro-green-950 tracking-tight">
              Common Questions
            </Text>
          </View>

          <View className="bg-white rounded-[32px] border border-agro-earth-100 overflow-hidden shadow-sm">
            {FAQ_DATA.map((faq, index) => (
              <Pressable 
                key={index}
                onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="p-6 active:bg-agro-earth-50/50"
                style={index < FAQ_DATA.length - 1 ? { borderBottomWidth: 1, borderBottomColor: '#f7f6f2' } : undefined}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-agro-green-950 font-black text-[15px] flex-1 pr-4 tracking-tight leading-6">
                    {faq.question}
                  </Text>
                  <View className="w-8 h-8 rounded-full items-center justify-center" style={expandedFaq === index ? { backgroundColor: '#dcf0dc' } : { backgroundColor: '#f7f6f2' }}>
                    <Ionicons 
                      name={expandedFaq === index ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color={expandedFaq === index ? "#2d722d" : "#8f7e5d"} 
                    />
                  </View>
                </View>
                {expandedFaq === index && (
                  <View className="mt-4 pt-4 border-t border-agro-earth-50">
                    <Text className="text-agro-earth-700 text-sm leading-6 font-bold">
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View className="mb-12">
          <Text className="text-xl font-extrabold text-agro-green-950 mb-6 tracking-tight px-1">
            Need More Help?
          </Text>

          <View className="bg-white rounded-[32px] border border-agro-earth-100 overflow-hidden shadow-sm">
            <Pressable 
              onPress={() => Linking.openURL('mailto:support@agrotech.com')}
              className="flex-row items-center p-6 border-b border-agro-earth-50 active:bg-agro-earth-50/50"
            >
              <View className="bg-agro-accent-100 p-4 rounded-[20px] border border-agro-accent-200 mr-5">
                <Ionicons name="mail" size={22} color="#b88a11" />
              </View>
              <View className="flex-1">
                <Text className="text-agro-green-950 font-black text-base tracking-tight">Email Support</Text>
                <Text className="text-agro-earth-500 text-xs font-bold mt-0.5">support@agrotech.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#bab194" />
            </Pressable>

            <Pressable 
              onPress={() => Linking.openURL('tel:+911800123456')}
              className="flex-row items-center p-6 active:bg-agro-earth-50/50"
            >
              <View className="bg-agro-green-100 p-4 rounded-[20px] border border-agro-green-200 mr-5">
                <Ionicons name="call" size={22} color="#2d722d" />
              </View>
              <View className="flex-1">
                <Text className="text-agro-green-950 font-black text-base tracking-tight">Phone Support</Text>
                <Text className="text-agro-earth-500 text-xs font-bold mt-0.5">1800-123-456 (Toll Free)</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#bab194" />
            </Pressable>
          </View>
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
