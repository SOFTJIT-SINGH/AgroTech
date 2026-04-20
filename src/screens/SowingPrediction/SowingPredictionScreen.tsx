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

const cropCalendar = {
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
  const [crop, setCrop] = useState(null);
  const [date, setDate] = useState(new Date());

  const [showPicker, setShowPicker] = useState(false);
  const [result, setResult] = useState(null);

  const calculatePrediction = () => {
    if (!crop) return;

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
    }

    if (date >= start && date <= end) {
      risk = "Very Low";
      message = "Perfect sowing window for this crop. Maximum yield potential.";
    }

    if (date > end) {
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
    if (riskLevel === "High") return "bg-red-500/10 border-red-500/20 text-red-400";
    if (riskLevel === "Very Low") return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    return "bg-blue-500/10 border-blue-500/20 text-blue-400"; // Low risk
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
          <Text className="text-xl font-black text-white tracking-tight">Sowing <Text className="text-emerald-400">Time</Text></Text>
          <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Sow Assistant</Text>
        </View>
      </View>

      <ScrollView 
        className="px-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        
        {/* HERO SECTION */}
        <View className="mb-8">
          <Text className="text-2xl font-extrabold text-white tracking-tight leading-8">
            Smart Sowing <Text className="text-emerald-400">Window</Text>
          </Text>
          <Text className="text-slate-400 font-medium mt-1 text-sm">
            Predict the optimal window to sow your crop
          </Text>
        </View>

        {/* CROP SELECTOR */}
        <Text className="text-slate-300 font-bold mb-3 px-1 text-sm uppercase tracking-wider mt-2">
          Select Crop
        </Text>

        <View className="flex-row flex-wrap mb-6">
          {crops.map((item) => {
            const isSelected = crop === item;
            return (
              <Pressable
                key={item}
                onPress={() => setCrop(item)}
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

        {/* DATE SELECTOR */}
        <Text className="text-slate-300 font-bold mb-3 px-1 text-sm uppercase tracking-wider">
          Plot Preparation Date
        </Text>

        <Pressable
          onPress={() => setShowPicker(true)}
          className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6 flex-row justify-between items-center active:bg-slate-800/80 transition-colors"
        >
          <Text className="text-slate-200 font-semibold text-base">
            {date.toDateString()}
          </Text>
          <Text className="text-slate-500 text-xl font-bold">
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

        {/* PREDICT BUTTON */}
        <Pressable
          onPress={calculatePrediction}
          className="bg-emerald-500 py-4 rounded-2xl mb-6 items-center shadow-lg shadow-emerald-500/20 active:scale-95 active:bg-emerald-600 transition-all"
        >
          <Text className="text-slate-950 font-extrabold text-base uppercase tracking-wider">
            Predict Sowing Time
          </Text>
        </Pressable>

        {/* RESULT CARD */}
        {result && (
          <View className="bg-slate-900 p-6 rounded-[28px] mb-12 border border-slate-800 relative overflow-hidden shadow-xl shadow-slate-950">
            
            <View className="flex-row justify-between items-start mb-5 border-b border-slate-800/80 pb-5">
              <View>
                <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
                  Recommended Window
                </Text>
                <Text className="text-white font-extrabold text-lg">
                  {result.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {result.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>

              {/* Dynamic Risk Badge */}
              <View className={`px-3 py-1.5 rounded-xl border ${getRiskColors(result.risk).split(' ').slice(0, 2).join(' ')}`}>
                <Text className={`font-bold text-xs uppercase tracking-wider ${getRiskColors(result.risk).split(' ')[2]}`}>
                  {result.risk} Risk
                </Text>
              </View>
            </View>

            <Text className="text-slate-300 text-base leading-6 font-medium mb-6">
              {result.message}
            </Text>

            {/* Farming Tips Section */}
            <View className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
              <Text className="font-bold text-emerald-400 mb-3 text-sm uppercase tracking-wider">
                Farming Tips
              </Text>

              <View className="flex-row items-start mb-2">
                <Text className="text-emerald-500 mr-2 font-bold">•</Text>
                <Text className="text-slate-400 font-medium text-sm flex-1 leading-5">
                  Ensure optimal soil moisture before sowing to promote germination.
                </Text>
              </View>

              <View className="flex-row items-start mb-2">
                <Text className="text-emerald-500 mr-2 font-bold">•</Text>
                <Text className="text-slate-400 font-medium text-sm flex-1 leading-5">
                  Use certified and treated seed varieties to prevent early diseases.
                </Text>
              </View>

              <View className="flex-row items-start">
                <Text className="text-emerald-500 mr-2 font-bold">•</Text>
                <Text className="text-slate-400 font-medium text-sm flex-1 leading-5">
                  Apply required base fertilizers uniformly during the sowing process.
                </Text>
              </View>
            </View>

          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}