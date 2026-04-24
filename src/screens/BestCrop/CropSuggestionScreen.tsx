import {
  View,
  Text,
  ScrollView,
  Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchGeminiResponse } from "../../services/gemini";
import { ActivityIndicator } from "react-native";

const options = {
  soil: ["Loamy", "Clay", "Sandy", "Black"],
  season: ["Winter", "Summer", "Monsoon"],
  rainfall: ["Low", "Medium", "High"],
  temp: ["Cold", "Moderate", "Hot"],
  water: ["Low", "Medium", "High"],
  farm: ["Small", "Medium", "Large"],
  ph: ["Acidic", "Neutral", "Alkaline"],
  irrigation: ["Drip", "Sprinkler", "Canal", "Rainfed"],
  demand: ["Low", "Medium", "High"],
  fertilizer: ["Organic", "Chemical", "Both"],
  experience: ["Beginner", "Intermediate", "Expert"],
  duration: ["Short", "Medium", "Long"]
};

export default function CropSuggestionScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const calculateBestCrop = async () => {
    if (Object.keys(form).length < 3) {
      alert("Please select at least 3 conditions for a better recommendation.");
      return;
    }

    setIsLoading(true);
    const prompt = `
      As an agricultural expert, analyze these farm conditions and recommend the single best crop to grow.
      Conditions:
      ${Object.entries(form).map(([key, value]) => `${key}: ${value}`).join("\n")}
      
      Return the response in this JSON format:
      {
        "crop": "Crop Name",
        "reason": "Short explanation of why this crop is best for these conditions."
      }
    `;

    try {
      const data = await fetchGeminiResponse(prompt);
      if (data && data.crop) {
        setResult({
          crop: data.crop,
          reason: data.reason
        });
      } else {
        calculateStaticBestCrop();
      }
    } catch (error) {
      calculateStaticBestCrop();
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStaticBestCrop = () => {
    let scores: any = {
      Wheat: 0, Rice: 0, Maize: 0, Cotton: 0, Sugarcane: 0,
      Mustard: 0, Potato: 0, Tomato: 0, Barley: 0, Soybean: 0
    };

    if (form.soil === "Loamy") { scores.Wheat += 2; scores.Maize += 2; scores.Potato += 2; }
    if (form.soil === "Black") { scores.Cotton += 3; scores.Soybean += 2; }
    if (form.season === "Winter") { scores.Wheat += 3; scores.Mustard += 2; scores.Barley += 2; }
    if (form.season === "Monsoon") { scores.Rice += 3; scores.Soybean += 2; }
    if (form.water === "High") { scores.Rice += 3; scores.Sugarcane += 2; }
    if (form.rainfall === "Low") { scores.Mustard += 2; scores.Barley += 2; }
    if (form.temp === "Hot") { scores.Cotton += 2; scores.Maize += 2; }
    if (form.demand === "High") { scores.Tomato += 2; scores.Potato += 2; }

    const best = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    setResult({
      crop: best,
      reason: `Based on current conditions, ${best} is traditionally the most reliable crop for your soil and season.`
    });
  };



  const Selector = ({ title, field }) => (
    <View className="mb-7">
      <Text className="text-slate-300 font-bold mb-3 px-1 text-sm uppercase tracking-wider">
        {title}
      </Text>

      <View className="flex-row flex-wrap">
        {options[field].map((item) => {
          const isSelected = form[field] === item;
          
          return (
            <Pressable
              key={item}
              onPress={() => updateField(field, item)}
              className={`px-5 py-3 mr-3 mb-3 rounded-2xl border transition-colors ${
                isSelected
                  ? "bg-emerald-500/15 border-emerald-500/50 shadow-sm shadow-emerald-500/10"
                  : "bg-slate-900 border-slate-800 active:bg-slate-800/80"
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
      </View>
    </View>
  );

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
          <Text className="text-xl font-black text-white tracking-tight">Best <Text className="text-emerald-400">Crop</Text></Text>
          <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">AI Suggestion</Text>
        </View>
      </View>

      <ScrollView 
        className="px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        <View className="mb-8">
          <Text className="text-2xl font-extrabold text-white tracking-tight leading-8">
            Smart Crop <Text className="text-emerald-400">Finder</Text>
          </Text>
          <Text className="text-slate-400 font-medium mt-1 text-sm">
            Select your farm conditions below and our AI will recommend the most profitable crop.
          </Text>
        </View>

        {/* SELECTORS */}
        <Selector title="Soil Type" field="soil" />
        <Selector title="Season" field="season" />
        <Selector title="Temperature" field="temp" />
        <Selector title="Rainfall Level" field="rainfall" />
        <Selector title="Water Availability" field="water" />
        <Selector title="Farm Size" field="farm" />
        <Selector title="Soil pH" field="ph" />
        <Selector title="Irrigation Type" field="irrigation" />
        <Selector title="Market Demand" field="demand" />
        <Selector title="Fertilizer Type" field="fertilizer" />
        <Selector title="Experience Level" field="experience" />
        <Selector title="Crop Duration" field="duration" />

        <Pressable
          onPress={calculateBestCrop}
          disabled={isLoading}
          className={`py-4 rounded-2xl mt-4 mb-6 items-center shadow-lg transition-all ${
            isLoading ? "bg-emerald-800" : "bg-emerald-500 shadow-emerald-500/20 active:scale-95 active:bg-emerald-600"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-slate-950 font-extrabold text-base uppercase tracking-wider">
              Analyze Conditions
            </Text>
          )}
        </Pressable>

        {/* RESULT CARD / LOADING STATE */}
        {isLoading ? (
          <View className="bg-slate-900 p-8 rounded-[28px] mt-2 mb-12 border border-slate-800 items-center justify-center shadow-xl shadow-slate-950">
            <ActivityIndicator size="large" color="#34d399" />
            <Text className="text-emerald-400 font-bold mt-4 tracking-widest uppercase text-[10px]">
              AI Analyzing Farm Profile...
            </Text>
          </View>
        ) : result && (
          <View className="bg-slate-900 p-6 rounded-[28px] mt-2 mb-12 border border-emerald-500/30 relative overflow-hidden shadow-xl shadow-slate-950">
            {/* Subtle background glow effect */}
            <View className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
            
            <View className="flex-row items-center mb-3">
              <View className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-sm shadow-emerald-400" />
              <Text className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
                Top Recommendation
              </Text>
            </View>

            <Text className="text-white text-5xl font-black tracking-tighter mb-3">
              {result.crop}
            </Text>

            <Text className="text-slate-400 leading-6 text-sm font-medium">
              {result.reason || `Based on your specific farm profile, ${result.crop} is the most suitable crop choice, offering the highest yield potential for your environment.`}
            </Text>
          </View>
        )}


      </ScrollView>
    </SafeAreaView>
  );
}