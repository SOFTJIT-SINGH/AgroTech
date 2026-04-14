import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { supabase } from '../../services/supabase';
import { useNavigation } from '@react-navigation/native';

// High-quality static reference data for Major Indian Crops
export const INDIAN_CROPS_DATA = [
  {
    name: 'Wheat (Gehun)',
    scientific_name: 'Triticum aestivum',
    type: 'Cereal / Rabi Crop',
    season: 'Rabi (Sown: Oct-Dec, Harvested: Feb-May)',
    description: 'A major cereal crop in India, forming the staple diet in the north and northwestern parts of the country.',
    image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600&auto=format&fit=crop',
    pests_and_diseases: 'Termites, Aphids, Brown Rust, Yellow Rust, Loose Smut.',
    protection_methods: 'Use rust-resistant varieties, crop rotation, timely sowing, seed treatment with Vitavax.',
    fertilizers: 'NPK 120:60:40 kg/ha. Zinc sulphate if soil is zinc deficient.',
    pesticides: 'Chlorpyrifos for termites, Imidacloprid for aphids, Propiconazole for rust.',
  },
  {
    name: 'Rice (Chawal/Paddy)',
    scientific_name: 'Oryza sativa',
    type: 'Cereal / Kharif Crop',
    season: 'Kharif (Sown: Jun-Jul, Harvested: Nov-Dec)',
    description: 'The most important staple food crop of India, requiring high temperature and high humidity.',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
    pests_and_diseases: 'Stem borer, Leaf folder, Brown plant hopper, Blast, Sheath blight.',
    protection_methods: 'Summer deep ploughing, field sanitation, using resistant varieties, avoiding excess nitrogen.',
    fertilizers: 'NPK 100:50:50 kg/ha + Zinc Sulphate at 25 kg/ha.',
    pesticides: 'Cartap hydrochloride, Chlorantraniliprole for borers, Tricyclazole for blast disease.',
  },
  {
    name: 'Sugarcane (Ganna)',
    scientific_name: 'Saccharum officinarum',
    type: 'Cash Crop',
    season: 'Planting usually in Jan-Mar, takes 10-14 months to harvest.',
    description: 'A tropical as well as a subtropical crop. India is one of the world\'s major producers.',
    image_url: 'https://images.unsplash.com/photo-1590483860010-06488d59d180?q=80&w=600&auto=format&fit=crop',
    pests_and_diseases: 'Early shoot borer, Top borer, Red rot, Smut.',
    protection_methods: 'Use healthy setts, sett treatment, deeply plant setts, trash mulching.',
    fertilizers: 'High N requirement (150-250 kg/ha) given in splits. Adequate P & K based on soil test.',
    pesticides: 'Chlorantraniliprole for borers. Fungicides like Carbendazim for sett treatment to prevent red rot.',
  },
  {
    name: 'Cotton (Kapas)',
    scientific_name: 'Gossypium',
    type: 'Fiber / Kharif Crop',
    season: 'Kharif (Sown: Apr-Jul depending on region, Harvested: Nov-Jan)',
    description: 'A crucial cash crop in India, providing raw material for the textile industry. Thrives in black soil.',
    image_url: 'https://images.unsplash.com/photo-1506544059030-f2de2dfbf639?q=80&w=600&auto=format&fit=crop',
    pests_and_diseases: 'Bollworms (Pink, Spotted, American), Whitefly, Aphids, Jassids, Leaf curl virus.',
    protection_methods: 'Use Bt cotton hybrids, sticky traps for sap-suckers, destroy crop residues, intercropping.',
    fertilizers: 'NPK 150:60:60 kg/ha in splits. Foliar spray of Potassium nitrate to prevent boll dropping.',
    pesticides: 'Flonicamid, Dinotefuran for whiteflies, Spinosad or Emamectin benzoate for resistant bollworms.',
  },
  {
    name: 'Tomato (Tamatar)',
    scientific_name: 'Solanum lycopersicum',
    type: 'Vegetable',
    season: 'Throughout the year depending on region (Kharif, Rabi, Zaid)',
    description: 'One of the most widely grown vegetables in India, rich in Vitamin A & C.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600&auto=format&fit=crop',
    pests_and_diseases: 'Fruit borer, Whitefly, Leaf miner, Early blight, Late blight, Leaf curl virus.',
    protection_methods: 'Crop rotation, use disease-free seedlings, staking plants, mulching.',
    fertilizers: 'NPK 120:80:60 kg/ha. Apply farmyard manure (FYM) before transplanting.',
    pesticides: 'Indoxacarb for fruit borer. Mancozeb or Copper Oxychloride for blights.',
  }
];

