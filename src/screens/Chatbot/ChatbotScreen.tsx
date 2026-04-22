import React, { useState, useRef, useEffect } from "react";
import { Switch } from "react-native";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { geminiModel } from "../../services/gemini";
import { useUserStore } from "../../store/userStore";
import { supabase } from "../../services/supabase";

const TypingIndicator = () => {
  const op1 = useRef(new Animated.Value(0.3)).current;
  const op2 = useRef(new Animated.Value(0.3)).current;
  const op3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(op1, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(op2, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(op3, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(op1, { toValue: 0.3, duration: 200, useNativeDriver: true }),
        Animated.timing(op2, { toValue: 0.3, duration: 200, useNativeDriver: true }),
        Animated.timing(op3, { toValue: 0.3, duration: 200, useNativeDriver: true }),
      ]).start((result) => {
        if (result.finished) {
          animate();
        }
      });
    };
    animate();
  }, []);

  return (
    <View className="flex-row items-center h-6 px-1">
      <Animated.View style={{ opacity: op1 }} className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5" />
      <Animated.View style={{ opacity: op2 }} className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5" />
      <Animated.View style={{ opacity: op3 }} className="w-2 h-2 rounded-full bg-emerald-400" />
    </View>
  );
};

export default function ChatbotScreen() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chat, setChat] = useState([
    {
      id: "1",
      text: "Hello 👋 I am AgroTech AI. Ask me anything about crops, fertilizers, irrigation or farming.",
      sender: "bot"
    }
  ]);

  const flatListRef = useRef<FlatList>(null);
  const [useEnglish, setUseEnglish] = useState(false);

  // --- NEW: FETCH CHAT HISTORY ---
  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('chatlogs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('timestamp', { ascending: true });

      if (data && data.length > 0) {
        const historyMessages = data.flatMap(log => [
          { id: log.chat_id + '_q', text: log.query, sender: 'user' },
          { id: log.chat_id + '_r', text: log.response, sender: 'bot' }
        ]);
        setChat(prev => [...prev, ...historyMessages]);
      }
    };
    fetchHistory();
  }, []);

  // Pull dynamic user details and weather from Zustand store (already fetched in AppNavigator)
  const { name, location, farmSize, mainCrop, weather, preferredLanguage } = useUserStore();

  // Build weather context string from store
  const weatherContext = weather 
    ? `${weather.temperature}°C, ${weather.condition}, Wind: ${weather.wind} km/h`
    : "Weather data unavailable";

  const sendMessage = async () => {
    if (!message.trim() || isSending) return;

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user"
    };

    setChat(prev => [...prev, userMessage]);
    const currentInput = message;
    setMessage("");
    setIsSending(true);

    if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
      setTimeout(() => {
        setChat(prev => [...prev, {
          id: Date.now().toString() + "bot",
          text: "⚠️ Gemini API key is missing. Please add EXPO_PUBLIC_GEMINI_API_KEY in your .env file.",
          sender: "bot"
        }]);
        setIsSending(false);
      }, 500);
      return;
    }

    try {
      const currentDate = new Date().toLocaleDateString('en-IN', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });

      const activeLanguage = useEnglish || !preferredLanguage ? 'English' : preferredLanguage;

      const systemPrompt = `You are AgroTech AI, an expert agricultural assistant. 
      
      CONTEXT ABOUT THE FARMER:
      - Name: ${name}
      - General Location: ${location || 'Unknown'}
      - Farm Size: ${farmSize || 'Unknown'}
      - Primary Crop: ${mainCrop || 'Unknown'}
      - Active Language: ${activeLanguage}
      - Current Date: ${currentDate}
      - Current Local Weather: ${weatherContext}

      INSTRUCTIONS: Use this context to provide highly personalized, precise, and concise advice. 
      IMPORTANT: You MUST reply in the active language (${activeLanguage}). If it is English, reply in English. If it is another language, reply strictly in that language.
      If they ask a generic question (e.g., "Should I water my farm today?"), check their weather and crop context to answer. 
      Do not narrate the context back to them unless it directly justifies your advice.
      Keep responses concise (2-4 paragraphs max).

      USER QUERY: `;
      
      const result = await geminiModel.generateContent(systemPrompt + currentInput);
      const text = await result.response.text();
      const botResponse = text.trim();

      // --- NEW: SAVE TO DATABASE ---
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('chatlogs').insert({
          user_id: session.user.id,
          query: currentInput,
          response: botResponse,
        });
      }

      setChat(prev => [...prev, {
        id: (Date.now() + 1).toString() + "bot",
        text: botResponse,
        sender: "bot"
      }]);
    } catch(err) {
      console.error("Chatbot Error:", err);
      setChat(prev => [...prev, {
        id: (Date.now() + 1).toString() + "err",
        text: "Error connecting to AI. Please try again or check your API key.",
        sender: "bot"
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isUser = item.sender === "user";

    return (
      <View
        className={`mb-5 px-5 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <View
          className={`px-5 py-3.5 max-w-[82%] ${
            isUser
              ? "bg-emerald-600 rounded-3xl rounded-tr-sm shadow-md shadow-emerald-900/20"
              : "bg-slate-900 border border-slate-800 rounded-3xl rounded-tl-sm"
          }`}
        >
          {item.isTyping ? (
            <TypingIndicator />
          ) : (
            <Text
              className={`text-base leading-6 ${
                isUser ? "text-white font-medium" : "text-slate-200"
              }`}
            >
              {item.text}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#020617" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* HEADER */}
      <View className="bg-slate-950 pt-16 pb-3 px-6 border-b border-slate-800/80 z-10 flex-row justify-between items-center">
        <View>
          <Text className="text-white text-2xl font-extrabold tracking-tight">
            AgroTech <Text className="text-emerald-400">AI</Text>
          </Text>

          <View className="flex-row items-center mt-1.5">
            <View className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-sm shadow-emerald-400/50" />
            <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Online & Ready
            </Text>
          </View>
        </View>

        {/* LANGUAGE TOGGLE */}
        <View className="items-center">
          <Text className="text-[10px] text-slate-400 font-bold mb-1 uppercase">
            {useEnglish ? 'English' : (preferredLanguage || 'Regional')}
          </Text>
          <Switch
            value={useEnglish}
            onValueChange={setUseEnglish}
            trackColor={{ false: '#34d399', true: '#334155' }}
            thumbColor="#f8fafc"
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>
      </View>

      {/* CHAT LIST */}
      <FlatList
        ref={flatListRef}
        data={isSending ? [...chat, { id: 'typing', text: '...', sender: 'bot', isTyping: true }] : chat}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* INPUT AREA */}
      <View className="flex-row items-center px-4 pt-3 pb-8 bg-slate-950 border-t border-slate-800/80">
        
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Ask about your crops..."
          placeholderTextColor="#64748b"
          selectionColor="#34d399"
          className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-5 py-3.5 text-slate-100 text-base"
          editable={!isSending}
          onSubmitEditing={sendMessage}
        />

        <Pressable
          onPress={sendMessage}
          disabled={isSending}
          className={`ml-3 w-12 h-12 rounded-full items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-all ${isSending ? 'bg-emerald-700' : 'bg-emerald-500 active:bg-emerald-600'}`}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 3 }} />
          )}
        </Pressable>

      </View>
    </KeyboardAvoidingView>
  );
}