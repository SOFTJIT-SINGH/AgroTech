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
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 border-b border-slate-800 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Pressable onPress={() => navigation.goBack()} className="mr-4 p-2 bg-slate-900 rounded-full border border-slate-800">
            <Ionicons name="arrow-back" size={24} color="#34d399" />
          </Pressable>
          <View>
            <Text className="text-2xl font-black text-white tracking-tight">Fertilizer <Text className="text-emerald-400">Library</Text></Text>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Nutrients & Soil Health</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-slate-400 text-sm mb-6 leading-relaxed">
          Comprehensive guide on organic and synthetic fertilizers to boost your crop yield and soil quality.
        </Text>

        {FERTILIZER_LIBRARY.map((item, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <View 
              key={index} 
              style={{ borderColor: isExpanded ? '#34d399' : '#1e293b' }}
              className="mb-4 rounded-[24px] bg-slate-900 border overflow-hidden"
            >
              <Pressable 
                onPress={() => toggleExpand(index)}
                className="flex-row items-center p-5"
              >
                <View className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <Ionicons name={item.icon as any || "flask-outline"} size={28} color="#34d399" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-bold text-white mb-1">{item.name}</Text>
                  <Text className="text-xs text-emerald-400 font-medium uppercase tracking-wider">{item.source}</Text>
                </View>
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={isExpanded ? "#34d399" : "#64748b"} 
                />
              </Pressable>

              {isExpanded && (
                <View className="p-6 bg-slate-950/50 border-t border-slate-800 space-y-4">
                  <View>
                    <Text className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Composition</Text>
                    <Text className="text-slate-200 text-sm font-bold">{item.content}</Text>
                  </View>

                  <View>
                    <Text className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Primary Usage</Text>
                    <Text className="text-slate-400 text-sm leading-relaxed">{item.usage}</Text>
                  </View>

                  <View className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
                    <Text className="text-rose-400 text-[10px] font-black uppercase tracking-widest mb-1">Safety & Caution</Text>
                    <Text className="text-slate-300 text-xs leading-relaxed italic">{item.caution}</Text>
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
