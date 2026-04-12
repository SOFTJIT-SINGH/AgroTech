import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/userStore';
import DynamicButton from '../../components/DynamicButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export default function EditProfileScreen({ navigation }: any) {
  const { name, phone, location, farmSize, mainCrop, updateProfile } = useUserStore();
  
  const [formData, setFormData] = useState({
    name,
    phone,
    location,
    farmSize,
    mainCrop,
  });

  const handleSave = () => {
    updateProfile(formData);
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-extrabold text-white tracking-tight mb-8">
          Edit <Text className="text-emerald-400">Profile</Text>
        </Text>

        <View className="mb-4">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Name</Text>
          <TextInput
            value={formData.name}
            onChangeText={(t) => setFormData({ ...formData, name: t })}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium"
            placeholderTextColor="#64748b"
          />
        </View>

        <View className="mb-4">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Phone</Text>
          <TextInput
            value={formData.phone}
            onChangeText={(t) => setFormData({ ...formData, phone: t })}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium"
            placeholderTextColor="#64748b"
            keyboardType="phone-pad"
          />
        </View>

        <View className="mb-4">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Location</Text>
          <TextInput
            value={formData.location}
            onChangeText={(t) => setFormData({ ...formData, location: t })}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium"
            placeholderTextColor="#64748b"
          />
        </View>

        <View className="mb-4">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Farm Size</Text>
          <TextInput
            value={formData.farmSize}
            onChangeText={(t) => setFormData({ ...formData, farmSize: t })}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium"
            placeholderTextColor="#64748b"
          />
        </View>

        <View className="mb-8">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Main Crop</Text>
          <TextInput
            value={formData.mainCrop}
            onChangeText={(t) => setFormData({ ...formData, mainCrop: t })}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium"
            placeholderTextColor="#64748b"
          />
        </View>

        <DynamicButton
          title="SAVE CHANGES"
          onPress={handleSave}
          className="mb-12 rounded-2xl bg-emerald-600"
          textClassName="text-white"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
