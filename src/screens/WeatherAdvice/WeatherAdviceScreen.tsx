import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/userStore";
import { useNavigation } from "@react-navigation/native";
import { fetchGeminiResponse } from "../../services/gemini";

export default function WeatherAdviceScreen() {
  const navigation = useNavigation();
  const { weather, isWeatherLoading, fetchWeather } = useUserStore();
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [advice, setAdvice] = useState<string[]>([]);
  const [suggestedCrops, setSuggestedCrops] = useState<string[]>(["Wheat", "Rice", "Maize", "Cotton"]);

  useEffect(() => {
    // If arriving here directly and store is empty, fetch it
    if (!weather) {
      fetchWeather();
    }
  }, []);

  useEffect(() => {
    // Generate advice dynamically when weather state changes
    if (weather && weather.temperature !== "--") {
      generateAdvice(weather);
    } else if (weather?.condition === "Permission Denied") {
      setAdvice(["Location permission was denied. We cannot fetch local weather for your farm. Please enable it in Settings."]);
    } else if (weather) {
      setAdvice(["Unable to fetch real-time weather. Check your internet connection."]);
    }
  }, [weather]);

  const generateAdvice = async (weatherData: any) => {
    setIsAdviceLoading(true);
    const prompt = `
      As a professional agricultural expert, provide 3 short, actionable farming tips and 4 recommended crops based on the following weather:
      Temperature: ${weatherData.temperature}°C
      Condition: ${weatherData.condition}
      Wind Speed: ${weatherData.wind} km/h
      
      Return the response in this JSON format:
      {
        "tips": ["tip1", "tip2", "tip3"],
        "crops": ["crop1", "crop2", "crop3", "crop4"]
      }
    `;

    try {
      const data = await fetchGeminiResponse(prompt);
      if (data && data.tips && data.crops) {
        setAdvice(data.tips);
        setSuggestedCrops(data.crops);
      } else {
        // Fallback to basic logic if AI fails
        generateStaticAdvice(weatherData);
      }
    } catch (error) {
      generateStaticAdvice(weatherData);
    } finally {
      setIsAdviceLoading(false);
    }
  };

  const generateStaticAdvice = (weatherData: any) => {
    let tips = [];
    const temp = Number(weatherData.temperature);

    if (temp > 35) {
      tips.push("High temperature detected. Increase irrigation frequency.");
      tips.push("Avoid fertilizer spraying during afternoon.");
      tips.push("Use mulching to retain soil moisture.");
    } else if (temp >= 25 && temp <= 35) {
      tips.push("Good weather for crop growth.");
      tips.push("Suitable for maize, cotton and rice cultivation.");
      tips.push("Maintain regular irrigation schedule.");
    } else {
      tips.push("Cooler temperatures detected. Monitor soil moisture.");
      tips.push("Ensure proper drainage for winter crops.");
    }
    setAdvice(tips);
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeather(true);
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* HEADER */}
      <View className="px-6 pt-4 pb-4 border-b border-slate-900 flex-row items-center">
        <Pressable 
          onPress={() => navigation.goBack()}
          className="mr-4 p-2 bg-slate-900 rounded-full border border-slate-800 active:scale-95 transition-all"
        >
          <Ionicons name="arrow-back" size={24} color="#34d399" />
        </Pressable>
        <View>
          <Text className="text-xl font-black text-white tracking-tight">Weather <Text className="text-emerald-400">Advisory</Text></Text>
          <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Live Farm Data</Text>
        </View>
      </View>

      {isWeatherLoading && !weather ? (
        <View className="flex-1 justify-center items-center bg-slate-950">
          <ActivityIndicator size="large" color="#34d399" />
          <Text className="mt-4 text-slate-400 font-medium tracking-wide">
            Analyzing local weather...
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="pb-10"
          contentContainerStyle={{ paddingTop: 20 }}
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
          {/* WELCOME SECTION */}
          <View className="px-6 mb-8">
            <Text className="text-2xl font-extrabold text-white tracking-tight leading-8">
              Farm Weather <Text className="text-emerald-400">Insights</Text>
            </Text>
            <Text className="text-slate-400 font-medium mt-1 text-sm">
              Smart irrigation & crop advice based on your location
            </Text>
          </View>

          {/* WEATHER CARD */}
          <View className="mx-6 bg-emerald-500/10 rounded-[28px] p-6 mb-8 border border-emerald-500/20 relative overflow-hidden">
            <View className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />

            <Text className="text-emerald-400 font-bold text-xs tracking-widest uppercase mb-4">
              Current Conditions
            </Text>

            <View className="flex-row justify-between items-end">
              <View>
                <Text className="text-slate-400 text-sm font-medium mb-1">
                  {weather?.condition || "Temperature"}
                </Text>
                <View className="flex-row items-start">
                  <Text className="text-5xl font-black text-white tracking-tighter">
                    {weather?.temperature || "--"}
                  </Text>
                  <Text className="text-2xl font-bold text-emerald-400 mt-1 ml-1">
                    °C
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-slate-400 text-sm font-medium mb-1">
                  Wind Speed
                </Text>
                <View className="flex-row items-baseline">
                  <Text className="text-3xl font-bold text-white tracking-tight">
                    {weather?.wind || "--"}
                  </Text>
                  <Text className="text-sm font-bold text-slate-300 ml-1">
                    km/h
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="px-6 mb-8">
            <View className="flex-row items-center justify-between mb-4 px-1">
              <Text className="text-xl font-bold text-slate-100">
                Farming Advice
              </Text>
              {isAdviceLoading && <ActivityIndicator size="small" color="#34d399" />}
            </View>

            {advice.map((tip, index) => (
              <View
                key={index}
                className="bg-slate-900 p-5 rounded-2xl mb-3 border border-slate-800 flex-row items-start shadow-sm shadow-slate-900/50"
              >
                <View className="bg-emerald-500/10 p-2 rounded-full mr-4 mt-0.5 border border-emerald-500/20">
                  <Ionicons name="leaf" size={16} color="#34d399" />
                </View>
                <Text className="text-slate-200 text-base leading-6 font-medium flex-1">
                  {tip}
                </Text>
              </View>
            ))}
          </View>

          {/* SUGGESTED CROPS */}
          <View className="px-6 mb-12">
            <Text className="text-xl font-bold text-slate-100 mb-4 px-1">
              Suggested Crops
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {suggestedCrops.map((crop, index) => (
                <View 
                  key={index} 
                  className="bg-slate-900 px-5 py-3 rounded-xl border border-slate-800"
                >
                  <Text className="text-emerald-400 font-bold tracking-wide">
                    {crop}
                  </Text>
                </View>
              ))}
            </View>
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}