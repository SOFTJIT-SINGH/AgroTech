import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PESTS_DISEASES_LIBRARY } from '../../constants/libraryData';

export default function PestsLibraryScreen() {
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
            <Text className="text-2xl font-black text-white tracking-tight">Pests <Text className="text-rose-500">& Diseases</Text></Text>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Diagnosis & Treatment</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-slate-400 text-sm mb-6 leading-relaxed">
          Quickly identify common farm pests and plant diseases with symptoms and proven treatment options.
        </Text>

        {PESTS_DISEASES_LIBRARY.map((item, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <View 
              key={index} 
              style={{ borderColor: isExpanded ? '#f43f5e' : '#1e293b' }}
              className="mb-4 rounded-[24px] bg-slate-900 border overflow-hidden"
            >
              <Pressable 
                onPress={() => toggleExpand(index)}
                className="flex-row items-center p-5"
              >
                <View className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <Ionicons name={item.icon as any || "bug-outline"} size={28} color="#f43f5e" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-bold text-white mb-1">{item.name}</Text>
                  <Text className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    {item.type}
                  </Text>
                </View>
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={isExpanded ? "#f43f5e" : "#64748b"} 
                />
              </Pressable>

              {isExpanded && (
                <View className="p-6 bg-slate-950/50 border-t border-slate-800 space-y-4">
                  <View>
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="eye-outline" size={14} color="#64748b" />
                      <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-2">Symptoms</Text>
                    </View>
                    <Text className="text-slate-200 text-sm leading-relaxed">{item.symptoms}</Text>
                  </View>

                  <View className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                    <View className="flex-row items-center mb-1">
                      <MaterialCommunityIcons name="medical-bag" size={14} color="#34d399" />
                      <Text className="text-emerald-400 text-[10px] font-black uppercase tracking-widest ml-2">Recommended Treatment</Text>
                    </View>
                    <Text className="text-emerald-50/80 text-sm leading-relaxed font-medium">{item.treatment}</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Decorative ambient gradients */}
      <View className="absolute top-1/4 -right-20 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <View className="absolute bottom-1/4 -left-20 w-64 h-64 bg-slate-500/10 rounded-full blur-3xl pointer-events-none" />
    </SafeAreaView>
  );
}
