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
  "Tomato"
];

const soils = [
  "Loamy",
  "Clay",
  "Sandy",
  "Black"
];

const farmSizes = [
  "1 Acre",
  "2 Acres",
  "5 Acres",
  "10+ Acres"
];

const fertilizerGuide = {
  Wheat: { N: 120, P: 60, K: 40 },
  Rice: { N: 150, P: 70, K: 60 },
  Maize: { N: 120, P: 60, K: 50 },
  Cotton: { N: 150, P: 60, K: 60 },
  Sugarcane: { N: 250, P: 100, K: 100 },
  Mustard: { N: 80, P: 40, K: 30 },
  Potato: { N: 180, P: 80, K: 100 },
  Tomato: { N: 120, P: 60, K: 60 }
};

export default function FertilizerScreen() {
  const navigation = useNavigation();
  const [crop, setCrop] = useState(null);
  const [soil, setSoil] = useState(null);
  const [farm, setFarm] = useState(null);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [plan, setPlan] = useState(null);

  const generatePlan = () => {
    if (!crop || !soil || !farm) return;

    const guide = fertilizerGuide[crop];

    const baseDose = {
      nitrogen: guide.N,
      phosphorus: guide.P,
      potassium: guide.K
    };

    const stages = [
      {
        stage: "Basal Application",
        day: 0,
        tip: "Apply full phosphorus and potassium during soil preparation."
      },
      {
        stage: "Early Growth",
        day: 20,
        tip: "Apply 50% nitrogen to promote early plant growth."
      },
      {
        stage: "Vegetative Stage",
        day: 40,
        tip: "Apply remaining nitrogen for leaf and stem development."
      }
    ];

    if (soil === "Sandy") {
      stages.push({
        stage: "Additional Feeding",
        day: 60,
        tip: "Sandy soil loses nutrients quickly. Apply light nitrogen dose."
      });
    }

    setPlan({
      baseDose,
      stages
    });
  };

  const Selector = ({ title, data, value, setValue }) => (
    <View className="mb-7">
      <Text className="text-slate-300 font-bold mb-3 px-1 text-sm uppercase tracking-wider">
        {title}
      </Text>

      <View className="flex-row flex-wrap">
        {data.map((item) => {
          const isSelected = value === item;
          return (
            <Pressable
              key={item}
              onPress={() => setValue(item)}
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
          <Text className="text-xl font-black text-white tracking-tight">Fertilizer <Text className="text-emerald-400">Plan</Text></Text>
          <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Nutrient Guide</Text>
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
            Soil Nutrient <Text className="text-emerald-400">Scheduler</Text>
          </Text>
          <Text className="text-slate-400 font-medium mt-1 text-sm">
            Generate an optimal nutrient schedule for your crop
          </Text>
        </View>

        {/* SELECTORS */}
        <Selector title="Select Crop" data={crops} value={crop} setValue={setCrop} />
        <Selector title="Soil Type" data={soils} value={soil} setValue={setSoil} />
        <Selector title="Farm Size" data={farmSizes} value={farm} setValue={setFarm} />

        {/* DATE SELECTOR */}
        <Text className="text-slate-300 font-bold mb-3 px-1 text-sm uppercase tracking-wider">
          Sowing Date
        </Text>

        <Pressable
          onPress={() => setShowPicker(true)}
          className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6 flex-row justify-between items-center active:bg-slate-800/80 transition-colors"
        >
          <Text className="text-slate-200 font-semibold text-base">
            {date.toDateString()}
          </Text>
          <Text className="text-slate-500 text-xl font-bold">🗓️</Text>
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

        {/* GENERATE BUTTON */}
        <Pressable
          onPress={generatePlan}
          className={`py-4 rounded-2xl items-center mb-6 shadow-lg transition-all ${
            crop && soil && farm
              ? "bg-emerald-500 shadow-emerald-500/20 active:scale-95 active:bg-emerald-600"
              : "bg-slate-800 opacity-50"
          }`}
          disabled={!crop || !soil || !farm}
        >
          <Text className={`font-extrabold text-base uppercase tracking-wider ${crop && soil && farm ? "text-slate-950" : "text-slate-500"}`}>
            Generate Plan
          </Text>
        </Pressable>

        {/* RESULT CARD */}
        {plan && (
          <View className="bg-slate-900 p-6 rounded-[28px] mb-12 border border-slate-800 relative shadow-xl shadow-slate-950">
            
            <Text className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-4">
              Recommended NPK Profile
            </Text>

            {/* NPK Dashboard Layout */}
            <View className="flex-row justify-between mb-8">
              
              <View className="bg-slate-950 rounded-2xl p-4 flex-1 mr-2 border border-slate-800 items-center justify-center">
                <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Nitrogen (N)</Text>
                <Text className="text-white font-black text-2xl">{plan.baseDose.nitrogen}</Text>
                <Text className="text-slate-500 font-medium text-xs mt-1">kg/ha</Text>
              </View>

              <View className="bg-slate-950 rounded-2xl p-4 flex-1 mr-2 border border-slate-800 items-center justify-center">
                <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Phosphorus (P)</Text>
                <Text className="text-white font-black text-2xl">{plan.baseDose.phosphorus}</Text>
                <Text className="text-slate-500 font-medium text-xs mt-1">kg/ha</Text>
              </View>

              <View className="bg-slate-950 rounded-2xl p-4 flex-1 border border-slate-800 items-center justify-center">
                <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Potassium (K)</Text>
                <Text className="text-white font-black text-2xl">{plan.baseDose.potassium}</Text>
                <Text className="text-slate-500 font-medium text-xs mt-1">kg/ha</Text>
              </View>

            </View>

            <View className="h-[1px] w-full bg-slate-800/80 mb-6" />

            <Text className="text-slate-100 font-bold text-lg mb-4">
              Application Schedule
            </Text>

            {/* Timeline view */}
            {plan.stages.map((stage, index) => {
              // Calculate the exact target date for UI improvement
              const targetDate = new Date(date);
              targetDate.setDate(targetDate.getDate() + stage.day);

              return (
                <View key={index} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/60 mb-3">
                  
                  <View className="flex-row justify-between items-center mb-3 border-b border-slate-800/50 pb-3">
                    <Text className="font-extrabold text-slate-200 text-base">
                      {stage.stage}
                    </Text>
                    
                    <View className="bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <Text className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        Day {stage.day}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-slate-400 text-sm leading-6 font-medium mb-2">
                    {stage.tip}
                  </Text>

                  <View className="flex-row items-center mt-1">
                    <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mr-2">Target Date:</Text>
                    <Text className="text-slate-300 text-xs font-bold">
                      {targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>

                </View>
              );
            })}

          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}