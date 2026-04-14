import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { supabase } from '../../services/supabase';
import { useNavigation } from '@react-navigation/native';

import { CROP_LIBRARY_DATA } from '../../constants/libraryData';

export default function CropLibraryScreen() {
  const navigation = useNavigation<any>();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof CROP_LIBRARY_DATA>('Crops');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const categories = Object.keys(CROP_LIBRARY_DATA) as Array<keyof typeof CROP_LIBRARY_DATA>;
  const currentCrops = CROP_LIBRARY_DATA[selectedCategory];

  const handleCategoryChange = (cat: keyof typeof CROP_LIBRARY_DATA) => {
    setSelectedCategory(cat);
    setExpandedIndex(null);
  };

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

      {/* Category Tabs */}
      <View className="mt-4 px-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => handleCategoryChange(cat)}
              className={`mr-3 px-6 py-3 rounded-2xl border transition-all ${
                selectedCategory === cat 
                ? 'bg-emerald-600 border-emerald-500' 
                : 'bg-slate-900 border-slate-800'
              }`}
            >
              <Text className={`font-bold ${selectedCategory === cat ? 'text-white' : 'text-slate-400'}`}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-slate-400 text-sm mb-6 leading-relaxed">
          Showing <Text className="text-emerald-400 font-bold">{currentCrops.length} items</Text> in {selectedCategory}. Explore optimal seasons and protection methods.
        </Text>

        {currentCrops.map((crop, index) => {
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
                      <Text className="text-[10px] uppercase text-slate-300 font-bold">{selectedCategory}</Text>
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
                      <Text className="text-sm font-bold text-red-400 ml-2 uppercase tracking-tight">Pests</Text>
                    </View>
                    <Text className="text-slate-400 text-sm leading-relaxed">{crop.pests}</Text>
                  </View>

                  <View>
                    <View className="flex-row items-center mb-1">
                      <MaterialCommunityIcons name="shield-check" size={18} color="#3b82f6" />
                      <Text className="text-sm font-bold text-blue-400 ml-2 uppercase tracking-tight">Protection</Text>
                    </View>
                    <Text className="text-slate-400 text-sm leading-relaxed">{crop.protection}</Text>
                  </View>

                  <View>
                    <View className="flex-row items-center mb-1">
                      <MaterialCommunityIcons name="flask" size={18} color="#eab308" />
                      <Text className="text-sm font-bold text-yellow-400 ml-2 uppercase tracking-tight">Fertilizers</Text>
                    </View>
                    <Text className="text-slate-400 text-sm leading-relaxed">{crop.fertilizer}</Text>
                  </View>

                  <View className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="bulb" size={16} color="#34d399" />
                      <Text className="text-emerald-400 text-[10px] font-black uppercase tracking-widest ml-2">Farmer's Pro Tip</Text>
                    </View>
                    <Text className="text-slate-300 text-sm italic font-medium">"{crop.simple_tip}"</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Decorative ambient gradients */}
      <View className="absolute top-1/4 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <View className="absolute bottom-1/4 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
    </SafeAreaView>
  );
}
