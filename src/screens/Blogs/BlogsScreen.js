import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import BlogCard from "../../components/cards/BlogCard";

export default function BlogsScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const categories = [
    "All",
    "Crop Tips",
    "Fertilizer",
    "Irrigation",
    "Market"
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Best Crops for Summer Season",
      category: "Crop Tips",
      description: "Learn which crops produce high yield during summer.",
      date: "12 Mar 2026",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
    },
    {
      id: 2,
      title: "How to Use Organic Fertilizers",
      category: "Fertilizer",
      description: "Improve soil health with organic fertilizer methods.",
      date: "10 Mar 2026",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399"
    },
    {
      id: 3,
      title: "Smart Irrigation Techniques",
      category: "Irrigation",
      description: "Save water and increase crop productivity.",
      date: "8 Mar 2026",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e"
    }
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchCategory =
      selectedCategory === "All" || blog.category === selectedCategory;

    const matchSearch = blog.title.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      
      {/* HEADER */}
      <View className="px-6 pt-5 pb-4">
        <Text className="text-3xl font-extrabold text-white tracking-tight">
          Agriculture <Text className="text-emerald-400">Blogs</Text>
        </Text>
        <Text className="text-slate-400 font-medium mt-1 text-sm">
          Farming tips, guides, and latest insights
        </Text>
      </View>

      {/* SEARCH BAR */}
      <View className="px-6 mt-2 mb-5">
        <View className="bg-slate-900 flex-row items-center px-4 py-3.5 rounded-2xl border border-slate-800">
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            placeholder="Search farming tips..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
            className="flex-1 text-slate-100 text-base font-medium ml-3"
            selectionColor="#34d399"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} className="ml-2">
              <Ionicons name="close-circle" size={20} color="#64748b" />
            </Pressable>
          )}
        </View>
      </View>

      {/* CATEGORY FILTER */}
      <View className="mb-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 12, alignItems: "center" }}
        >
          {categories.map((item, index) => {
            const isSelected = selectedCategory === item;
            return (
              <Pressable
                key={index}
                onPress={() => setSelectedCategory(item)}
                className={`px-5 py-2.5 rounded-2xl items-center justify-center border transition-colors ${
                  isSelected
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-slate-900 border-slate-800"
                }`}
              >
                <Text
                  className={`text-sm font-semibold tracking-wide ${
                    isSelected ? "text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* BLOG LIST */}
      <ScrollView
        className="px-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#34d399" // Emerald-400
            colors={["#34d399"]}
            progressBackgroundColor="#0f172a" // Slate-900
          />
        }
      >
        {/* FEATURED BLOG */}
        {filteredBlogs.length > 0 ? (
          <Pressable
            onPress={() =>
              navigation.navigate("BlogDetails", {
                blog: filteredBlogs[0]
              })
            }
            className="bg-slate-900 rounded-3xl mb-6 overflow-hidden border border-slate-800 active:scale-[0.98] active:opacity-90 transition-all"
          >
            <Image
              source={{ uri: filteredBlogs[0].image }}
              style={{ width: "100%", height: 220 }}
              className="bg-slate-800"
            />

            <View className="p-5">
              <View className="flex-row justify-between items-center mb-3">
                <View className="bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  <Text className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    Featured • {filteredBlogs[0].category}
                  </Text>
                </View>
                <Text className="text-slate-500 text-xs font-medium">
                  {filteredBlogs[0].date}
                </Text>
              </View>

              <Text className="font-extrabold text-white text-xl mb-2 leading-7">
                {filteredBlogs[0].title}
              </Text>

              <Text className="text-slate-400 text-sm leading-6">
                {filteredBlogs[0].description}
              </Text>
            </View>
          </Pressable>
        ) : (
          /* EMPTY STATE (If search yields no results) */
          <View className="items-center justify-center mt-10">
            <Ionicons name="document-text-outline" size={60} color="#334155" />
            <Text className="text-slate-400 font-medium mt-4 text-base">
              No blogs found for "{search}"
            </Text>
          </View>
        )}

        {/* REMAINING BLOG CARDS */}
        {filteredBlogs.slice(1).map(blog => (
          <View key={blog.id} className="mb-4">
             {/* Note: Ensure your internal <BlogCard /> component is styled 
                 for dark mode to seamlessly match this screen! */}
            <BlogCard
              blog={blog}
              onPress={() =>
                navigation.navigate("BlogDetails", {
                  blog: blog
                })
              }
            />
          </View>
        ))}
        
        {/* Extra padding at bottom to account for the Bottom Tab Bar */}
        <View className="h-10" />
      </ScrollView>

    </SafeAreaView>
  );
}