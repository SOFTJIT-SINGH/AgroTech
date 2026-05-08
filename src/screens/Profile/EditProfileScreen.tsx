import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
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

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not logged in");

      // 1. Update public.profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name.trim(),
          phone: formData.phone.trim(),
          farm_location: formData.location.trim(),
          farm_size: formData.farmSize.trim(),
          primary_crop: formData.mainCrop.trim(),
          farming_experience: formData.farmingExperience.trim(),
          preferred_language: formData.preferredLanguage.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (profileError) throw profileError;

      // 2. Also update auth.user_metadata for session consistency
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.name.trim(),
          phone: formData.phone.trim(),
        }
      });
      
      if (authError) throw authError;

      // 3. Update local Zustand store
      updateProfile(formData);

      setLoading(false);
      Alert.alert("Success", "Profile updated successfully.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      setLoading(false);
      Alert.alert("Error", err.message || "Something went wrong while saving.");
      console.log("EditProfile save error:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="px-6 py-5 border-b border-agro-earth-100 flex-row items-center bg-white shadow-sm">
          <Pressable 
            onPress={() => navigation.goBack()} 
            className="mr-4 p-2 bg-agro-earth-50 rounded-full border border-agro-earth-100 active:scale-90 transition-all"
          >
            <Ionicons name="arrow-back" size={22} color="#3e8e3e" />
          </Pressable>
          <View>
            <Text className="text-2xl font-extrabold text-agro-green-950 tracking-tight">Edit <Text className="text-agro-green-600">Profile</Text></Text>
            <Text className="text-agro-earth-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Your Information</Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <View className="mb-6">
            <Text className="text-agro-earth-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Full Name</Text>
            <TextInput
              value={formData.name}
              onChangeText={(t) => setFormData({ ...formData, name: t })}
              className="bg-white border border-agro-earth-100 rounded-[20px] px-5 py-4 text-agro-green-950 font-bold text-base shadow-sm"
              placeholderTextColor="#bab194"
              placeholder="Your name"
            />
          </View>

          <View className="mb-6">
            <Text className="text-agro-earth-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Phone</Text>
            <TextInput
              value={formData.phone}
              onChangeText={(t) => setFormData({ ...formData, phone: t })}
              className="bg-white border border-agro-earth-100 rounded-[20px] px-5 py-4 text-agro-green-950 font-bold text-base shadow-sm"
              placeholderTextColor="#bab194"
              keyboardType="phone-pad"
              placeholder="+91 0000000000"
            />
          </View>

          <View className="mb-6">
            <Text className="text-agro-earth-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Farm Location</Text>
            <TextInput
              value={formData.location}
              onChangeText={(t) => setFormData({ ...formData, location: t })}
              className="bg-white border border-agro-earth-100 rounded-[20px] px-5 py-4 text-agro-green-950 font-bold text-base shadow-sm"
              placeholderTextColor="#bab194"
              placeholder="e.g. Punjab"
            />
          </View>

          <View className="flex-row mb-6">
            <View className="flex-1 mr-3">
              <Text className="text-agro-earth-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Farm Size</Text>
              <TextInput
                value={formData.farmSize}
                onChangeText={(t) => setFormData({ ...formData, farmSize: t })}
                className="bg-white border border-agro-earth-100 rounded-[20px] px-5 py-4 text-agro-green-950 font-bold text-base shadow-sm"
                placeholderTextColor="#bab194"
                placeholder="e.g. 5 Acres"
              />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-agro-earth-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Main Crop</Text>
              <TextInput
                value={formData.mainCrop}
                onChangeText={(t) => setFormData({ ...formData, mainCrop: t })}
                className="bg-white border border-agro-earth-100 rounded-[20px] px-5 py-4 text-agro-green-950 font-bold text-base shadow-sm"
                placeholderTextColor="#bab194"
                placeholder="e.g. Wheat"
              />
            </View>
          </View>

          <View className="flex-row mb-6">
            <View className="flex-1 mr-3">
              <Text className="text-agro-earth-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Experience</Text>
              <TextInput
                value={formData.farmingExperience}
                onChangeText={(t) => setFormData({ ...formData, farmingExperience: t })}
                className="bg-white border border-agro-earth-100 rounded-[20px] px-5 py-4 text-agro-green-950 font-bold text-base shadow-sm"
                placeholderTextColor="#bab194"
                placeholder="e.g. 3 years"
              />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-agro-earth-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Language</Text>
              <TextInput
                value={formData.preferredLanguage}
                onChangeText={(t) => setFormData({ ...formData, preferredLanguage: t })}
                className="bg-white border border-agro-earth-100 rounded-[20px] px-5 py-4 text-agro-green-950 font-bold text-base shadow-sm"
                placeholderTextColor="#bab194"
                placeholder="e.g. Punjabi"
              />
            </View>
          </View>

          {/* Info tip */}
          <View className="bg-agro-green-50 rounded-[24px] p-5 mb-10 border border-agro-green-100 flex-row items-center">
            <View className="w-10 h-10 bg-white rounded-full items-center justify-center border border-agro-green-200 mr-4">
              <Ionicons name="sparkles" size={18} color="#2d722d" />
            </View>
            <Text className="text-agro-green-800 text-[11px] leading-5 flex-1 font-bold">
              Providing accurate details helps our AI offer better crop advice and weather insights tailored to your farm.
            </Text>
          </View>

          <DynamicButton
            title="SAVE PROFILE"
            onPress={handleSave}
            loading={loading}
            className="mb-16 rounded-[20px] bg-agro-green-600 h-16 shadow-lg shadow-agro-green-700/20"
            textClassName="text-white font-black tracking-widest"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