export default function CropLibraryScreen() {
  const navigation = useNavigation<any>();
  const [crops, setCrops] = useState(INDIAN_CROPS_DATA);
  const [loading, setLoading] = useState(false); 
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // In a real scenario, we would try to load from Supabase table 'crop_library'
  /*
  useEffect(() => {
    fetchCropsFromDb();
  }, []);

  const fetchCropsFromDb = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('crop_library').select('*');
      if (data && data.length > 0) {
        setCrops(data);
      }
    } catch (e) {
      console.log('Using local fallback data.');
    } finally {
      setLoading(false);
    }
  };
  */

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 border-b border-slate-800 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Pressable onPress={() => navigation.navigate('MainDrawerHome')} className="mr-4 p-2 bg-slate-900 rounded-full border border-slate-800">
            <Ionicons name="arrow-back" size={24} color="#34d399" />
          </Pressable>
          <View>
            <Text className="text-2xl font-black text-white tracking-tight">Crop <Text className="text-emerald-400">Library</Text></Text>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Indian Plants & Veggies</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-slate-300 text-sm mb-6 leading-relaxed">
          Explore a comprehensive guide on major crops, optimal seasons, disease protection, and fertilization techniques. 
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#34d399" style={{ marginTop: 40 }} />
        ) : (
          crops.map((crop, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <View 
                key={index} 
                style={{ borderColor: isExpanded ? '#10b981' : '#1e293b' }}
                className="mb-6 rounded-[24px] bg-slate-900 border overflow-hidden"
              >
                <Pressable 
                  onPress={() => toggleExpand(index)}
                  className="flex-row items-center p-4"
                >
                  <Image 
                    source={{ uri: crop.image_url }} 
                    style={{ width: 80, height: 80 }} 
                    className="rounded-2xl"
                    contentFit="cover"
                  />
                  <View className="flex-1 ml-4 justify-center">
                    <Text className="text-lg font-bold text-white mb-1">{crop.name}</Text>
                    <Text className="text-xs text-emerald-400 italic font-medium mb-2">{crop.scientific_name}</Text>
                    <View className="flex-row items-center">
                      <View className="bg-slate-800 px-2 py-1 rounded-md mr-2">
                        <Text className="text-[10px] uppercase text-slate-300 font-bold">{crop.type}</Text>
                      </View>
                    </View>
                  </View>
                  <View className="p-2">
                    <Ionicons 
                      name={isExpanded ? "chevron-up-circle" : "chevron-down-circle"} 
                      size={28} 
                      color={isExpanded ? "#34d399" : "#64748b"} 
                    />
                  </View>
                </Pressable>

                {isExpanded && (
                  <View className="p-5 bg-slate-950/50 border-t border-slate-800 space-y-4">
                    <View>
                      <View className="flex-row items-center mb-1">
                        <Ionicons name="partly-sunny" size={16} color="#34d399" />
                        <Text className="text-sm font-bold text-white ml-2 uppercase tracking-tight">Season & Growth</Text>
                      </View>
                      <Text className="text-slate-400 text-sm leading-relaxed">{crop.season}</Text>
                      <Text className="text-slate-400 text-sm mt-1 leading-relaxed">{crop.description}</Text>
                    </View>

                    <View>
                      <View className="flex-row items-center mb-1">
                        <MaterialCommunityIcons name="bug" size={18} color="#ef4444" />
                        <Text className="text-sm font-bold text-red-400 ml-2 uppercase tracking-tight">Pests & Diseases</Text>
                      </View>
                      <Text className="text-slate-400 text-sm leading-relaxed">{crop.pests_and_diseases}</Text>
                    </View>

                    <View>
                      <View className="flex-row items-center mb-1">
                        <MaterialCommunityIcons name="shield-check" size={18} color="#3b82f6" />
                        <Text className="text-sm font-bold text-blue-400 ml-2 uppercase tracking-tight">Protection Methods</Text>
                      </View>
                      <Text className="text-slate-400 text-sm leading-relaxed">{crop.protection_methods}</Text>
                    </View>

                    <View>
                      <View className="flex-row items-center mb-1">
                        <MaterialCommunityIcons name="flask" size={18} color="#eab308" />
                        <Text className="text-sm font-bold text-yellow-400 ml-2 uppercase tracking-tight">Fertilizers</Text>
                      </View>
                      <Text className="text-slate-400 text-sm leading-relaxed">{crop.fertilizers}</Text>
                    </View>

                    <View>
                      <View className="flex-row items-center mb-1">
                        <MaterialCommunityIcons name="spray" size={18} color="#f97316" />
                        <Text className="text-sm font-bold text-orange-400 ml-2 uppercase tracking-tight">Pesticides</Text>
                      </View>
                      <Text className="text-slate-400 text-sm leading-relaxed">{crop.pesticides}</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Decorative ambient gradients */}
      <View className="absolute top-1/4 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <View className="absolute bottom-1/4 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
    </SafeAreaView>
  );
}
