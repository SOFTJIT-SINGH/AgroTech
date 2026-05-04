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
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      {/* HEADER */}
      <View className="px-6 pt-4 pb-4 border-b border-agro-earth-100 flex-row items-center bg-white/50">
        <Pressable 
          onPress={() => navigation.goBack()}
          className="mr-4 p-2 bg-white rounded-full border border-agro-earth-200 shadow-sm active:scale-95 transition-all"
        >
          <Ionicons name="arrow-back" size={24} color="#3e8e3e" />
        </Pressable>
        <View>
          <Text className="text-xl font-black text-agro-green-950 tracking-tight">Weather <Text className="text-agro-green-600">Advisory</Text></Text>
          <Text className="text-agro-earth-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Live Farm Data</Text>
        </View>
      </View>

      {isWeatherLoading && !weather ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3e8e3e" />
          <Text className="mt-4 text-agro-green-800 font-bold tracking-wide">
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
              tintColor="#3e8e3e"
              colors={["#3e8e3e"]}
              progressBackgroundColor="#ffffff"
            />
          }
        >
          {/* WELCOME SECTION */}
          <View className="px-6 mb-8">
            <Text className="text-2xl font-extrabold text-agro-green-950 tracking-tight leading-8">
              Farm Weather <Text className="text-agro-green-600">Insights</Text>
            </Text>
            <Text className="text-agro-earth-600 font-bold mt-1 text-sm">
              Smart irrigation & crop advice based on your location
            </Text>
          </View>

          {/* WEATHER CARD */}
          <View className="mx-6 bg-agro-green-600 rounded-[28px] p-6 mb-8 border border-agro-green-500 relative overflow-hidden shadow-xl shadow-agro-green-950/20">
            <View className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />

            <Text className="text-agro-green-100 font-black text-xs tracking-widest uppercase mb-4">
              Current Conditions
            </Text>

            <View className="flex-row justify-between items-end">
              <View>
                <Text className="text-agro-green-50 text-sm font-bold mb-1">
                  {weather?.condition || "Temperature"}
                </Text>
                <View className="flex-row items-start">
                  <Text className="text-5xl font-black text-white tracking-tighter">
                    {weather?.temperature || "--"}
                  </Text>
                  <Text className="text-2xl font-black text-agro-accent-400 mt-1 ml-1">
                    °C
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-agro-green-50 text-sm font-bold mb-1">
                  Wind Speed
                </Text>
                <View className="flex-row items-baseline">
                  <Text className="text-3xl font-black text-white tracking-tight">
                    {weather?.wind || "--"}
                  </Text>
                  <Text className="text-sm font-black text-agro-accent-400 ml-1">
                    km/h
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="px-6 mb-8">
            <View className="flex-row items-center justify-between mb-4 px-1">
              <Text className="text-xl font-bold text-agro-green-950">
                Farming Advice
              </Text>
              {isAdviceLoading && <ActivityIndicator size="small" color="#3e8e3e" />}
            </View>

            {advice.map((tip, index) => (
              <View
                key={index}
                className="bg-white p-5 rounded-2xl mb-3 border border-agro-earth-100 flex-row items-start shadow-sm shadow-agro-green-950/5"
              >
                <View className="bg-agro-green-100 p-2 rounded-full mr-4 mt-0.5 border border-agro-green-200">
                  <Ionicons name="leaf" size={16} color="#3e8e3e" />
                </View>
                <Text className="text-agro-green-950 text-base leading-6 font-bold flex-1">
                  {tip}
                </Text>
              </View>
            ))}
          </View>

          {/* SUGGESTED CROPS */}
          <View className="px-6 mb-12">
            <Text className="text-xl font-bold text-agro-green-950 mb-4 px-1">
              Suggested Crops
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {suggestedCrops.map((crop, index) => (
                <View 
                  key={index} 
                  className="bg-white px-5 py-3 rounded-xl border border-agro-earth-100 shadow-sm shadow-agro-green-950/5"
                >
                  <Text className="text-agro-green-700 font-black tracking-wide">
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