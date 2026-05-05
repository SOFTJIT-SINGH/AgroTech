import {
  View,
  Text,
  ScrollView,
  Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchGeminiResponse } from "../../services/gemini";
import { ActivityIndicator } from "react-native";

const crops = [
  "Wheat",
  "Rice",
  "Maize",
  "Cotton",
  "Sugarcane",
  "Mustard",
  "Potato",
  "Tomato",
  "Barley",
  "Soybean"
];

const cropCalendar: any = {
  Wheat: { start: "11-01", end: "11-30" },
  Rice: { start: "06-01", end: "07-15" },
  Maize: { start: "06-01", end: "06-30" },
  Cotton: { start: "04-01", end: "05-15" },
  Sugarcane: { start: "02-01", end: "03-31" },
  Mustard: { start: "10-01", end: "10-31" },
  Potato: { start: "10-01", end: "10-20" },
  Tomato: { start: "07-01", end: "08-15" },
  Barley: { start: "11-01", end: "11-20" },
  Soybean: { start: "06-10", end: "07-10" }
};

export default function SowingPredictionScreen() {
  const navigation = useNavigation();
  const [crop, setCrop] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tips, setTips] = useState<string[]>([
    "Ensure optimal soil moisture before sowing to promote germination.",
    "Use certified and treated seed varieties to prevent early diseases.",
    "Apply required base fertilizers uniformly during the sowing process."
  ]);

  const calculatePrediction = async () => {
    if (!crop) {
      alert("Please select a crop first.");
      return;
    }

    setIsLoading(true);
    const prompt = `
      As an agricultural expert, predict the optimal sowing window and risk level for the following crop and planned date:
      Crop: ${crop}
      Planned Preparation Date: ${date.toDateString()}
      
      Return the response in this JSON format:
      {
        "risk": "High" | "Medium" | "Low" | "Very Low",
        "message": "Explanation of the risk and timing.",
        "recommended_start": "YYYY-MM-DD",
        "recommended_end": "YYYY-MM-DD",
        "tips": ["tip1", "tip2", "tip3"]
      }
    `;

    try {
      const data = await fetchGeminiResponse(prompt);
      if (data && data.risk) {
        setResult({
          crop,
          start: new Date(data.recommended_start),
          end: new Date(data.recommended_end),
          risk: data.risk,
          message: data.message
        });
        if (data.tips) setTips(data.tips);
      } else {
        calculateStaticPrediction();
      }
    } catch (error) {
      calculateStaticPrediction();
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStaticPrediction = () => {
    if (!crop || !cropCalendar[crop]) return;

    const calendar = cropCalendar[crop];
    const today = new Date();
    const year = today.getFullYear();

    const start = new Date(`${year}-${calendar.start}`);
    const end = new Date(`${year}-${calendar.end}`);

    let risk = "Low";
    let message = "";

    if (date < start) {
      risk = "Low";
      message = "Good time for sowing preparation. You are ahead of schedule.";
    } else if (date >= start && date <= end) {
      risk = "Very Low";
      message = "Perfect sowing window for this crop. Maximum yield potential.";
    } else {
      risk = "High";
      message = "Late sowing detected. This may significantly reduce your yield.";
    }

    setResult({
      crop,
      start,
      end,
      risk,
      message
    });
  };



  // Helper to dynamically color the risk badge
  const getRiskColors = (riskLevel) => {
    if (riskLevel === "High") return "bg-red-50 border-red-100 text-red-600";
    if (riskLevel === "Very Low") return "bg-agro-green-50 border-agro-green-100 text-agro-green-700";
    return "bg-blue-50 border-blue-100 text-blue-600"; // Low risk
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
          <Text className="text-xl font-black text-agro-green-950 tracking-tight">Sowing <Text className="text-agro-green-600">Time</Text></Text>
          <Text className="text-agro-earth-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Sow Assistant</Text>
        </View>
      </View>

      <ScrollView 
        className="px-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        
        {/* HERO SECTION */}
        <View className="mb-8">
          <Text className="text-2xl font-extrabold text-agro-green-950 tracking-tight leading-8">
            Smart Sowing <Text className="text-agro-green-600">Window</Text>
          </Text>
          <Text className="text-agro-earth-600 font-bold mt-1 text-sm">
            Predict the optimal window to sow your crop
          </Text>
        </View>

        {/* CROP SELECTOR */}
        <Text className="text-agro-earth-500 font-bold mb-3 px-1 text-sm uppercase tracking-wider mt-2">
          Select Crop
        </Text>

        <View className="flex-row flex-wrap mb-6">
          {crops.map((item) => {
            const isSelected = crop === item;
            return (
              <Pressable
                key={item}
                onPress={() => setCrop(item)}
                className={`px-5 py-3 mr-3 mb-3 rounded-2xl border transition-colors shadow-sm ${
                  isSelected
                    ? "bg-agro-green-600 border-agro-green-500"
                    : "bg-white border-agro-earth-100 active:bg-agro-earth-50"
                }`}
              >
                <Text
                  className={`text-sm font-bold tracking-wide ${
                    isSelected ? "text-white" : "text-agro-earth-600"
                  }`}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* DATE SELECTOR */}
        <Text className="text-agro-earth-500 font-bold mb-3 px-1 text-sm uppercase tracking-wider">
          Plot Preparation Date
        </Text>

        <Pressable
          onPress={() => setShowPicker(true)}
          className="bg-white p-4 rounded-2xl border border-agro-earth-100 mb-6 flex-row justify-between items-center shadow-sm active:bg-agro-earth-50 transition-colors"
        >
          <Text className="text-agro-green-950 font-bold text-base">
            {date.toDateString()}
          </Text>
          <Text className="text-agro-earth-500 text-xl font-bold">
            🗓️
          </Text>
        </Pressable>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selected) => {
              setShowPicker(false);
              if (selected) setDate(selected);
            }}
          />
        )}

        <Pressable
          onPress={calculatePrediction}
          disabled={isLoading}
          className={`py-4 rounded-2xl mb-6 items-center shadow-lg transition-all ${
            isLoading ? "bg-agro-green-800" : "bg-agro-green-600 shadow-agro-green-600/20 active:scale-95 active:bg-agro-green-700"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-black text-base uppercase tracking-wider">
              Predict Sowing Time
            </Text>
          )}
        </Pressable>

        {/* RESULT CARD / LOADING STATE */}
        {isLoading ? (
          <View className="bg-white p-8 rounded-[28px] mb-12 border border-agro-earth-100 items-center justify-center shadow-lg shadow-agro-green-950/5">
            <ActivityIndicator size="large" color="#3e8e3e" />
            <Text className="text-agro-green-700 font-black mt-4 tracking-widest uppercase text-[10px]">
              AI Calculating Sowing Window...
            </Text>
          </View>
        ) : result && (
          <View className="bg-white p-6 rounded-[28px] mb-12 border border-agro-earth-100 relative overflow-hidden shadow-xl shadow-agro-green-950/5">
            
            <View className="flex-row justify-between items-start mb-5 border-b border-agro-earth-50 pb-5">
              <View>
                <Text className="text-agro-earth-500 font-bold text-xs uppercase tracking-widest mb-1">
                  Recommended Window
                </Text>
                <Text className="text-agro-green-950 font-black text-lg">
                  {result.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {result.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>

              {/* Dynamic Risk Badge */}
              <View className={`px-3 py-1.5 rounded-xl border ${getRiskColors(result.risk).replace('emerald', 'agro-green').replace('red', 'red').replace('blue', 'blue').split(' ').slice(0, 2).join(' ')}`}>
                <Text className={`font-black text-xs uppercase tracking-wider ${getRiskColors(result.risk).replace('emerald', 'agro-green').replace('red', 'red').replace('blue', 'blue').split(' ')[2]}`}>
                  {result.risk} Risk
                </Text>
              </View>
            </View>

            <Text className="text-agro-earth-700 text-base leading-6 font-bold mb-6">
              {result.message}
            </Text>

            {/* Farming Tips Section */}
            <View className="bg-agro-green-50 p-4 rounded-2xl border border-agro-green-100">
              <Text className="font-black text-agro-green-800 mb-3 text-sm uppercase tracking-wider">
                Farming Tips
              </Text>

              {tips.map((tip, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-agro-green-600 mr-2 font-black">•</Text>
                  <Text className="text-agro-green-900 font-bold text-sm flex-1 leading-5">
                    {tip}
                  </Text>
                </View>
              ))}
            </View>

          </View>
        )}


      </ScrollView>
    </SafeAreaView>
  );
}
