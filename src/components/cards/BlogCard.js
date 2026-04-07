import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";

export default function BlogCard({ blog, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-xl mb-4 overflow-hidden shadow"
    >
      <Image
        source={{ uri: blog.image }}
        style={{ width: "100%", height: 160 }}
        contentFit="cover"
      />

      <View className="p-4">
        <Text className="text-green-700 text-xs font-semibold">
          {blog.category}
        </Text>

        <Text className="font-bold text-lg mt-1">
          {blog.title}
        </Text>

        <Text className="text-gray-500 text-sm mt-1">
          {blog.description}
        </Text>

        <View className="flex-row justify-between mt-3">
          <Text className="text-gray-400 text-xs">
            {blog.date}
          </Text>

          <Text className="text-green-700 font-semibold text-xs">
            Read More
          </Text>
        </View>
      </View>
    </Pressable>
  );
}