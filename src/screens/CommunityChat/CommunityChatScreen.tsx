import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../services/supabase";
import { useUserStore } from "../../store/userStore";
import { getInitials } from "../../utils/stringUtils";

export default function CommunityChatScreen({ navigation }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const { name } = useUserStore();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();

    // REAL-TIME SUBSCRIPTION
    const channel = supabase
      .channel('community_chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_messages' },
        (payload) => {
          setMessages((prev) => {
            // 1. Remove any optimistic message from this user with same content
            // (This prevents double-showing when the real message arrives)
            const filtered = prev.filter(m => 
              !(m.isOptimistic && m.content === payload.new.content && m.user_id === payload.new.user_id)
            );
            
            // 2. Add real message if not already present
            if (filtered.find(m => m.id === payload.new.id)) return filtered;
            return [...filtered, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("community_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) throw error;
      if (data) setMessages(data);
    } catch (err: any) {
      console.error("Fetch Messages Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const messageContent = inputText.trim();
    setInputText(""); // Clear input immediately for better UX

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        Alert.alert("Error", "You must be logged in to chat.");
        return;
      }

      // OPTIMISTIC UI: Add message locally immediately
      const optimisticId = `temp-${Date.now()}`;
      const newMessage = {
        id: optimisticId,
        user_id: session.user.id,
        user_name: name || "Farmer",
        content: messageContent,
        created_at: new Date().toISOString(),
        isOptimistic: true,
      };

      setMessages((prev) => [...prev, newMessage]);

      const { error } = await supabase.from("community_messages").insert({
        user_id: session.user.id,
        user_name: name || "Farmer",
        content: messageContent,
      });
      
      if (error) {
        console.error("Chat Insert Error:", error);
        // Remove optimistic message on error
        setMessages((prev) => prev.filter(m => m.id !== optimisticId));
        Alert.alert("Error", "Failed to send message: " + error.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const initials = getInitials(item.user_name || "F");
    
    return (
      <View className={`mb-6 px-6 ${item.isOptimistic ? 'opacity-70' : 'opacity-100'}`}>
        <View className="flex-row">
          <View className="w-10 h-10 rounded-full bg-emerald-500 items-center justify-center border border-emerald-400/30">
            <Text className="text-white font-bold text-xs">{initials}</Text>
          </View>
          <View className="ml-3 flex-1">
            <View className="flex-row items-baseline">
              <Text className="text-emerald-400 font-bold text-sm">{item.user_name}</Text>
              <Text className="text-slate-500 text-[10px] ml-2">
                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View className="bg-slate-900 mt-1 p-4 rounded-2xl rounded-tl-none border border-slate-800">
              <Text className="text-slate-200 text-base leading-6">{item.content}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* HEADER */}
        <View className="px-6 py-4 border-b border-slate-900 flex-row items-center">
          <Pressable onPress={() => navigation.openDrawer()} className="mr-4">
            <Ionicons name="menu-outline" size={24} color="#34d399" />
          </Pressable>
          <View>
            <Text className="text-xl font-black text-white">Farmer <Text className="text-emerald-400">Community</Text></Text>
            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Global Broadcast</Text>
          </View>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#34d399" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* INPUT AREA */}
        <View className="px-4 py-4 bg-slate-950 border-t border-slate-900 flex-row items-center">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Share an update or ask a question..."
            placeholderTextColor="#64748b"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white text-base mr-3"
            multiline
          />
          <Pressable
            onPress={sendMessage}
            className="w-14 h-14 rounded-2xl items-center justify-center bg-emerald-500 active:scale-90"
          >
            <Ionicons name="send" size={24} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
