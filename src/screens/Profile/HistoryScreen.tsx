import React from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-row items-center px-6 pt-6 pb-4">
        <Pressable onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#34d399" />
        </Pressable>
        <Text className="text-2xl font-extrabold text-white tracking-tight">
          Analysis <Text className="text-emerald-400">History</Text>
        </Text>
      </View>

      <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#34d399" className="mt-10" />
        ) : dbHistory.length === 0 ? (
          <View className="mt-12 items-center justify-center p-6 bg-slate-900 rounded-[32px] border border-slate-800">
            <Ionicons name="leaf-outline" size={48} color="#94a3b8" />
            <Text className="text-slate-200 font-bold text-lg mt-4 text-center">No Analysis Yet</Text>
            <Text className="text-slate-400 text-center mt-2">Your scanned crops and plant diseases will appear here.</Text>
          </View>
        ) : (
          dbHistory.map((item) => (
            <View key={item.report_id} className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 mb-6">
              <Image source={{ uri: item.image_url }} style={{ width: '100%', height: 200 }} className="opacity-90" />
              <View className="p-5 relative">
                <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">{formatDate(item.detected_on)}</Text>
                
                <View className="flex-row justify-between items-start mt-2 mb-4">
                  <View>
                    <Text className="text-white font-extrabold text-xl">{item.disease_name}</Text>
                  </View>
                  <View className="bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                    <Text className="text-emerald-400 font-bold text-xs uppercase">{item.confidence_score}%</Text>
                  </View>
                </View>
                
                <View className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                  <Text className="font-bold text-emerald-400 mb-2 text-xs uppercase tracking-wider">Treatment</Text>
                  <Text className="text-slate-300 text-sm leading-6">{item.treatment}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
