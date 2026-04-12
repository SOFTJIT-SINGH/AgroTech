import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons"; // Added for premium UI icons

export default function WeatherAdviceScreen() {
  const [weather, setWeather] = useState(null);
  const [advice, setAdvice] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

const fetchWeather = async () => {
    try {
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Add accuracy explicitly
      });
      const { latitude, longitude } = location.coords;

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`
      );

      const data = await res.json();
      const current = data.current_weather;

      const weatherData = {
        temperature: current.temperature,
        wind: current.windspeed,
        code: current.weathercode
      };

      setWeather(weatherData);
      generateAdvice(weatherData);
    } catch (err) {
      console.log("Weather error:", err);
      // Fallback data so the UI doesn't crash on null
      setWeather({ temperature: "--", wind: "--", code: 0 });
      setAdvice(["Unable to fetch real-time weather. Check your internet connection."]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setWeather({ temperature: "--", wind: "--", code: 0 });
        setAdvice(["Location permission was denied. We cannot fetch local weather for your farm. Please enable it in Settings."]);
        setLoading(false);
        return;
      }

      await fetchWeather();
    } catch (err) {
      console.log("Permission error:", err);
      setLoading(false);
    }
  };

  const generateAdvice = (weather) => {
    let tips = [];
    const temp = weather.temperature;

    if (temp > 35) {
      tips.push("High temperature detected. Increase irrigation frequency.");
      tips.push("Avoid fertilizer spraying during afternoon.");
      tips.push("Use mulching to retain soil moisture.");
    }

    if (temp >= 25 && temp <= 35) {
      tips.push("Good weather for crop growth.");
      tips.push("Suitable for maize, cotton and rice cultivation.");
      tips.push("Maintain regular irrigation schedule.");
    }

    if (temp < 20) {
      tips.push("Low temperature detected.");
      tips.push("Suitable crops: wheat, barley and mustard.");
      tips.push("Reduce irrigation to avoid water logging.");
    }

    if (weather.wind > 15) {
      tips.push("Strong wind detected. Avoid pesticide spraying.");
    }

    setAdvice(tips);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeather();

    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {loading ? (
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
          {/* HEADER */}
          <View className="px-6 pt-5 pb-6">
            <Text className="text-3xl font-extrabold text-white tracking-tight">
              Weather <Text className="text-emerald-400">Advisory</Text>
            </Text>
            <Text className="text-slate-400 font-medium mt-1 text-sm">
              Smart irrigation & crop advice based on your location
            </Text>
          </View>

          {/* WEATHER CARD */}
          <View className="mx-6 bg-emerald-500/10 rounded-[28px] p-6 mb-8 border border-emerald-500/20 relative overflow-hidden">
            {/* Subtle background glow */}
            <View className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />

            <Text className="text-emerald-400 font-bold text-xs tracking-widest uppercase mb-4">
              Current Conditions
            </Text>

            <View className="flex-row justify-between items-end">
              <View>
                <Text className="text-slate-400 text-sm font-medium mb-1">
                  Temperature
                </Text>
                <View className="flex-row items-start">
                  <Text className="text-5xl font-black text-white tracking-tighter">
                    {weather.temperature}
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
                    {weather.wind}
                  </Text>
                  <Text className="text-sm font-bold text-slate-300 ml-1">
                    km/h
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ADVICE SECTION */}
          <View className="px-6 mb-8">
            <Text className="text-xl font-bold text-slate-100 mb-4 px-1">
              Farming Advice
            </Text>

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
              {["Wheat", "Rice", "Maize", "Cotton"].map((crop, index) => (
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