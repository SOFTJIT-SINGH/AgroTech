import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DynamicButton from '../../components/DynamicButton';
import { supabase } from '../../services/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: 'agrotech://reset-password',
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-8 pb-12 pt-16 relative">
            
            {/* Ambient Background Glow */}
            <View className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <View className="absolute bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

            {/* Back Button */}
            <Pressable 
              onPress={() => navigation.goBack()} 
              className="absolute top-16 left-8 z-20 bg-slate-900 p-3 rounded-2xl border border-slate-800 active:scale-95"
            >
              <Ionicons name="arrow-back" size={22} color="#34d399" />
            </Pressable>

            {sent ? (
              /* SUCCESS STATE */
              <View className="items-center z-10">
                <View className="w-24 h-24 bg-emerald-500/15 rounded-full items-center justify-center mb-6 border border-emerald-500/20">
                  <Ionicons name="mail-open-outline" size={44} color="#34d399" />
                </View>
                <Text className="text-3xl font-black text-white tracking-tight text-center mb-3">
                  Check Your Email
                </Text>
                <Text className="text-slate-400 text-base text-center leading-7 px-4 mb-8">
                  We've sent a password reset link to{'\n'}
                  <Text className="text-emerald-400 font-bold">{email}</Text>
                </Text>
                <Text className="text-slate-500 text-sm text-center leading-6 px-6 mb-10">
                  Click the link in the email to reset your password. If you don't see it, check your spam folder.
                </Text>

                <DynamicButton
                  title="Back to Login"
                  onPress={() => navigation.navigate('Login')}
                  className="w-full py-4 rounded-2xl bg-emerald-600"
                  textClassName="text-white"
                />
              </View>
            ) : (
              /* INPUT STATE */
              <View className="z-10">
                <View className="mb-10 items-center drop-shadow-2xl">
                  <View className="w-20 h-20 bg-slate-900 rounded-3xl items-center justify-center mb-6 border border-slate-800 shadow-lg shadow-emerald-900/20">
                    <Ionicons name="key-outline" size={36} color="#34d399" />
                  </View>
                  <Text className="text-4xl font-black text-white tracking-tight text-center">
                    Forgot Password?
                  </Text>
                  <Text className="text-slate-400 text-sm mt-3 font-medium tracking-wide text-center px-4 leading-6">
                    Enter the email linked to your account and we'll send you a reset link.
                  </Text>
                </View>

                <View className="bg-slate-900/80 rounded-3xl p-8 border border-slate-800">
                  <View className="mb-8">
                    <Text className="text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Email Address</Text>
                    <TextInput
                      placeholder="Enter your registered email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                      placeholderTextColor="#64748b"
                      className="bg-slate-950 border border-slate-800 text-white p-4 rounded-2xl text-base focus:border-emerald-500 transition-colors"
                    />
                  </View>

                  <DynamicButton
                    title="Send Reset Link"
                    onPress={handleReset}
                    loading={loading}
                    className="w-full mb-6 py-4 rounded-2xl bg-emerald-600"
                    textClassName="text-white"
                  />

                  <View className="flex-row items-center justify-center mt-2">
                    <Pressable onPress={() => navigation.navigate('Login')} className="p-1 active:opacity-70">
                      <Text className="text-slate-400 font-bold text-base">Back to Login</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
