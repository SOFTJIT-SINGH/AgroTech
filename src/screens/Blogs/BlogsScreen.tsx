import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../services/supabase";

interface Blog {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string;
  author_name: string;
  author_id: string;
  created_at: string;
}

export default function BlogsScreen({ navigation }: any) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Crop Tips", "Fertilizer", "Irrigation", "Market", "Weather", "Technology", "General"];

  const fetchBlogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log("Blogs fetch error:", error);
      } else {
        setBlogs(data || []);
      }
    } catch (err) {
      console.log("Blogs fetch exception:", err);
    }
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      await fetchBlogs();
      setLoading(false);
    };
    loadBlogs();
  }, []);

  // Re-fetch when navigating back from CreateBlog
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBlogs();
    });
    return unsubscribe;
  }, [navigation, fetchBlogs]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBlogs();
    setRefreshing(false);
  };

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchCategory = selectedCategory === "All" || blog.category === selectedCategory;
    const matchSearch = blog.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#34d399" />
        <Text className="text-slate-400 mt-4 font-medium">Loading blogs...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      
      {/* HEADER */}
      <View className="px-6 pt-5 pb-4 flex-row justify-between items-start">
        <View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">
            Agriculture <Text className="text-emerald-400">Blogs</Text>
          </Text>
          <Text className="text-slate-400 font-medium mt-1 text-sm">
            Farming tips, guides & community insights
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate("CreateBlog")}
          className="bg-emerald-500 p-3 rounded-2xl active:scale-95 active:bg-emerald-600 shadow-lg shadow-emerald-500/30"
        >
          <Ionicons name="add" size={22} color="#020617" />
        </Pressable>
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
            tintColor="#34d399"
            colors={["#34d399"]}
            progressBackgroundColor="#0f172a"
          />
        }
      >
        {filteredBlogs.length === 0 ? (
          /* EMPTY STATE */
          <View className="items-center justify-center mt-12 p-8">
            <View className="bg-slate-900 w-20 h-20 rounded-full items-center justify-center mb-5 border border-slate-800">
              <Ionicons name="document-text-outline" size={36} color="#64748b" />
            </View>
            <Text className="text-slate-300 font-bold text-lg mb-2 text-center">
              {search ? `No blogs found for "${search}"` : "No blogs yet"}
            </Text>
            <Text className="text-slate-500 text-sm text-center leading-6 px-4">
              {search ? "Try a different search term." : "Be the first to share your farming knowledge!"}
            </Text>
            {!search && (
              <Pressable
                onPress={() => navigation.navigate("CreateBlog")}
                className="mt-6 bg-emerald-500/15 px-6 py-3 rounded-2xl border border-emerald-500/30 active:scale-95"
              >
                <Text className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Write a Blog</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <>
            {/* FEATURED BLOG (first item) */}
            <Pressable
              onPress={() => navigation.navigate("BlogDetails", { blog: filteredBlogs[0] })}
              className="bg-slate-900 rounded-3xl mb-6 overflow-hidden border border-slate-800 active:scale-[0.98] active:opacity-90 transition-all"
            >
              <Image
                source={{ uri: filteredBlogs[0].image_url }}
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
                    {formatDate(filteredBlogs[0].created_at)}
                  </Text>
                </View>
                <Text className="font-extrabold text-white text-xl mb-2 leading-7">
                  {filteredBlogs[0].title}
                </Text>
                <Text className="text-slate-400 text-sm leading-6" numberOfLines={2}>
                  {filteredBlogs[0].content}
                </Text>
                <View className="flex-row items-center mt-3">
                  <Ionicons name="person-circle-outline" size={16} color="#64748b" />
                  <Text className="text-slate-500 text-xs font-medium ml-1.5">{filteredBlogs[0].author_name}</Text>
                </View>
              </View>
            </Pressable>

            {/* REMAINING BLOG CARDS */}
            {filteredBlogs.slice(1).map(blog => (
              <Pressable
                key={blog.id}
                onPress={() => navigation.navigate("BlogDetails", { blog })}
                className="bg-slate-900 rounded-2xl mb-4 overflow-hidden border border-slate-800 flex-row active:scale-[0.98] active:opacity-90 transition-all"
              >
                <Image
                  source={{ uri: blog.image_url }}
                  style={{ width: 110, height: 130 }}
                  className="bg-slate-800"
                />
                <View className="flex-1 p-4 justify-between">
                  <View>
                    <View className="flex-row items-center justify-between mb-1.5">
                      <Text className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">{blog.category}</Text>
                      <Text className="text-slate-600 text-[10px] font-medium">{formatDate(blog.created_at)}</Text>
                    </View>
                    <Text className="font-bold text-white text-[15px] leading-[22px] mb-1.5" numberOfLines={2}>
                      {blog.title}
                    </Text>
                    <Text className="text-slate-500 text-xs leading-5" numberOfLines={2}>
                      {blog.content}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="person-circle-outline" size={14} color="#475569" />
                    <Text className="text-slate-600 text-[10px] font-medium ml-1">{blog.author_name}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </>
        )}
        
        {/* Bottom spacing */}
        <View className="h-10" />
      </ScrollView>

    </SafeAreaView>
  );
}