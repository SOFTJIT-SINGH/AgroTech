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
import { Image } from "expo-image";

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

const fertilizerGuide: any = {
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
  const [crop, setCrop] = useState<string | null>(null);
  const [soil, setSoil] = useState<string | null>(null);
  const [farm, setFarm] = useState<string | null>(null);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [plan, setPlan] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);

  const generatePlan = async () => {
    if (!crop || !soil || !farm) return;

    setIsLoading(true);
    const prompt = `
      As an agricultural expert, provide a detailed fertilizer plan for the following:
      Crop: ${crop}
      Soil Type: ${soil}
      Farm Size: ${farm}
      Sowing Date: ${date.toDateString()}
      
      Return the response in this JSON format:
      {
        "baseDose": {
          "nitrogen": number,
          "phosphorus": number,
          "potassium": number
        },
        "stages": [
          {
            "stage": "Stage Name",
            "day": number,
            "tip": "Short actionable tip"
          }
        ]
      }
    `;

    try {
      const data = await fetchGeminiResponse(prompt);
      if (data && data.baseDose) {
        setPlan(data);
      } else {
        generateStaticPlan();
      }
    } catch (error) {
      generateStaticPlan();
    } finally {
      setIsLoading(false);
    }
  };

  const generateStaticPlan = () => {
    if (!crop || !crop || !fertilizerGuide[crop]) return;

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



  const Selector = ({ title, data, value, setValue }: any) => (
    <View className="mb-7">
      <Text className="text-agro-earth-500 font-bold mb-3 px-1 text-sm uppercase tracking-wider">
        {title}
      </Text>

      <View className="flex-row flex-wrap">
        {data.map((item: string) => {
          const isSelected = value === item;
          return (
            <Pressable
              key={item}
              onPress={() => setValue(item)}
              className="px-5 py-3 mr-3 mb-3 rounded-2xl border"
              style={isSelected ? { backgroundColor: '#dcf0dc', borderColor: '#b8d8b8', shadowColor: '#1a3c1a', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 } : { backgroundColor: '#ffffff', borderColor: '#ebe9df' }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: '600', letterSpacing: 0.5, color: isSelected ? '#2d722d' : '#695a43' }}
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
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      {/* HEADER */}
      <View className="px-6 pt-4 pb-4 border-b border-agro-earth-100 bg-white flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Pressable 
            onPress={() => navigation.goBack()}
            className="mr-4 p-2 bg-white rounded-full border border-agro-earth-200 active:scale-95 transition-all"
          >
            <Ionicons name="arrow-back" size={24} color="#3e8e3e" />
          </Pressable>
          <View>
            <Text className="text-xl font-black text-agro-green-950 tracking-tight">Fertilizer <Text className="text-agro-green-600">Plan</Text></Text>
            <Text className="text-agro-earth-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Nutrient Guide</Text>
          </View>
        </View>
        <Image
          source={{ uri: "https://img.icons8.com/fluency/96/sprout.png" }}
          style={{ width: 40, height: 40 }}
          className="opacity-90"
        />
      </View>

      <ScrollView 
        className="px-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        
        {/* HERO SECTION */}
        <View className="mb-8">
          <Text className="text-2xl font-extrabold text-agro-green-950 tracking-tight leading-8">
            Soil Nutrient <Text className="text-agro-green-600">Scheduler</Text>
          </Text>
          <Text className="text-agro-earth-500 font-medium mt-1 text-sm">
            Generate an optimal nutrient schedule for your crop
          </Text>
        </View>

        {/* SELECTORS */}
        <Selector title="Select Crop" data={crops} value={crop} setValue={setCrop} />
        <Selector title="Soil Type" data={soils} value={soil} setValue={setSoil} />
        <Selector title="Farm Size" data={farmSizes} value={farm} setValue={setFarm} />

        {/* DATE SELECTOR */}
        <Text className="text-agro-earth-500 font-bold mb-3 px-1 text-sm uppercase tracking-wider">
          Sowing Date
        </Text>

        <Pressable
          onPress={() => setShowPicker(true)}
          className="bg-white p-4 rounded-2xl border border-agro-earth-100 mb-6 flex-row justify-between items-center active:bg-agro-earth-50 transition-colors shadow-sm"
        >
          <Text className="text-agro-green-950 font-semibold text-base">
            {date.toDateString()}
          </Text>
          <Text className="text-agro-earth-400 text-xl font-bold">🗓️</Text>
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
          onPress={generatePlan}
          disabled={!crop || !soil || !farm || isLoading}
          className="py-4 rounded-2xl items-center mb-6 shadow-lg transition-all"
          style={crop && soil && farm && !isLoading ? { backgroundColor: '#3e8e3e', shadowColor: '#2d722d', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 } : { backgroundColor: '#e5e2d9', opacity: 0.5 }}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={{ fontWeight: '800', fontSize: 16, letterSpacing: 1, textTransform: 'uppercase', color: crop && soil && farm ? '#ffffff' : '#695a43' }}>
              Generate Plan
            </Text>
          )}
        </Pressable>

        {/* RESULT CARD / LOADING STATE */}
        {isLoading ? (
          <View className="bg-white p-8 rounded-[28px] mb-12 border border-agro-earth-100 items-center justify-center shadow-xl shadow-agro-green-950/5">
            <ActivityIndicator size="large" color="#3e8e3e" />
            <Text className="text-agro-green-600 font-bold mt-4 tracking-widest uppercase text-[10px]">
              AI Generating Nutrient Schedule...
            </Text>
          </View>
        ) : plan && (
          <View className="bg-white p-6 rounded-[28px] mb-12 border border-agro-earth-100 relative shadow-xl shadow-agro-green-950/5">
            
            <Text className="text-agro-green-600 font-bold text-xs uppercase tracking-widest mb-4">
              Recommended NPK Profile
            </Text>

            {/* NPK Dashboard Layout */}
            <View className="flex-row justify-between mb-8">
              
              <View className="bg-agro-earth-50 rounded-2xl p-4 flex-1 mr-2 border border-agro-earth-100 items-center justify-center">
                <Text className="text-agro-earth-500 font-bold text-[10px] uppercase tracking-widest mb-1">Nitrogen (N)</Text>
                <Text className="text-agro-green-950 font-black text-2xl">{plan.baseDose.nitrogen}</Text>
                <Text className="text-agro-earth-500 font-medium text-xs mt-1">kg/ha</Text>
              </View>

              <View className="bg-agro-earth-50 rounded-2xl p-4 flex-1 mr-2 border border-agro-earth-100 items-center justify-center">
                <Text className="text-agro-earth-500 font-bold text-[10px] uppercase tracking-widest mb-1">Phosphorus (P)</Text>
                <Text className="text-agro-green-950 font-black text-2xl">{plan.baseDose.phosphorus}</Text>
                <Text className="text-agro-earth-500 font-medium text-xs mt-1">kg/ha</Text>
              </View>

              <View className="bg-agro-earth-50 rounded-2xl p-4 flex-1 border border-agro-earth-100 items-center justify-center">
                <Text className="text-agro-earth-500 font-bold text-[10px] uppercase tracking-widest mb-1">Potassium (K)</Text>
                <Text className="text-agro-green-950 font-black text-2xl">{plan.baseDose.potassium}</Text>
                <Text className="text-agro-earth-500 font-medium text-xs mt-1">kg/ha</Text>
              </View>

            </View>

            <View className="h-[1px] w-full bg-agro-earth-100 mb-6" />

            <Text className="text-agro-green-950 font-bold text-lg mb-4">
              Application Schedule
            </Text>

            {/* Timeline view */}
            {plan.stages.map((stage, index) => {
              // Calculate the exact target date for UI improvement
              const targetDate = new Date(date);
              targetDate.setDate(targetDate.getDate() + stage.day);

              return (
                <View key={index} className="bg-agro-earth-50/50 p-4 rounded-2xl border border-agro-earth-100 mb-3">
                  
                  <View className="flex-row justify-between items-center mb-3 border-b border-agro-earth-100 pb-3">
                    <Text className="font-extrabold text-agro-green-950 text-base">
                      {stage.stage}
                    </Text>
                    
                    <View className="bg-agro-green-100 px-3 py-1.5 rounded-lg border border-agro-green-200">
                      <Text className="text-agro-green-700 text-xs font-bold uppercase tracking-wider">
                        Day {stage.day}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-agro-earth-600 text-sm leading-6 font-medium mb-2">
                    {stage.tip}
                  </Text>

                  <View className="flex-row items-center mt-1">
                    <Text className="text-agro-earth-500 text-xs font-semibold uppercase tracking-wider mr-2">Target Date:</Text>
                    <Text className="text-agro-green-800 text-xs font-bold">
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
