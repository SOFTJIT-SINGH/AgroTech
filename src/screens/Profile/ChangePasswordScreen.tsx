import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DynamicButton from '../../components/DynamicButton';
import { supabase } from '../../services/supabase';

import { KeyboardAvoidingView, Platform } from 'react-native';

export default function ChangePasswordScreen({ navigation }: any) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      Alert.alert("Error", "New password must be different from the current one.");
      return;
    }

    setLoading(true);

    // Step 1: Verify current password by attempting re-auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email) {
      setLoading(false);
      Alert.alert("Error", "Unable to retrieve your account. Please log in again.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: currentPassword,
    });

    if (signInError) {
      setLoading(false);
      Alert.alert("Error", "Current password is incorrect.");
      return;
    }

    // Step 2: Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Success",
        "Your password has been updated successfully.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
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
            <Text className="text-2xl font-extrabold text-agro-green-950 tracking-tight">Change <Text className="text-agro-green-600">Password</Text></Text>
            <Text className="text-agro-earth-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Secure your account</Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          {/* Info Card */}
          <View className="bg-agro-green-50 rounded-[32px] p-6 mb-8 border border-agro-green-100 flex-row items-center shadow-sm">
            <View className="w-10 h-10 bg-white rounded-full items-center justify-center border border-agro-green-200 mr-4">
              <Ionicons name="shield-checkmark" size={20} color="#2d722d" />
            </View>
            <Text className="text-agro-green-800 text-[11px] leading-5 flex-1 font-bold">
              For security, enter your current password first, then create a new one with at least 6 characters.
            </Text>
          </View>

          {/* Current Password */}
          <View className="mb-6">
            <Text className="text-agro-earth-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Current Password</Text>
            <View className="relative">
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrent}
                placeholder="Enter current password"
                placeholderTextColor="#bab194"
                className="bg-white border border-agro-earth-100 rounded-[20px] px-5 py-4 text-agro-green-950 font-bold text-base shadow-sm pr-14"
              />
              <Pressable 
                onPress={() => setShowCurrent(!showCurrent)} 
                className="absolute right-5 top-4"
              >
                <Ionicons name={showCurrent ? "eye-off" : "eye"} size={22} color="#bab194" />
              </Pressable>
            </View>
          </View>

          {/* Divider */}
          <View className="flex-row items-center mb-6 px-4">
            <View className="flex-1 h-px bg-agro-earth-100" />
            <Text className="mx-4 text-[10px] font-black text-agro-earth-400 uppercase tracking-widest">New Password</Text>
            <View className="flex-1 h-px bg-agro-earth-100" />
          </View>

          {/* New Password */}
          <View className="mb-6">
            <Text className="text-agro-earth-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">New Password</Text>
            <View className="relative">
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNew}
                placeholder="Min 6 characters"
                placeholderTextColor="#bab194"
                className="bg-white border border-agro-earth-100 rounded-[20px] px-5 py-4 text-agro-green-950 font-bold text-base shadow-sm pr-14"
              />
              <Pressable 
                onPress={() => setShowNew(!showNew)} 
                className="absolute right-5 top-4"
              >
                <Ionicons name={showNew ? "eye-off" : "eye"} size={22} color="#bab194" />
              </Pressable>
            </View>
          </View>

          {/* Confirm New Password */}
          <View className="mb-10">
            <Text className="text-agro-earth-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Confirm New Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Re-enter new password"
              placeholderTextColor="#bab194"
              className="bg-white border border-agro-earth-100 rounded-[20px] px-5 py-4 text-agro-green-950 font-bold text-base shadow-sm"
            />
          </View>

          {/* Password Strength Indicator */}
          {newPassword.length > 0 && (
            <View className="bg-white rounded-[32px] p-6 border border-agro-earth-100 mb-10 shadow-sm">
              <Text className="text-agro-earth-500 text-[10px] font-black uppercase tracking-widest mb-4 ml-1">Password Strength</Text>
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Ionicons 
                    name={newPassword.length >= 6 ? "checkmark-circle" : "close-circle"} 
                    size={18} 
                    color={newPassword.length >= 6 ? "#3e8e3e" : "#bab194"} 
                  />
                  <Text className={`ml-3 text-sm font-bold ${newPassword.length >= 6 ? 'text-agro-green-700' : 'text-agro-earth-400'}`}>
                    At least 6 characters
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons 
                    name={/[A-Z]/.test(newPassword) ? "checkmark-circle" : "close-circle"} 
                    size={18} 
                    color={/[A-Z]/.test(newPassword) ? "#3e8e3e" : "#bab194"} 
                  />
                  <Text className={`ml-3 text-sm font-bold ${/[A-Z]/.test(newPassword) ? 'text-agro-green-700' : 'text-agro-earth-400'}`}>
                    Contains uppercase letter
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons 
                    name={/[0-9]/.test(newPassword) ? "checkmark-circle" : "close-circle"} 
                    size={18} 
                    color={/[0-9]/.test(newPassword) ? "#3e8e3e" : "#bab194"} 
                  />
                  <Text className={`ml-3 text-sm font-bold ${/[0-9]/.test(newPassword) ? 'text-agro-green-700' : 'text-agro-earth-400'}`}>
                    Contains a number
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons 
                    name={newPassword === confirmPassword && confirmPassword.length > 0 ? "checkmark-circle" : "close-circle"} 
                    size={18} 
                    color={newPassword === confirmPassword && confirmPassword.length > 0 ? "#3e8e3e" : "#bab194"} 
                  />
                  <Text className={`ml-3 text-sm font-bold ${newPassword === confirmPassword && confirmPassword.length > 0 ? 'text-agro-green-700' : 'text-agro-earth-400'}`}>
                    Passwords match
                  </Text>
                </View>
              </View>
            </View>
          )}

          <DynamicButton
            title="UPDATE PASSWORD"
            onPress={handleChangePassword}
            loading={loading}
            className="mb-16 rounded-[20px] bg-agro-green-600 h-16 shadow-lg shadow-agro-green-700/20"
            textClassName="text-white font-black tracking-widest"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
