import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DynamicButton from '../../components/DynamicButton';
import { supabase } from '../../services/supabase';

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
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <Pressable onPress={() => navigation.goBack()} className="mr-4 p-2 bg-slate-900 rounded-2xl border border-slate-800 active:scale-95">
            <Ionicons name="arrow-back" size={22} color="#34d399" />
          </Pressable>
          <Text className="text-2xl font-extrabold text-white tracking-tight">
            Change <Text className="text-emerald-400">Password</Text>
          </Text>
        </View>

        {/* Info Card */}
        <View className="bg-slate-900/80 rounded-[28px] p-5 mb-6 border border-slate-800 flex-row items-start">
          <Ionicons name="shield-checkmark-outline" size={22} color="#34d399" style={{ marginTop: 2, marginRight: 12 }} />
          <Text className="text-slate-400 text-sm leading-6 flex-1 font-medium">
            For security, please enter your current password first, then create a new one with at least 6 characters.
          </Text>
        </View>

        {/* Current Password */}
        <View className="mb-5">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Current Password</Text>
          <View className="relative">
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrent}
              placeholder="Enter current password"
              placeholderTextColor="#64748b"
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium pr-14"
            />
            <Pressable 
              onPress={() => setShowCurrent(!showCurrent)} 
              className="absolute right-4 top-4"
            >
              <Ionicons name={showCurrent ? "eye-off-outline" : "eye-outline"} size={22} color="#64748b" />
            </Pressable>
          </View>
        </View>

        {/* Divider */}
        <View className="h-px bg-slate-800 mx-4 mb-5" />

        {/* New Password */}
        <View className="mb-5">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">New Password</Text>
          <View className="relative">
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
              placeholder="Min 6 characters"
              placeholderTextColor="#64748b"
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium pr-14"
            />
            <Pressable 
              onPress={() => setShowNew(!showNew)} 
              className="absolute right-4 top-4"
            >
              <Ionicons name={showNew ? "eye-off-outline" : "eye-outline"} size={22} color="#64748b" />
            </Pressable>
          </View>
        </View>

        {/* Confirm New Password */}
        <View className="mb-8">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Confirm New Password</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Re-enter new password"
            placeholderTextColor="#64748b"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-medium"
          />
        </View>

        {/* Password Strength Indicator */}
        {newPassword.length > 0 && (
          <View className="bg-slate-900 rounded-2xl p-4 border border-slate-800 mb-8">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Password Strength</Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Ionicons 
                  name={newPassword.length >= 6 ? "checkmark-circle" : "close-circle"} 
                  size={18} 
                  color={newPassword.length >= 6 ? "#34d399" : "#64748b"} 
                />
                <Text className={`ml-2 text-sm font-medium ${newPassword.length >= 6 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  At least 6 characters
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons 
                  name={/[A-Z]/.test(newPassword) ? "checkmark-circle" : "close-circle"} 
                  size={18} 
                  color={/[A-Z]/.test(newPassword) ? "#34d399" : "#64748b"} 
                />
                <Text className={`ml-2 text-sm font-medium ${/[A-Z]/.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'}`}>
                  Contains uppercase letter
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons 
                  name={/[0-9]/.test(newPassword) ? "checkmark-circle" : "close-circle"} 
                  size={18} 
                  color={/[0-9]/.test(newPassword) ? "#34d399" : "#64748b"} 
                />
                <Text className={`ml-2 text-sm font-medium ${/[0-9]/.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'}`}>
                  Contains a number
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons 
                  name={newPassword === confirmPassword && confirmPassword.length > 0 ? "checkmark-circle" : "close-circle"} 
                  size={18} 
                  color={newPassword === confirmPassword && confirmPassword.length > 0 ? "#34d399" : "#64748b"} 
                />
                <Text className={`ml-2 text-sm font-medium ${newPassword === confirmPassword && confirmPassword.length > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
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
          className="mb-12 rounded-2xl bg-emerald-600"
          textClassName="text-white"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
