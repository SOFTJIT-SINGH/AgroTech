import { View, Text, ScrollView, Pressable, StatusBar } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

export default function BlogDetailsScreen({ route, navigation }) {
  const { blog } = route.params;

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

      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* HEADER IMAGE */}
        <Image
          source={{ uri: blog.image }}
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
              <Ionicons name="time-outline" size={16} color="#64748b" />
              <Text className="text-slate-400 font-medium text-sm ml-1.5">
                {blog.date}
              </Text>
            </View>
          </View>

          {/* TITLE */}
          <Text className="text-3xl font-extrabold text-white leading-[40px] mb-6">
            {blog.title}
          </Text>

          {/* DIVIDER */}
          <View className="h-[1px] w-full bg-slate-800/80 mb-6" />

          {/* ARTICLE BODY */}
          <Text className="text-slate-300 text-base leading-8 font-medium">
            {blog.description}
            {"\n\n"}
            This article explains modern agricultural techniques farmers can adopt
            to increase productivity and reduce crop losses. By utilizing smart
            farming tools, weather prediction, and proper soil management,
            yields can be drastically improved even in unpredictable climates.
          </Text>

        </View>
      </ScrollView>
    </View>
  );
}