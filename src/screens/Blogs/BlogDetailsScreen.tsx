import { View, Text, ScrollView, Pressable, StatusBar, Alert } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../services/supabase";
import { useState, useEffect } from "react";

export default function BlogDetailsScreen({ route, navigation }: any) {
  const { blog } = route.params;
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id === blog.author_id) {
        setIsOwner(true);
      }
    };
    checkOwnership();
  }, []);

  const formatDate = (isoDate: string) => {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Blog",
      "Are you sure you want to delete this blog? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from('blogs').delete().eq('id', blog.id);
            if (error) {
              Alert.alert("Error", error.message);
            } else {
              navigation.goBack();
            }
          }
        }
      ]
    );
  };

  // Calculate read time (~200 words per minute)
  const content = blog.content || blog.description || '';
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />

      {/* FLOATING BACK BUTTON */}
      <Pressable
        onPress={() => navigation.goBack()}
        className="absolute top-14 left-5 z-10 w-11 h-11 bg-slate-900/60 rounded-full items-center justify-center border border-white/10 active:scale-90 transition-transform"
      >
        <Ionicons name="chevron-back" size={24} color="#f8fafc" />
      </Pressable>

      {/* DELETE BUTTON (only for owner) */}
      {isOwner && (
        <Pressable
          onPress={handleDelete}
          className="absolute top-14 right-5 z-10 w-11 h-11 bg-red-500/20 rounded-full items-center justify-center border border-red-500/30 active:scale-90"
        >
          <Ionicons name="trash-outline" size={20} color="#f43f5e" />
        </Pressable>
      )}

      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* HEADER IMAGE */}
        <Image
          source={{ uri: blog.image_url || blog.image }}
          style={{ width: "100%", height: 350 }}
          contentFit="cover"
          className="bg-slate-800"
        />

        {/* MAIN CONTENT CONTAINER (Overlaps the image) */}
        <View className="-mt-8 bg-slate-950 rounded-t-[32px] px-6 pt-8 pb-12 flex-1 shadow-lg shadow-slate-900">
          
          {/* META DATA ROW */}
          <View className="flex-row items-center justify-between mb-5">
            <View className="bg-emerald-500/10 px-3.5 py-1.5 rounded-lg border border-emerald-500/20">
              <Text className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
                {blog.category}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#64748b" />
              <Text className="text-slate-500 font-medium text-xs ml-1.5">
                {readTime} min read
              </Text>
            </View>
          </View>

          {/* TITLE */}
          <Text className="text-3xl font-extrabold text-white leading-[40px] mb-4">
            {blog.title}
          </Text>

          {/* AUTHOR & DATE ROW */}
          <View className="flex-row items-center mb-6 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <View className="bg-emerald-500/15 w-10 h-10 rounded-full items-center justify-center border border-emerald-500/20 mr-3">
              <Ionicons name="person" size={18} color="#34d399" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-200 font-bold text-sm">{blog.author_name || 'Anonymous'}</Text>
              <Text className="text-slate-500 text-xs font-medium mt-0.5">
                {formatDate(blog.created_at || blog.date)}
              </Text>
            </View>
          </View>

          {/* DIVIDER */}
          <View className="h-[1px] w-full bg-slate-800/80 mb-6" />

          {/* ARTICLE BODY */}
          <Text className="text-slate-300 text-base leading-8 font-medium">
            {content}
          </Text>

          {/* WORD COUNT FOOTER */}
          <View className="mt-8 pt-6 border-t border-slate-800/80 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="document-text-outline" size={16} color="#475569" />
              <Text className="text-slate-600 text-xs font-medium ml-2">{wordCount} words</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color="#475569" />
              <Text className="text-slate-600 text-xs font-medium ml-2">
                {formatDate(blog.created_at || blog.date)}
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}