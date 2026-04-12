import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from "react-native";

export default function ChatbotScreen() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      id: "1",
      text: "Hello 👋 I am AgroTech AI. Ask me anything about crops, fertilizers, irrigation or farming.",
      sender: "bot"
    }
  ]);

  const flatListRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user"
    };

    setChat(prev => [...prev, userMessage]);
    setMessage("");

    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      setTimeout(() => {
        setChat(prev => [...prev, {
          id: Date.now().toString() + "bot",
          text: "⚠️ Gemini API key is missing. Please add EXPO_PUBLIC_GEMINI_API_KEY in your .env file to enable real AI responses.",
          sender: "bot"
        }]);
      }, 500);
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           contents: [{
             parts: [{ text: "You are AgroTech AI, an expert farming assistant. Answer this user concisely: " + message }]
           }]
        })
      });

      const data = await response.json();
      
      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

      setChat(prev => [...prev, {
        id: Date.now().toString() + "bot",
        text: botText,
        sender: "bot"
      }]);
    } catch(err) {
      setChat(prev => [...prev, {
        id: Date.now().toString() + "err",
        text: "Error connecting to AI. Please try again.",
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
      style={{ flex: 1, backgroundColor: "#020617" }} // Tailwind slate-950
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
      />

      {/* INPUT AREA */}
      <View className="flex-row items-center px-4 pt-3 pb-8 bg-slate-950 border-t border-slate-800/80">
        
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Message AgroTech AI..."
          placeholderTextColor="#64748b" // Tailwind slate-500
          selectionColor="#34d399" // Tailwind emerald-400
          className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-5 py-3.5 text-slate-100 text-base"
        />

        <Pressable
          onPress={sendMessage}
          className="ml-3 bg-emerald-500 w-12 h-12 rounded-full items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 active:bg-emerald-600 transition-all"
        >
          {/* Using a styled text button to avoid adding external icon libraries */}
          <Text className="text-white font-extrabold text-[10px] uppercase tracking-widest">
            Send
          </Text>
        </Pressable>

      </View>
    </KeyboardAvoidingView>
  );
}