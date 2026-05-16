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
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../services/supabase";
import { useUserStore } from "../../store/userStore";
import { getInitials } from "../../utils/stringUtils";

export default function CommunityChatScreen() {
  const navigation = useNavigation<any>();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const { name } = useUserStore();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();

    // REAL-TIME SUBSCRIPTION
    // Ensure we don't have multiple subscriptions for the same channel name in this client instance
    const channelName = 'community_chat_room';
    
    // First, try to remove any existing channel with this name to avoid "already subscribed" errors
    supabase.removeChannel(supabase.channel(channelName));

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_messages' },
        (payload) => {
          if (!payload.new || !payload.new.id) return;

          setMessages((prev) => {
            // 1. Remove any optimistic message from this user with same content
            const filtered = prev.filter(m => 
              !(m.isOptimistic && m.content === payload.new.content && m.user_id === payload.new.user_id)
            );
            
            // 2. Add real message if not already present
            if (filtered.some(m => m.id === payload.new.id)) return filtered;
            return [...filtered, payload.new];
          });
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.log('Realtime subscription status:', status);
        }
      });

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
    if (!item || !item.content) return null;
    
    const initials = getInitials(item.user_name || "F");
    const timeString = item.created_at 
      ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : "Just now";
    
    return (
      <View className="mb-6 px-6" style={{ opacity: item.isOptimistic ? 0.6 : 1 }}>
        <View className="flex-row">
          <View className="w-10 h-10 rounded-full bg-agro-green-100 items-center justify-center border border-agro-green-200 shadow-sm">
            <Text className="text-agro-green-700 font-black text-xs">{initials}</Text>
          </View>
          <View className="ml-3 flex-1">
            <View className="flex-row items-baseline mb-1">
              <Text className="text-agro-green-900 font-extrabold text-sm tracking-tight">{item.user_name || "Farmer"}</Text>
              <Text className="text-agro-earth-400 text-[10px] font-bold ml-2 uppercase">
                {timeString}
              </Text>
            </View>
            <View className="bg-white p-4 rounded-2xl rounded-tl-none border border-agro-earth-100 shadow-sm shadow-agro-green-950/5">
              <Text className="text-agro-green-950 text-[15px] leading-6 font-bold">{item.content}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
        {/* HEADER */}
        <View className="px-6 py-4 border-b border-agro-earth-100 flex-row items-center bg-white shadow-sm">
          <Pressable 
            onPress={() => navigation.getParent()?.openDrawer() || navigation.openDrawer()} 
            className="mr-4 p-2 bg-agro-earth-50 rounded-full border border-agro-earth-100 active:scale-90 transition-all"
          >
            <Ionicons name="menu-outline" size={22} color="#3e8e3e" />
          </Pressable>
          <View>
            <Text className="text-xl font-black text-agro-green-950 tracking-tight">Farmer <Text className="text-agro-green-600">Community</Text></Text>
            <Text className="text-agro-earth-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Global Network</Text>
          </View>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#3e8e3e" />
            <Text className="text-agro-earth-500 font-bold mt-4 tracking-widest uppercase text-[10px]">Connecting to Network...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 24, paddingBottom: 24 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* INPUT AREA */}
        <View className="px-4 pt-3 pb-8 bg-white border-t border-agro-earth-100 flex-row items-center shadow-2xl">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Share farming updates..."
            placeholderTextColor="#bab194"
            selectionColor="#3e8e3e"
            className="flex-1 bg-agro-earth-50 border border-agro-earth-100 rounded-2xl px-5 py-4 text-agro-green-950 font-bold text-base mr-3"
            multiline
          />
          <Pressable
            onPress={sendMessage}
            className="w-14 h-14 rounded-2xl items-center justify-center bg-agro-green-600 shadow-lg shadow-agro-green-700/20 active:scale-90 transition-all"
          >
            <Ionicons name="send" size={22} color="#fff" style={{ marginLeft: 3 }} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
