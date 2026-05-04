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
    <View className="flex-1 bg-agro-earth-50">
      <StatusBar barStyle="dark-content" />

      {/* FLOATING BACK BUTTON */}
      <Pressable
        onPress={() => navigation.goBack()}
        className="absolute top-14 left-5 z-10 w-11 h-11 bg-white/90 rounded-full items-center justify-center border border-agro-earth-200 shadow-lg active:scale-90 transition-all"
      >
        <Ionicons name="chevron-back" size={24} color="#3e8e3e" />
      </Pressable>

      {/* ACTIONS ROW (only for owner) */}
      {isOwner && (
        <View className="absolute top-14 right-5 z-10 flex-row items-center gap-3">
          {/* EDIT BUTTON */}
          <Pressable
            onPress={() => navigation.navigate('CreateBlog', { editBlog: blog })}
            className="w-11 h-11 bg-agro-green-100 rounded-full items-center justify-center border border-agro-green-200 shadow-lg active:scale-90"
          >
            <Ionicons name="pencil" size={20} color="#3e8e3e" />
          </Pressable>

          {/* DELETE BUTTON */}
          <Pressable
            onPress={handleDelete}
            className="w-11 h-11 bg-red-50 rounded-full items-center justify-center border border-red-100 shadow-lg active:scale-90"
          >
            <Ionicons name="trash-outline" size={20} color="#dc2626" />
          </Pressable>
        </View>
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
          className="bg-agro-earth-100"
        />

        {/* MAIN CONTENT CONTAINER (Overlaps the image) */}
        <View className="-mt-8 bg-white rounded-t-[32px] px-6 pt-8 pb-12 flex-1 shadow-2xl shadow-agro-green-950/5 border-t border-agro-earth-100">
          
          {/* META DATA ROW */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="bg-agro-green-100 px-3.5 py-1.5 rounded-xl border border-agro-green-200">
              <Text className="text-agro-green-700 font-black text-[10px] uppercase tracking-widest">
                {blog.category}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#bab194" />
              <Text className="text-agro-earth-500 font-bold text-xs ml-1.5 uppercase tracking-wider">
                {readTime} min read
              </Text>
            </View>
          </View>

          {/* TITLE */}
          <Text className="text-3xl font-black text-agro-green-950 leading-[42px] mb-6">
            {blog.title}
          </Text>

          {/* AUTHOR & DATE ROW */}
          <View className="flex-row items-center mb-8 bg-agro-earth-50 p-4 rounded-[24px] border border-agro-earth-100">
            <View className="bg-agro-green-600 w-11 h-11 rounded-full items-center justify-center border-2 border-white shadow-sm mr-4">
              <Ionicons name="person" size={20} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-agro-green-950 font-black text-base">{blog.author_name || 'Anonymous'}</Text>
              <Text className="text-agro-earth-500 text-xs font-bold mt-0.5 uppercase tracking-widest">
                {formatDate(blog.created_at || blog.date)}
              </Text>
            </View>
          </View>

          {/* DIVIDER */}
          <View className="h-[1px] w-full bg-agro-earth-100 mb-8" />

          {/* ARTICLE BODY */}
          <Text className="text-agro-earth-700 text-[17px] leading-8 font-bold">
            {content}
          </Text>

          {/* WORD COUNT FOOTER */}
          <View className="mt-12 pt-8 border-t border-agro-earth-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="document-text-outline" size={16} color="#bab194" />
              <Text className="text-agro-earth-400 text-[10px] font-black uppercase tracking-widest ml-2">{wordCount} words written</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color="#bab194" />
              <Text className="text-agro-earth-400 text-[10px] font-black uppercase tracking-widest ml-2">
                {formatDate(blog.created_at || blog.date)}
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}