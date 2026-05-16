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
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 border-b border-agro-earth-200 flex-row items-center justify-between bg-white/80">
        <View className="flex-row items-center">
          <Pressable onPress={() => navigation.goBack()} className="mr-4 p-2 bg-white rounded-full border border-agro-earth-200 shadow-sm">
            <Ionicons name="arrow-back" size={24} color="#3e8e3e" />
          </Pressable>
          <View>
            <Text className="text-2xl font-black text-agro-green-900 tracking-tight">Crop <Text className="text-agro-green-600">Library</Text></Text>
            <Text className="text-agro-earth-600 text-xs font-bold uppercase tracking-widest mt-1">Indian Plants & Veggies</Text>
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
              className="mr-3 px-6 py-3 rounded-2xl border shadow-sm"
              style={selectedCategory === cat ? { backgroundColor: '#3e8e3e', borderColor: '#2d722d' } : { backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            >
              <Text style={{ fontWeight: '700', color: selectedCategory === cat ? '#ffffff' : '#695a43' }}>
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
        <Text className="text-agro-earth-600 text-sm mb-6 font-medium leading-relaxed">
          Showing <Text className="text-agro-green-700 font-black">{currentCrops.length} items</Text> in {selectedCategory}. Explore optimal seasons and protection methods.
        </Text>

        {currentCrops.map((crop, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <View 
              key={index} 
              style={{ borderColor: isExpanded ? '#3e8e3e' : '#e5e7eb' }}
              className="mb-6 rounded-[24px] bg-white border overflow-hidden shadow-md shadow-agro-green-950/5"
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
                  <Text className="text-lg font-bold text-agro-green-950 mb-1">{crop.name}</Text>
                  <Text className="text-xs text-agro-green-600 italic font-bold mb-2">{crop.scientific_name}</Text>
                  <View className="flex-row items-center">
                    <View className="bg-agro-green-50 px-2 py-1 rounded-md mr-2 border border-agro-green-100">
                      <Text className="text-[10px] uppercase text-agro-green-700 font-black">{selectedCategory}</Text>
                    </View>
                  </View>
                </View>
                <View className="p-2">
                  <Ionicons 
                    name={isExpanded ? "chevron-up-circle" : "chevron-down-circle"} 
                    size={28} 
                    color={isExpanded ? "#3e8e3e" : "#9ca3af"} 
                  />
                </View>
              </Pressable>

              {isExpanded && (
                <View className="p-5 bg-agro-green-50/30 border-t border-agro-earth-100 space-y-4">
                  <View>
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="partly-sunny" size={16} color="#3e8e3e" />
                      <Text className="text-sm font-bold text-agro-green-900 ml-2 uppercase tracking-tight">Season & Growth</Text>
                    </View>
                    <Text className="text-agro-earth-700 text-sm font-medium leading-relaxed">{crop.season}</Text>
                    <Text className="text-agro-earth-600 text-sm mt-1 leading-relaxed">{crop.description}</Text>
                  </View>

                  <View>
                    <View className="flex-row items-center mb-1">
                      <MaterialCommunityIcons name="bug" size={18} color="#ef4444" />
                      <Text className="text-sm font-bold text-red-600 ml-2 uppercase tracking-tight">Pests</Text>
                    </View>
                    <Text className="text-agro-earth-700 text-sm font-medium leading-relaxed">{crop.pests}</Text>
                  </View>

                  <View>
                    <View className="flex-row items-center mb-1">
                      <MaterialCommunityIcons name="shield-check" size={18} color="#2563eb" />
                      <Text className="text-sm font-bold text-blue-600 ml-2 uppercase tracking-tight">Protection</Text>
                    </View>
                    <Text className="text-agro-earth-700 text-sm font-medium leading-relaxed">{crop.protection}</Text>
                  </View>

                  <View>
                    <View className="flex-row items-center mb-1">
                      <MaterialCommunityIcons name="flask" size={18} color="#ca8a04" />
                      <Text className="text-sm font-bold text-yellow-700 ml-2 uppercase tracking-tight">Fertilizers</Text>
                    </View>
                    <Text className="text-agro-earth-700 text-sm font-medium leading-relaxed">{crop.fertilizer}</Text>
                  </View>

                  <View className="bg-agro-green-100 p-4 rounded-2xl border border-agro-green-200">
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="bulb" size={16} color="#3e8e3e" />
                      <Text className="text-agro-green-800 text-[10px] font-black uppercase tracking-widest ml-2">Farmer's Pro Tip</Text>
                    </View>
                    <Text className="text-agro-green-900 text-sm italic font-bold">"{crop.simple_tip}"</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Decorative ambient gradients */}
      {/* <View className="absolute top-1/4 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <View className="absolute bottom-1/4 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" /> */}
    </SafeAreaView>
  );
}
