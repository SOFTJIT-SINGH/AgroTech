import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import * as Location from "expo-location";
import { geminiModel } from "../../services/gemini";
import { useUserStore } from "../../store/userStore"; // Import your Zustand store

export default function ChatbotScreen() {
  const [message, setMessage] = useState("");
  const [weatherContext, setWeatherContext] = useState("Fetching weather...");
  const [chat, setChat] = useState([
    {
      id: "1",
      text: "Hello 👋 I am AgroTech AI. Ask me anything about crops, fertilizers, irrigation or farming.",
      sender: "bot"
    }
  ]);

  const flatListRef = useRef<FlatList>(null);

  // 1. Pull dynamic user details from your Zustand Store
  const { name, location, farmSize, mainCrop } = useUserStore();

  // 2. Fetch real-time weather once when the chat screen opens
  useEffect(() => {
    const fetchLocalWeather = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setWeatherContext("Weather unknown (Permission denied)");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const { latitude, longitude } = loc.coords;

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const data = await res.json();
        const current = data.current_weather;

        setWeatherContext(`${current.temperature}°C, Wind: ${current.windspeed} km/h`);
      } catch (error) {
        console.log("Chatbot weather fetch error:", error);
        setWeatherContext("Weather temporarily unavailable");
      }
    };

    fetchLocalWeather();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user"
    };

    setChat(prev => [...prev, userMessage]);
    const currentInput = message;
    setMessage("");

    if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
      setTimeout(() => {
        setChat(prev => [...prev, {
          id: Date.now().toString() + "bot",
          text: "⚠️ Gemini API key is missing. Please add EXPO_PUBLIC_GEMINI_API_KEY in your .env file.",
          sender: "bot"
        }]);
      }, 500);
      return;
    }

    try {
      // 3. Generate the dynamic System Prompt
      const currentDate = new Date().toLocaleDateString('en-IN', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });

      const systemPrompt = `You are AgroTech AI, an expert agricultural assistant. 
      
      CONTEXT ABOUT THE FARMER:
      - Name: ${name}
      - General Location: ${location}
      - Farm Size: ${farmSize}
      - Primary Crop: ${mainCrop}
      - Current Date: ${currentDate}
      - Current Local Weather: ${weatherContext}

      INSTRUCTIONS: Use this context to provide highly personalized, precise, and concise advice. 
      If they ask a generic question (e.g., "Should I water my farm today?"), check their weather and crop context to answer. 
      Do not narrate the context back to them unless it directly justifies your advice.

      USER QUERY: `;
      
      // Send the combined prompt + user input to Gemini 2.5 Flash
      const result = await geminiModel.generateContent(systemPrompt + currentInput);
      const text = await result.response.text();

      setChat(prev => [...prev, {
        id: (Date.now() + 1).toString() + "bot",
        text: text.trim(),
        sender: "bot"
      }]);
    } catch(err) {
      console.error("Chatbot Error:", err);
      setChat(prev => [...prev, {
        id: (Date.now() + 1).toString() + "err",
        text: "Error connecting to AI. Please try again or check your API key.",
        sender: "bot"
      }]);
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
          <Text
            className={`text-base leading-6 ${
              isUser ? "text-white font-medium" : "text-slate-200"
            }`}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#020617" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* HEADER */}
      <View className="bg-slate-950 pt-16 pb-5 px-6 border-b border-slate-800/80 z-10">
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

      {/* CHAT LIST */}
      <FlatList
        ref={flatListRef}
        data={chat}
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
        />

        <Pressable
          onPress={sendMessage}
          className="ml-3 bg-emerald-500 w-12 h-12 rounded-full items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 active:bg-emerald-600 transition-all"
        >
          <Text className="text-white font-extrabold text-[10px] uppercase tracking-widest">
            Send
          </Text>
        </Pressable>

      </View>
    </KeyboardAvoidingView>
  );
}