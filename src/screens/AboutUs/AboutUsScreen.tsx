import React from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';

export default function AboutUsScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 border-b border-agro-earth-200 flex-row items-center bg-white/80">
        <Pressable onPress={() => navigation.goBack()} className="mr-4 p-2 bg-white rounded-full border border-agro-earth-200 shadow-sm">
          <Ionicons name="arrow-back" size={24} color="#3e8e3e" />
        </Pressable>
        <View>
          <Text className="text-2xl font-black text-agro-green-900 tracking-tight">About <Text className="text-agro-green-600">Us</Text></Text>
          <Text className="text-agro-earth-600 text-xs font-bold uppercase tracking-widest mt-1">Empowering Farmers</Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-10 mt-6 relative">
          <View className="absolute w-48 h-48 bg-agro-green-500/10 rounded-full blur-3xl" />
          {/* <Image 
            source={{ uri: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c0a37?q=80&w=400&auto=format&fit=crop" }}
            style={{ width: 120, height: 120 }}
            className="rounded-full border-4 border-agro-green-500 shadow-xl shadow-agro-green-500/20"
          /> */}
          <MaterialCommunityIcons name="leaf" size={140} color="#3e8e3e" />
          <Text className="text-3xl font-black text-agro-green-950 mt-6 tracking-wide">
            Agro<Text className="text-agro-green-600">Tech</Text>
          </Text>
          <Text className="text-agro-earth-500 font-bold text-sm mt-1 uppercase tracking-widest">
            Version 1.0.0
          </Text>
        </View>

        <View className="bg-white rounded-3xl p-6 border border-agro-earth-200 mb-8 z-10 shadow-lg shadow-agro-green-950/5">
          <Text className="text-xl font-bold text-agro-green-900 mb-4">Our Mission</Text>
          <Text className="text-agro-earth-700 leading-relaxed text-base font-medium">
            We are dedicated to bridging the vital gap between cutting-edge technology and classical Indian farming. 
            By providing real-time weather analytics, AI-driven crop chatbot assistance, market selling insights, and crop library, we strive to maximize yields, optimize resource allocation, and empower farmers with data-driven decision making.
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between mb-8 z-10">
          <View className="w-[48%] bg-white rounded-2xl p-4 border border-agro-earth-200 mb-4 items-center shadow-sm">
             <MaterialCommunityIcons name="leaf" size={32} color="#3e8e3e" />
             <Text className="text-agro-green-950 font-bold mt-2 text-center">Smart Farming</Text>
             <Text className="text-agro-earth-500 text-xs font-bold text-center mt-1">Data-driven tech</Text>
          </View>
          <View className="w-[48%] bg-white rounded-2xl p-4 border border-agro-earth-200 mb-4 items-center shadow-sm">
             <MaterialCommunityIcons name="robot" size={32} color="#2563eb" />
             <Text className="text-agro-green-950 font-bold mt-2 text-center">AI Chatbot</Text>
             <Text className="text-agro-earth-500 text-xs font-bold text-center mt-1">24/7 Assistance</Text>
          </View>
          <View className="w-[48%] bg-white rounded-2xl p-4 border border-agro-earth-200 items-center shadow-sm">
             <MaterialCommunityIcons name="weather-partly-cloudy" size={32} color="#ca8a04" />
             <Text className="text-agro-green-950 font-bold mt-2 text-center">Weather API</Text>
             <Text className="text-agro-earth-500 text-xs font-bold text-center mt-1">Precise forecasts</Text>
          </View>
          <View className="w-[48%] bg-white rounded-2xl p-4 border border-agro-earth-200 items-center shadow-sm">
             <MaterialCommunityIcons name="tree-outline" size={32} color="#3e8e3e" />
             <Text className="text-agro-green-950 font-bold mt-2 text-center">Plant Disease</Text>
             <Text className="text-agro-earth-500 text-xs font-bold text-center mt-1">Find Diseases to plants and get solutions</Text>
          </View>
        </View>

        <View className="bg-white rounded-3xl p-6 border border-agro-earth-200 mb-6 z-10 shadow-lg shadow-agro-green-950/5">
          <Text className="text-xl font-bold text-agro-green-900 mb-4">Contact & Support</Text>
          
          <Pressable 
            className="flex-row items-center p-3 py-4 border-b border-agro-earth-100 active:bg-agro-green-50 rounded-xl"
            onPress={() => Linking.openURL('mailto:support@agrotech.com')}
          >
            <View className="bg-agro-green-100 p-2 rounded-full mr-4">
              <Ionicons name="mail" size={20} color="#3e8e3e" />
            </View>
            <View>
              <Text className="text-agro-green-950 font-bold">Email Us</Text>
              <Text className="text-agro-earth-500 text-xs font-bold mt-1">surinderbhullar307@gmail.com</Text>
            </View>
          </Pressable>

          <Pressable 
            className="flex-row items-center p-3 py-4 active:bg-agro-green-50 rounded-xl mt-2"
            onPress={() => Linking.openURL('tel:+919876543210')}
          >
            <View className="bg-blue-100 p-2 rounded-full mr-4">
              <Ionicons name="call" size={20} color="#2563eb" />
            </View>
            <View>
              <Text className="text-agro-green-950 font-bold">Call Support</Text>
              <Text className="text-agro-earth-500 text-xs font-bold mt-1">+91 81980 58974</Text>
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
