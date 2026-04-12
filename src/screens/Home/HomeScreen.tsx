import { View, Text, ScrollView, Pressable, Linking, AppState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/userStore";

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { weather, isWeatherLoading, fetchWeather, name } = useUserStore();
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);

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

  // 3. Open Device Settings Button Logic
  const openSettings = () => {
    Linking.openSettings();
  };

  const features = [
    { title: "Crop Disease", icon: "https://cdn-icons-png.flaticon.com/512/2909/2909768.png", screen: "DetectCrop" },
    { title: "Weather Advice", icon: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png", screen: "WeatherAdvice" },
    { title: "Crop Suggestion", icon: "https://cdn-icons-png.flaticon.com/512/628/628324.png", screen: "CropSuggestion" },
    { title: "Sowing Time", icon: "https://cdn-icons-png.flaticon.com/512/3050/3050525.png", screen: "SowingPrediction" },
    { title: "Fertilizer Plan", icon: "https://cdn-icons-png.flaticon.com/512/2909/2909753.png", screen: "FertilizerPlan" },
    { title: "Market Prices", icon: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png", screen: "Market" },
  ];

  const marketPrices = [
    { crop: "Wheat", price: "₹2200", trend: "up" },
    { crop: "Rice", price: "₹2100", trend: "up" },
    { crop: "Maize", price: "₹1900", trend: "down" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView showsVerticalScrollIndicator={false} className="pb-12">

        {/* HEADER */}
        <View className="px-6 pt-5 pb-4 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Pressable 
              onPress={() => navigation.openDrawer()}
              className="mr-4 p-2 bg-slate-900 rounded-full border border-slate-700/80 active:scale-90 transition-all"
            >
              <Text className="text-white text-xl">☰</Text>
            </Pressable>
            <View>
              <Text className="text-slate-400 font-semibold text-sm uppercase tracking-widest mb-1">
                Welcome Back
              </Text>
              <Text className="text-3xl font-extrabold text-white tracking-tight">
                {name.split(' ')[0]}
              </Text>
            </View>
          </View>

          <Pressable 
            onPress={() => navigation.navigate("Profile")}
            className="p-1 bg-slate-900 rounded-full border border-slate-700/80 active:scale-90 transition-all"
          >
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
              style={{ width: 44, height: 44 }}
              className="rounded-full"
            />
          </Pressable>
        </View>

        {/* SETTINGS PERMISSION BANNER (Shows only if blocked) */}
        {locationGranted === false && (
          <View className="mx-6 bg-rose-500/10 rounded-[24px] p-5 mb-6 border border-rose-500/30 flex-row items-center justify-between shadow-lg shadow-rose-900/20">
            <View className="flex-1 pr-4">
              <View className="flex-row items-center mb-1">
                <Ionicons name="warning" size={16} color="#f43f5e" />
                <Text className="text-rose-400 font-bold text-xs uppercase tracking-widest ml-2">
                  Action Required
                </Text>
              </View>
              <Text className="text-slate-300 text-[13px] leading-5 font-medium">
                Please allow location access in your device settings to enable real-time farm weather tracking.
              </Text>
            </View>
            <Pressable 
              onPress={openSettings} 
              className="bg-rose-500/20 px-4 py-3 rounded-xl border border-rose-500/40 active:bg-rose-500/40 active:scale-95 transition-all"
            >
              <Text className="text-rose-400 font-bold text-[10px] uppercase tracking-wider">
                Settings
              </Text>
            </Pressable>
          </View>
        )}

        {/* HORIZONTAL MARKET TICKER */}
        <View className="mb-6 mt-2">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
          >
            {marketPrices.map((item, index) => (
              <Pressable 
                key={index}
                onPress={() => navigation.navigate("Market")}
                className="bg-slate-900 flex-row items-center px-4 py-2.5 rounded-2xl border border-slate-800 active:bg-slate-800 transition-colors"
              >
                <Text className="text-slate-300 font-medium mr-2">{item.crop}</Text>
                <Text className="text-emerald-400 font-bold">{item.price}</Text>
                <Text className="text-emerald-500/50 text-xs ml-1">/q</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* HERO WEATHER DASHBOARD (Crystal Morphism) */}
        <Pressable 
          onPress={() => navigation.navigate("WeatherAdvice")}
          className="mx-6 bg-slate-900/40 backdrop-blur-2xl rounded-[32px] p-6 mb-8 border border-white/10 relative overflow-hidden active:scale-[0.98] transition-transform shadow-2xl"
        >
          {/* Intense Glowing Orb Backgrounds for the glass effect */}
          <View className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/30 rounded-full blur-3xl" />
          <View className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />

          <View className="flex-row justify-between items-start mb-4 z-10">
            <View className="bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30 backdrop-blur-md">
              <Text className="text-emerald-400 text-[10px] font-black tracking-widest uppercase">
                Live Location
              </Text>
            </View>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/869/869869.png" }}
              style={{ width: 64, height: 64 }}
              className="opacity-90 absolute right-0 -top-2"
            />
          </View>

          <View className="mt-2 z-10">
            <Text className="text-white text-6xl font-black tracking-tighter shadow-lg shadow-slate-950">
              {locationGranted === false ? "--" : (isWeatherLoading ? "--" : weather?.temperature)}°
            </Text>
            <Text className="text-slate-200 font-medium mt-1 text-base tracking-wide shadow-sm shadow-slate-950">
              {locationGranted === false 
                ? "Location Blocked" 
                : (isWeatherLoading ? "Analyzing atmosphere..." : `${weather?.condition} • Wind: ${weather?.wind} km/h`)}
            </Text>
          </View>
        </Pressable>

        {/* AI ASSISTANT BANNER */}
        <Pressable
          onPress={() => navigation.navigate("Chatbot")}
          className="mx-6 bg-emerald-500 rounded-3xl p-5 mb-10 flex-row items-center justify-between shadow-lg shadow-emerald-500/20 active:scale-[0.98] active:bg-emerald-600 transition-all"
        >
          <View className="flex-1 pr-4">
            <Text className="text-slate-950 font-black text-xl mb-1">
              Ask AgroTech AI
            </Text>
            <Text className="text-emerald-950/70 font-bold text-xs leading-5">
              Get instant, personalized farming advice and crop analysis.
            </Text>
          </View>
          <View className="bg-slate-950 w-14 h-14 rounded-2xl items-center justify-center -rotate-3">
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png" }}
              style={{ width: 32, height: 32 }}
            />
          </View>
        </Pressable>

        {/* BENTO BOX TOOL GRID */}
        <View className="px-6 mb-10">
          <Text className="text-xl font-bold text-white mb-5 tracking-wide">
            Farming Tools
          </Text>

          <View className="flex-row flex-wrap justify-between gap-y-4">
            {features.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => navigation.navigate(item.screen)}
                className="bg-slate-900 w-[48%] py-5 px-4 rounded-3xl border border-slate-800 items-start justify-between h-36 active:scale-95 active:bg-slate-800/80 transition-all"
              >
                <View className="bg-slate-950 p-3 rounded-2xl border border-slate-800/50">
                  <Image
                    source={{ uri: item.icon }}
                    style={{ width: 28, height: 28 }}
                    className="opacity-80"
                  />
                </View>

                <View>
                  <Text className="font-bold text-slate-200 text-sm mb-1 leading-5">
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
            <Text className="text-xl font-bold text-white tracking-wide">
              Latest Insight
            </Text>
            <Pressable onPress={() => navigation.navigate("Blogs")} className="active:opacity-70">
              <Text className="text-emerald-400 font-bold text-sm mb-0.5">See All</Text>
            </Pressable>
          </View>

          <Pressable 
            onPress={() => navigation.navigate("Blogs")}
            className="bg-slate-900 rounded-[28px] overflow-hidden border border-slate-800 active:scale-[0.98] transition-transform"
          >
            <View className="h-40 bg-slate-800 relative justify-end p-5">
              <View className="absolute inset-0 bg-slate-950/40" />
              <View className="bg-emerald-500 px-3 py-1.5 rounded-lg self-start relative z-10 mb-2">
                 <Text className="text-slate-950 font-bold text-[10px] uppercase tracking-widest">Crop Tips</Text>
              </View>
              <Text className="font-extrabold text-white text-xl relative z-10 leading-7">
                Best Crops for Summer Season
              </Text>
            </View>
            <View className="p-5 bg-slate-900">
              <Text className="text-slate-400 text-sm leading-6 font-medium">
                Learn which crops provide maximum yield during the summer heat and how to protect them from heat stress.
              </Text>
            </View>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}