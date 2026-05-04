import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DynamicButton from '../../components/DynamicButton';
import { supabase } from '../../services/supabase';

export default function LoginScreen({ navigation }: any) {
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
    }
    // Session change is detected by AppNavigator's onAuthStateChange listener.
    // No manual navigation needed — the conditional navigator swaps automatically.
  };

  return (
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-8 pb-12 pt-16 relative">
            
            {/* Ambient Background Glow */}
            <View className="absolute top-0 right-0 w-64 h-64 bg-agro-green-500/10 rounded-full blur-3xl" />
            <View className="absolute bottom-10 -left-10 w-48 h-48 bg-agro-accent-500/10 rounded-full blur-3xl" />

            <View className="mb-10 items-center drop-shadow-2xl z-10">
              <View className="w-24 h-24 bg-white rounded-3xl items-center justify-center mb-6 border border-agro-earth-100 shadow-xl shadow-agro-green-950/5 rotate-3">
                <Text className="text-5xl">🌾</Text>
              </View>
              <Text className="text-5xl font-black text-agro-green-950 tracking-tight text-center">
                Agro<Text className="text-agro-green-600">Tech</Text>
              </Text>
              <Text className="text-agro-earth-500 text-sm mt-3 font-bold tracking-wide uppercase">
                Smart Farming Platform
              </Text>
            </View>

            <View className="bg-white rounded-3xl p-8 border border-agro-earth-100 z-10 shadow-xl shadow-agro-green-950/5">
              <Text className="text-2xl font-bold text-agro-green-950 mb-8 antialiased">
                Welcome Back
              </Text>

              <View className="mb-5">
                <Text className="text-xs font-bold text-agro-earth-500 mb-2 ml-1 uppercase tracking-wider">Email or Phone</Text>
                <TextInput
                  placeholder="Enter your email or phone"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholderTextColor="#bab194"
                  className="bg-agro-earth-50 border border-agro-earth-100 text-agro-green-950 p-4 rounded-2xl text-base focus:border-agro-green-500 transition-colors"
                />
              </View>

              <View className="mb-8">
                <Text className="text-xs font-bold text-agro-earth-500 mb-2 ml-1 uppercase tracking-wider">Password</Text>
                <TextInput
                  placeholder="Enter your password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#bab194"
                  className="bg-agro-earth-50 border border-agro-earth-100 text-agro-green-950 p-4 rounded-2xl text-base focus:border-agro-green-500 transition-colors"
                />
                <Pressable 
                  onPress={() => navigation.navigate('ForgotPassword')}
                  className="mt-4 self-end active:opacity-70"
                >
                  <Text className="text-agro-green-600 font-bold text-sm">Forgot Password?</Text>
                </Pressable>
              </View>

              <DynamicButton
                title="Secure Login"
                onPress={handleLogin}
                loading={loading}
                className="w-full mb-6 py-4 rounded-2xl bg-agro-green-600 shadow-lg shadow-agro-green-700/20"
                textClassName="text-white font-black"
              />

              <View className="flex-row items-center justify-center mt-2">
                <Text className="text-agro-earth-500 font-bold">New to AgroTech? </Text>
                <Pressable onPress={() => navigation.navigate('Signup')} className="p-1 active:opacity-70">
                  <Text className="text-agro-green-700 font-black text-base">Create Account</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}