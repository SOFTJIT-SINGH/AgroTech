import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import DynamicButton from '../../components/DynamicButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '../../services/supabase';
import { Alert } from 'react-native';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Otp: { email: string };
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Please enter your email/phone and password.");
      return;
    }

    setLoading(true);
    
    const isEmail = identifier.includes('@');
    const credentials = isEmail 
      ? { email: identifier.trim(), password }
      : { phone: identifier.trim(), password };

    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error.message);
    } else {
      // Force replace to drawer
      navigation.replace('MainDrawer' as any);
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

            <View className="mb-10 items-center drop-shadow-2xl z-10">
              <View className="w-24 h-24 bg-slate-900 rounded-3xl items-center justify-center mb-6 border border-slate-800 shadow-lg shadow-emerald-900/20 rotate-3">
                <Text className="text-5xl">🌾</Text>
              </View>
              <Text className="text-5xl font-black text-white tracking-tight text-center">
                Agro<Text className="text-emerald-400">Tech</Text>
              </Text>
              <Text className="text-slate-400 text-sm mt-3 font-medium tracking-wide uppercase">
                Smart Farming Platform
              </Text>
            </View>

            <View className="bg-slate-900/80 rounded-3xl p-8 border border-slate-800 z-10">
              <Text className="text-2xl font-bold text-white mb-8 antialiased">
                Welcome Back
              </Text>

              <View className="mb-5">
                <Text className="text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Email or Phone</Text>
                <TextInput
                  placeholder="Enter your email or phone"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholderTextColor="#64748b"
                  className="bg-slate-950 border border-slate-800 text-white p-4 rounded-2xl text-base focus:border-emerald-500 transition-colors"
                />
              </View>

              <View className="mb-8">
                <Text className="text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Password</Text>
                <TextInput
                  placeholder="Enter your password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#64748b"
                  className="bg-slate-950 border border-slate-800 text-white p-4 rounded-2xl text-base focus:border-emerald-500 transition-colors"
                />
                <Pressable className="mt-4 self-end active:opacity-70">
                  <Text className="text-emerald-400 font-semibold text-sm">Forgot Password?</Text>
                </Pressable>
              </View>

              <DynamicButton
                title="Secure Login"
                onPress={handleLogin}
                loading={loading}
                className="w-full mb-6 py-4 rounded-2xl bg-emerald-600"
                textClassName="text-white"
              />

              <View className="flex-row items-center justify-center mt-2">
                <Text className="text-slate-400 font-medium">New to AgroTech? </Text>
                <Pressable onPress={() => navigation.navigate('Signup')} className="p-1 active:opacity-70">
                  <Text className="text-emerald-400 font-bold text-base">Create Account</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}