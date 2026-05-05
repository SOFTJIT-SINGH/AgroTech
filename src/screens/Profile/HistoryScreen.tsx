import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/userStore';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../../services/supabase';
import { useState, useEffect } from 'react';

export default function HistoryScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [dbHistory, setDbHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('disease_reports')
        .select('*')
        .eq('user_id', session.user.id)
        .order('detected_on', { ascending: false });

      if (data) setDbHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      {/* Header */}
      <View className="px-6 py-5 border-b border-agro-earth-100 flex-row items-center bg-white shadow-sm">
        <Pressable 
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.openDrawer()} 
          className="mr-4 p-2 bg-agro-earth-50 rounded-full border border-agro-earth-100 active:scale-90 transition-all"
        >
          <Ionicons name={navigation.canGoBack() ? "arrow-back" : "menu-outline"} size={22} color="#3e8e3e" />
        </Pressable>
        <View>
          <Text className="text-2xl font-extrabold text-agro-green-950 tracking-tight">My <Text className="text-agro-green-600">Crops</Text></Text>
          <Text className="text-agro-earth-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Analysis History</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="mt-20 items-center justify-center">
             <ActivityIndicator size="large" color="#3e8e3e" />
             <Text className="text-agro-earth-500 font-bold mt-4 tracking-widest uppercase text-[10px]">Retrieving History...</Text>
          </View>
        ) : dbHistory.length === 0 ? (
          <View className="mt-12 items-center justify-center p-8 bg-white rounded-[32px] border border-agro-earth-100 shadow-sm">
            <View className="bg-agro-earth-50 p-6 rounded-full mb-6">
              <Ionicons name="leaf-outline" size={48} color="#8f7e5d" />
            </View>
            <Text className="text-agro-green-950 font-black text-xl text-center">No Analysis Yet</Text>
            <Text className="text-agro-earth-500 text-center mt-2 font-bold leading-5">Your scanned crops and plant diseases will appear here for easy tracking.</Text>
          </View>
        ) : (
          dbHistory.map((item) => (
            <View key={item.report_id} className="bg-white rounded-[32px] overflow-hidden border border-agro-earth-100 mb-8 shadow-lg shadow-agro-green-950/5">
              <Image source={{ uri: item.image_url }} style={{ width: '100%', height: 220 }} contentFit="cover" className="bg-agro-earth-50" />
              
              <View className="p-6 relative">
                {/* Confidence Badge */}
                <View className="absolute -top-12 right-6 bg-agro-green-600 px-4 py-2 rounded-2xl border-4 border-white shadow-lg">
                  <Text className="text-white font-black text-xs">{item.confidence_score}% Match</Text>
                </View>

                <View className="mb-4">
                  <Text className="text-agro-earth-500 text-[10px] font-black uppercase tracking-widest mb-1">{formatDate(item.detected_on)}</Text>
                  <Text className="text-agro-green-950 font-black text-2xl tracking-tight leading-8">{item.disease_name}</Text>
                </View>
                
                <View className="bg-agro-earth-50 p-5 rounded-[24px] border border-agro-earth-100">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="medkit" size={14} color="#3e8e3e" />
                    <Text className="font-black text-agro-green-600 ml-2 text-[10px] uppercase tracking-widest">Recommended Treatment</Text>
                  </View>
                  <Text className="text-agro-earth-700 text-sm leading-6 font-bold">{item.treatment}</Text>
                </View>
              </View>
            </View>
          ))
        )}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
