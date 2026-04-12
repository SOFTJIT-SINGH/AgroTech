import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

export default function BlogCard({ blog, onPress }) {
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex-row active:scale-[0.98] active:opacity-90 transition-all"
    >
      <Image
        source={{ uri: blog.image_url || blog.image }}
        style={{ width: 110, height: 130 }}
        className="bg-slate-800"
      />
      <View className="flex-1 p-4 justify-between">
        <View>
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">{blog.category}</Text>
            <Text className="text-slate-600 text-[10px] font-medium">{formatDate(blog.created_at || blog.date)}</Text>
          </View>
          <Text className="font-bold text-white text-[15px] leading-[22px] mb-1.5" numberOfLines={2}>
            {blog.title}
          </Text>
          <Text className="text-slate-500 text-xs leading-5" numberOfLines={2}>
            {blog.content || blog.description}
          </Text>
        </View>
        {blog.author_name && (
          <View className="flex-row items-center mt-1">
            <Ionicons name="person-circle-outline" size={14} color="#475569" />
            <Text className="text-slate-600 text-[10px] font-medium ml-1">{blog.author_name}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}