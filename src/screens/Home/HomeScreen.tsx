import { View, Text, ScrollView, Pressable, Linking, AppState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/userStore";
import { getInitials } from "../../utils/stringUtils";
import { fetchGeminiResponse } from "../../services/gemini";
import { ActivityIndicator } from "react-native";

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { weather, isWeatherLoading, fetchWeather, name } = useUserStore();
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);
  const [insight, setInsight] = useState<any>({
    title: "Best Crops for Summer Season",
    category: "Crop Tips",
    description: "Learn which crops provide maximum yield during the summer heat and how to protect them from heat stress."
  });
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  // 1. Robust Permission Checker
  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status === "granted") {
      setLocationGranted(true);
      if (!weather) fetchWeather();
    } else {
      // If undetermined, try asking. If previously denied, this fails instantly.
      const { status: askStatus } = await Location.requestForegroundPermissionsAsync();
      if (askStatus === "granted") {
        setLocationGranted(true);
        fetchWeather();
      } else {
        setLocationGranted(false);
      }
    }
  };

  useEffect(() => {
    checkLocationPermission();

    // 2. Listen for when user returns from the Settings app
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState === "active") {
        checkLocationPermission();
      }
    });

    return () => subscription.remove();
  }, []);

  const fetchDailyInsight = async () => {
    setIsInsightLoading(true);
    const prompt = `
      Provide a daily farming insight for a farmer. It should be relevant and helpful.
      Return the response in this JSON format:
      {
        "title": "Short catchy title",
        "category": "e.g. Soil Health, Pest Control, Crop Tips",
        "description": "2-3 sentences of detailed advice."
      }
    `;

    try {
      const data = await fetchGeminiResponse(prompt);
      if (data && data.title) {
        setInsight(data);
      }
    } catch (error) {
      console.error("Failed to fetch insight:", error);
    } finally {
      setIsInsightLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyInsight();
  }, []);


  // 3. Open Device Settings Button Logic
  const openSettings = () => {
    Linking.openSettings();
  };

  const features = [
    { title: "Crop Disease", icon: "https://img.icons8.com/fluency/96/plant-under-sun.png", screen: "DetectCrop" },
    { title: "Weather Advice", icon: "https://img.icons8.com/fluency/96/partly-cloudy-day.png", screen: "WeatherAdvice" },
    { title: "Crop Library", icon: "https://img.icons8.com/fluency/96/book.png", screen: "CropLibrary" },
    { title: "Fertilizer Library", icon: "https://img.icons8.com/fluency/96/organic-food.png", screen: "FertilizerLibrary" },
    { title: "Crop Suggestion", icon: "https://img.icons8.com/fluency/96/idea.png", screen: "CropSuggestion" },
    { title: "Sowing Time", icon: "https://img.icons8.com/fluency/96/calendar.png", screen: "SowingPrediction" },
    { title: "Fertilizer Plan", icon: "https://img.icons8.com/fluency/96/sprout.png", screen: "FertilizerPlan" },
  ];


  return (
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      <ScrollView showsVerticalScrollIndicator={false} className="pb-12">

        {/* HEADER */}
        <View className="px-6 pt-5 pb-4 flex-row justify-between items-center bg-white/50 border-b border-agro-earth-100">
          <View className="flex-row items-center">
            <Pressable 
              onPress={() => navigation.openDrawer()}
              className="mr-4 p-2 bg-white rounded-full border border-agro-earth-200 shadow-sm active:scale-90 transition-all"
            >
              <Text className="text-agro-green-700 text-xl font-black">☰</Text>
            </Pressable>
            <View>
              <Text className="text-agro-earth-500 font-bold text-xs uppercase tracking-widest mb-1">
                Welcome
              </Text>
              <Text className="text-3xl font-extrabold text-agro-green-950 tracking-tight">
                {name.split(' ')[0]}
              </Text>
            </View>
          </View>

          <Pressable 
            onPress={() => navigation.navigate("Profile")}
            className="w-12 h-12 bg-white rounded-full border border-agro-earth-200 items-center justify-center overflow-hidden shadow-sm active:scale-90 transition-all"
          >
            {useUserStore.getState().profileImage ? (
              <Image
                source={{ uri: useUserStore.getState().profileImage! }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Text className="text-agro-green-600 font-black text-lg">
                {getInitials(name)}
              </Text>
            )}
          </Pressable>
        </View>

        {/* SETTINGS PERMISSION BANNER (Shows only if blocked) */}
        {locationGranted === false && (
          <View className="mx-6 bg-red-50 rounded-[24px] p-5 mb-6 border border-red-100 flex-row items-center justify-between shadow-sm">
            <View className="flex-1 pr-4">
              <View className="flex-row items-center mb-1">
                <Ionicons name="warning" size={16} color="#dc2626" />
                <Text className="text-red-600 font-bold text-xs uppercase tracking-widest ml-2">
                  Action Required
                </Text>
              </View>
              <Text className="text-agro-earth-700 text-[13px] leading-5 font-bold">
                Please allow location access in your device settings to enable real-time farm weather tracking.
              </Text>
            </View>
            <Pressable 
              onPress={openSettings} 
              className="bg-red-600 px-4 py-3 rounded-xl active:bg-red-700 active:scale-95 transition-all"
            >
              <Text className="text-white font-black text-[10px] uppercase tracking-wider">
                Settings
              </Text>
            </Pressable>
          </View>
        )}


        {/* HERO WEATHER DASHBOARD (Crystal Morphism) */}
        <Pressable 
          onPress={() => navigation.navigate("WeatherAdvice")}
          className="mx-6 bg-white rounded-[32px] p-6 mb-8 border border-agro-earth-100 relative overflow-hidden active:scale-[0.98] transition-transform shadow-xl shadow-agro-green-950/5"
        >
          {/* Intense Glowing Orb Backgrounds for the natural field effect */}
          <View className="absolute -top-16 -right-16 w-48 h-48 bg-agro-green-200/40 rounded-full blur-3xl" />
          <View className="absolute -bottom-10 -left-10 w-32 h-32 bg-agro-accent-100/40 rounded-full blur-3xl" />

          <View className="flex-row justify-between items-start mb-4 z-10">
            <View className="bg-agro-green-100 px-3 py-1.5 rounded-xl border border-agro-green-200">
              <Text className="text-agro-green-800 text-[10px] font-black tracking-widest uppercase">
                Farm Weather
              </Text>
            </View>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/869/869869.png" }}
              style={{ width: 64, height: 64 }}
              className="opacity-90 absolute right-0 -top-2"
            />
          </View>

          <View className="mt-2 z-10">
            <Text className="text-agro-green-950 text-6xl font-black tracking-tighter">
              {locationGranted === false ? "--" : (isWeatherLoading ? "--" : weather?.temperature)}°
            </Text>
            <Text className="text-agro-earth-600 font-bold mt-1 text-base tracking-wide">
              {locationGranted === false 
                ? "Location Blocked" 
                : (isWeatherLoading ? "Analyzing atmosphere..." : `${weather?.condition} • Wind: ${weather?.wind} km/h`)}
            </Text>
          </View>
        </Pressable>

        {/* AI ASSISTANT BANNER */}
        <Pressable
          onPress={() => navigation.navigate("Chatbot")}
          className="mx-6 bg-agro-green-600 rounded-3xl p-5 mb-10 flex-row items-center justify-between shadow-lg shadow-agro-green-700/20 active:scale-[0.98] active:bg-agro-green-700 transition-all"
        >
          <View className="flex-1 pr-4">
            <Text className="text-white font-black text-xl mb-1">
              Ask AgroTech AI
            </Text>
            <Text className="text-agro-green-50/80 font-bold text-xs leading-5">
              Get instant, personalized farming advice and crop analysis.
            </Text>
          </View>
          <View className="bg-white/20 w-14 h-14 rounded-2xl items-center justify-center -rotate-3 border border-white/30">
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png" }}
              style={{ width: 32, height: 32 }}
              className="tint-white"
            />
          </View>
        </Pressable>

        {/* BENTO BOX TOOL GRID */}
        <View className="px-6 mb-10">
          <Text className="text-xl font-bold text-agro-green-950 mb-5 tracking-wide">
            Farming Tools
          </Text>

          <View className="flex-row flex-wrap justify-between gap-y-4">
            {features.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => navigation.navigate(item.screen)}
                className="bg-white w-[48%] py-5 px-4 rounded-3xl border border-agro-earth-100 items-start justify-between h-36 active:scale-95 active:bg-agro-green-50 transition-all shadow-sm shadow-agro-green-950/5"
              >
                <View className="bg-agro-earth-50 p-3 rounded-2xl border border-agro-earth-100">
                  <Image
                    source={{ uri: item.icon }}
                    style={{ width: 28, height: 28 }}
                    className="opacity-90"
                  />
                </View>

                <View>
                  <Text className="font-bold text-agro-green-950 text-sm mb-1 leading-5">
                    {item.title.split(' ')[0]}
                    {"\n"}
                    {item.title.split(' ').slice(1).join(' ')}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* FEATURED INSIGHT */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-xl font-bold text-agro-green-950 tracking-wide">
              Latest Insight
            </Text>
            <Pressable onPress={() => navigation.navigate("Blogs")} className="active:opacity-70">
              <Text className="text-agro-green-600 font-bold text-sm mb-0.5">See All</Text>
            </Pressable>
          </View>

          <Pressable 
            onPress={() => navigation.navigate("Blogs")}
            disabled={isInsightLoading}
            className="bg-white rounded-[28px] overflow-hidden border border-agro-earth-100 active:scale-[0.98] transition-transform shadow-lg shadow-agro-green-950/5"
          >
            <View className="h-40 bg-agro-green-900 relative justify-end p-5">
              <View className="absolute inset-0 bg-black/20" />
              <View className="bg-agro-accent-500 px-3 py-1.5 rounded-lg self-start relative z-10 mb-2">
                 <Text className="text-agro-accent-950 font-black text-[10px] uppercase tracking-widest">{insight.category}</Text>
              </View>
              {isInsightLoading ? (
                <ActivityIndicator color="#ffffff" className="mb-4" />
              ) : (
                <Text className="font-extrabold text-white text-xl relative z-10 leading-7">
                  {insight.title}
                </Text>
              )}
            </View>
            <View className="p-5 bg-white">
              <Text className="text-agro-earth-700 text-sm leading-6 font-bold">
                {insight.description}
              </Text>
            </View>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}