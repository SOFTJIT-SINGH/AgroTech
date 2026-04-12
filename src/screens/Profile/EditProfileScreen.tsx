import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/userStore';
import DynamicButton from '../../components/DynamicButton';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';

export default function EditProfileScreen({ navigation }: any) {
  const { name, phone, location, farmSize, mainCrop, farmingExperience, preferredLanguage, updateProfile } = useUserStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name,
    phone,
    location,
    farmSize,
    mainCrop,
    farmingExperience,
    preferredLanguage,
  });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }

    setLoading(true);

    // 1. Update local Zustand store
    updateProfile(formData);

    // 2. Persist to Supabase user_metadata
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.name.trim(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
          farm_size: formData.farmSize.trim(),
          primary_crop: formData.mainCrop.trim(),
          farming_experience: formData.farmingExperience.trim(),
          preferred_language: formData.preferredLanguage.trim(),
        }
      });

      setLoading(false);

      if (error) {
        Alert.alert("Error", "Profile updated locally but failed to sync: " + error.message);
      } else {
        Alert.alert("Success", "Profile updated successfully.", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong while saving.");
      console.log("EditProfile save error:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <Pressable onPress={() => navigation.goBack()} className="mr-4 p-2 bg-slate-900 rounded-2xl border border-slate-800 active:scale-95">
            <Ionicons name="arrow-back" size={22} color="#34d399" />
          </Pressable>
          <Text className="text-2xl font-extrabold text-white tracking-tight">
            Edit <Text className="text-emerald-400">Profile</Text>
          </Text>
        </View>

        <View className="mb-5">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Full Name</Text>
          <TextInput
            value={formData.name}
            onChangeText={(t) => setFormData({ ...formData, name: t })}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium"
            placeholderTextColor="#64748b"
            placeholder="Your name"
          />
        </View>

        <View className="mb-5">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Phone</Text>
          <TextInput
            value={formData.phone}
            onChangeText={(t) => setFormData({ ...formData, phone: t })}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium"
            placeholderTextColor="#64748b"
            keyboardType="phone-pad"
            placeholder="e.g. +91 9876543210"
          />
        </View>

        <View className="mb-5">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Farm Location</Text>
          <TextInput
            value={formData.location}
            onChangeText={(t) => setFormData({ ...formData, location: t })}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium"
            placeholderTextColor="#64748b"
            placeholder="Village, District, State"
          />
        </View>

        <View className="flex-row mb-5">
          <View className="flex-1 mr-2">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Farm Size</Text>
            <TextInput
              value={formData.farmSize}
              onChangeText={(t) => setFormData({ ...formData, farmSize: t })}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium"
              placeholderTextColor="#64748b"
              placeholder="e.g. 5 Acres"
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Main Crop</Text>
            <TextInput
              value={formData.mainCrop}
              onChangeText={(t) => setFormData({ ...formData, mainCrop: t })}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium"
              placeholderTextColor="#64748b"
              placeholder="e.g. Wheat"
            />
          </View>
        </View>

        <View className="flex-row mb-5">
          <View className="flex-1 mr-2">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Experience (Yrs)</Text>
            <TextInput
              value={formData.farmingExperience}
              onChangeText={(t) => setFormData({ ...formData, farmingExperience: t })}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              placeholder="e.g. 5"
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Language</Text>
            <TextInput
              value={formData.preferredLanguage}
              onChangeText={(t) => setFormData({ ...formData, preferredLanguage: t })}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium"
              placeholderTextColor="#64748b"
              placeholder="e.g. English"
            />
          </View>
        </View>

        {/* Info tip */}
        <View className="bg-slate-900/80 rounded-2xl p-4 mb-8 border border-slate-800 flex-row items-start">
          <Ionicons name="information-circle-outline" size={18} color="#64748b" style={{ marginTop: 2, marginRight: 10 }} />
          <Text className="text-slate-500 text-xs leading-5 flex-1 font-medium">
            Farm details help our AI provide personalized crop advice, disease prevention tips, and better weather recommendations.
          </Text>
        </View>

        <DynamicButton
          title="SAVE CHANGES"
          onPress={handleSave}
          loading={loading}
          className="mb-12 rounded-2xl bg-emerald-600"
          textClassName="text-white"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
