import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DynamicButton from '../../components/DynamicButton';
import { supabase } from '../../services/supabase';

export default function OtpScreen({ navigation, route }: any) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const email = route?.params?.email;

  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert("Error", "Please enter the 6-digit verification code.");
      return;
    }
    
    setLoading(true);
    
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup',
      
    });

    setLoading(false);

    if (error) {
      Alert.alert("Verification Failed", error.message);
    } else {
      Alert.alert(
        "Welcome to AgroTech! 🎉",
        "Your account has been verified successfully. We are excited to have you join our farming community.",
        [{ text: "Get Started" }]
      );
    }
    // On success, session is set automatically →
    // AppNavigator's onAuthStateChange detects it and swaps to Main
  };

  const handleResend = async () => {
    if (!email) return;
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Code Sent", "A new verification code has been sent to your email.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-8 pb-12 pt-10 relative">
            
            {/* Ambient Background Glow */}
            <View className="absolute top-10 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <View className="absolute bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

            <View className="mb-10 items-center drop-shadow-2xl z-10">
              <Text className="text-4xl font-black text-white tracking-widest text-center shadow-sm">
                Verification
              </Text>
              <Text className="text-slate-400 text-base mt-2 font-medium tracking-wide text-center px-6 leading-7">
                We've sent a 6-digit code to{'\n'}
                <Text className="text-emerald-400 font-bold">{email || 'your email'}</Text>
              </Text>
            </View>

            <View className="bg-slate-900/80 rounded-[32px] p-8 shadow-2xl border border-slate-800 z-10">
              <Text className="text-2xl font-bold text-white mb-6 antialiased text-center">
                Enter OTP
              </Text>

              <View className="mb-8 items-center">
                <TextInput
                  placeholder="• • • • • •"
                  keyboardType="numeric"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                  placeholderTextColor="#64748b"
                  className="bg-slate-950 border border-slate-800 text-white p-4 rounded-2xl text-2xl tracking-[0.5em] text-center w-full shadow-sm focus:border-emerald-500 transition-colors"
                />
                <Pressable onPress={handleResend} className="mt-4 active:opacity-70">
                  <Text className="text-emerald-400 font-semibold text-sm">Resend OTP</Text>
                </Pressable>
              </View>

              <DynamicButton
                title="Verify & Proceed"
                onPress={handleVerify}
                loading={loading}
                className="w-full mb-4 py-5 rounded-2xl bg-emerald-600"
                textClassName="text-white"
              />

              <View className="flex-row items-center justify-center mt-2">
                <Pressable onPress={() => navigation.goBack()} className="p-1 active:opacity-70">
                  <Text className="text-slate-400 font-bold text-base">Back to Login</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}