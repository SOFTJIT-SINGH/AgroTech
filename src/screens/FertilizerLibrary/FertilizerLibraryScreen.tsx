import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FERTILIZER_LIBRARY } from '../../constants/libraryData';

export default function FertilizerLibraryScreen() {
  const navigation = useNavigation<any>();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 border-b border-agro-earth-100 flex-row items-center justify-between bg-white/50">
        <View className="flex-row items-center">
          <Pressable onPress={() => navigation.goBack()} className="mr-4 p-2 bg-white rounded-full border border-agro-earth-200 shadow-sm active:scale-95 transition-all">
            <Ionicons name="arrow-back" size={24} color="#3e8e3e" />
          </Pressable>
          <View>
            <Text className="text-2xl font-black text-agro-green-950 tracking-tight">Fertilizer <Text className="text-agro-green-600">Library</Text></Text>
            <Text className="text-agro-earth-500 text-xs font-bold uppercase tracking-widest mt-1">Nutrients & Soil Health</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-agro-earth-600 text-sm mb-6 leading-relaxed font-bold">
          Comprehensive guide on organic and synthetic fertilizers to boost your crop yield and soil quality.
        </Text>

        {FERTILIZER_LIBRARY.map((item, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <View 
              key={index} 
              style={{ borderColor: isExpanded ? '#3e8e3e' : '#e5e2d9' }}
              className="mb-4 rounded-[24px] bg-white border overflow-hidden shadow-sm shadow-agro-green-950/5"
            >
              <Pressable 
                onPress={() => toggleExpand(index)}
                className="flex-row items-center p-5"
              >
                <View className="bg-agro-green-50 p-3 rounded-2xl border border-agro-green-100">
                  <Ionicons name={item.icon as any || "flask-outline"} size={28} color="#3e8e3e" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-bold text-agro-green-950 mb-1">{item.name}</Text>
                  <Text className="text-xs text-agro-green-700 font-black uppercase tracking-wider">{item.source}</Text>
                </View>
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={isExpanded ? "#3e8e3e" : "#8f7e5d"} 
                />
              </Pressable>

              {isExpanded && (
                <View className="p-6 bg-agro-earth-50/50 border-t border-agro-earth-100 space-y-4">
                  <View>
                    <Text className="text-agro-green-700 text-[10px] font-black uppercase tracking-widest mb-1">Composition</Text>
                    <Text className="text-agro-green-950 text-sm font-black">{item.content}</Text>
                  </View>

                  <View>
                    <Text className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-1">Primary Usage</Text>
                    <Text className="text-agro-earth-600 text-sm leading-relaxed font-bold">{item.usage}</Text>
                  </View>

                  <View className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                    <Text className="text-rose-600 text-[10px] font-black uppercase tracking-widest mb-1">Safety & Caution</Text>
                    <Text className="text-rose-700 text-xs leading-relaxed italic font-bold">{item.caution}</Text>
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
