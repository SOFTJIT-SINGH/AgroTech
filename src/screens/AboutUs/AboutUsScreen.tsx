import React from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';

export default function AboutUsScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 border-b border-slate-800 flex-row items-center">
        <Pressable onPress={() => navigation.navigate('MainDrawerHome')} className="mr-4 p-2 bg-slate-900 rounded-full border border-slate-800">
          <Ionicons name="arrow-back" size={24} color="#34d399" />
        </Pressable>
        <View>
          <Text className="text-2xl font-black text-white tracking-tight">About <Text className="text-emerald-400">Us</Text></Text>
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Empowering Farmers</Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-10 mt-6 relative">
          <View className="absolute w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c0a37?q=80&w=400&auto=format&fit=crop" }}
            style={{ width: 120, height: 120 }}
            className="rounded-full border-4 border-emerald-500 shadow-xl shadow-emerald-500/30"
          />
          <Text className="text-3xl font-black text-white mt-6 tracking-wide">
            Agro<Text className="text-emerald-400">Tech</Text>
          </Text>
          <Text className="text-slate-400 font-medium text-sm mt-1 uppercase tracking-widest">
            Version 1.0.0
          </Text>
        </View>

        <View className="bg-slate-900 rounded-3xl p-6 border border-slate-800 mb-8 z-10 shadow-xl">
          <Text className="text-xl font-bold text-white mb-4">Our Mission</Text>
          <Text className="text-slate-300 leading-relaxed text-base">
            We are dedicated to bridging the vital gap between cutting-edge technology and classical Indian farming. 
            By providing real-time weather analytics, AI-driven crop chatbot assistance, market selling insights, and crop library, we strive to maximize yields, optimize resource allocation, and empower farmers with data-driven decision making.
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between mb-8 z-10">
          <View className="w-[48%] bg-slate-900 rounded-2xl p-4 border border-slate-800 mb-4 items-center">
             <MaterialCommunityIcons name="leaf" size={32} color="#34d399" />
             <Text className="text-white font-bold mt-2 text-center">Smart Farming</Text>
             <Text className="text-slate-400 text-xs text-center mt-1">Data-driven tech</Text>
          </View>
          <View className="w-[48%] bg-slate-900 rounded-2xl p-4 border border-slate-800 mb-4 items-center">
             <MaterialCommunityIcons name="robot" size={32} color="#3b82f6" />
             <Text className="text-white font-bold mt-2 text-center">AI Chatbot</Text>
             <Text className="text-slate-400 text-xs text-center mt-1">24/7 Assistance</Text>
          </View>
          <View className="w-[48%] bg-slate-900 rounded-2xl p-4 border border-slate-800 items-center">
             <MaterialCommunityIcons name="weather-partly-cloudy" size={32} color="#eab308" />
             <Text className="text-white font-bold mt-2 text-center">Weather API</Text>
             <Text className="text-slate-400 text-xs text-center mt-1">Precise forecasts</Text>
          </View>
          <View className="w-[48%] bg-slate-900 rounded-2xl p-4 border border-slate-800 items-center">
             <MaterialCommunityIcons name="currency-inr" size={32} color="#f97316" />
             <Text className="text-white font-bold mt-2 text-center">Market Prices</Text>
             <Text className="text-slate-400 text-xs text-center mt-1">Find best rates</Text>
          </View>
        </View>

        <View className="bg-slate-900 rounded-3xl p-6 border border-slate-800 mb-6 z-10">
          <Text className="text-xl font-bold text-white mb-4">Contact & Support</Text>
          
          <Pressable 
            className="flex-row items-center p-3 py-4 border-b border-slate-800/50 active:bg-slate-800 rounded-xl"
            onPress={() => Linking.openURL('mailto:support@agrotech.com')}
          >
            <View className="bg-emerald-500/20 p-2 rounded-full mr-4">
              <Ionicons name="mail" size={20} color="#34d399" />
            </View>
            <View>
              <Text className="text-white font-bold">Email Us</Text>
              <Text className="text-slate-400 text-xs mt-1">support@agrotech.com</Text>
            </View>
          </Pressable>

          <Pressable 
            className="flex-row items-center p-3 py-4 active:bg-slate-800 rounded-xl mt-2"
            onPress={() => Linking.openURL('tel:+919876543210')}
          >
            <View className="bg-blue-500/20 p-2 rounded-full mr-4">
              <Ionicons name="call" size={20} color="#3b82f6" />
            </View>
            <View>
              <Text className="text-white font-bold">Call Support</Text>
              <Text className="text-slate-400 text-xs mt-1">+91 98765 43210</Text>
            </View>
          </Pressable>
        </View>

        <Text className="text-center text-slate-500 text-xs font-semibold tracking-widest mt-4">
          MADE WITH ❤️ IN INDIA
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
