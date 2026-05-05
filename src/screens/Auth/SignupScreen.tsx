import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DynamicButton from '../../components/DynamicButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '../../services/supabase';
import { Alert } from 'react-native';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Otp: { email: string };
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (!formData.fullName.trim()) {
      Alert.alert("Error", "Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert("Error", "Email address is required.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
        }
      }
    });

    if (error) {
      setLoading(false);
      Alert.alert("Signup Failed", error.message);
      return;
    }

    setLoading(false);

    Alert.alert(
      "Verify Your Email",
      "We've sent a 6-digit verification code to your email. Please verify to continue.",
      [{ text: "OK", onPress: () => navigation.navigate('Otp', { email: formData.email.trim() }) }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-6 pt-10 relative">
            
            {/* Ambient Background Glow */}
            <View className="absolute top-10 right-0 w-64 h-64 bg-agro-green-500/10 rounded-full blur-3xl" />
            <View className="absolute bottom-20 -left-10 w-48 h-48 bg-agro-accent-500/10 rounded-full blur-3xl" />

            <View className="mb-8 items-center drop-shadow-2xl z-10">
              <Text className="text-4xl font-black text-agro-green-950 tracking-wide text-center">
                Join Agro<Text className="text-agro-green-600">Tech</Text>
              </Text>
              <Text className="text-agro-earth-500 text-sm mt-2 font-bold tracking-widest uppercase">
                Empowering your farming journey
              </Text>
            </View>

            <View className="bg-white rounded-[32px] p-6 border border-agro-earth-100 shadow-xl shadow-agro-green-950/5 z-10">
              <Text className="text-2xl font-bold text-agro-green-950 mb-6 antialiased">
                Create Account
              </Text>

              <View className="space-y-4 mb-2">
                <View>
                  <Text className="text-xs font-bold text-agro-earth-500 mb-2 ml-1 uppercase tracking-wider">Full Name</Text>
                  <TextInput
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChangeText={(val) => updateField('fullName', val)}
                    placeholderTextColor="#bab194"
                    className="bg-agro-earth-50 border border-agro-earth-100 text-agro-green-950 p-4 rounded-2xl text-base focus:border-agro-green-500 transition-colors"
                  />
                </View>

                <View>
                  <Text className="text-xs font-bold text-agro-earth-500 mb-2 ml-1 uppercase tracking-wider">Email Address</Text>
                  <TextInput
                    placeholder="e.g. farmer@agrotech.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(val) => updateField('email', val)}
                    placeholderTextColor="#bab194"
                    className="bg-agro-earth-50 border border-agro-earth-100 text-agro-green-950 p-4 rounded-2xl text-base focus:border-agro-green-500 transition-colors"
                  />
                </View>

                <View>
                  <Text className="text-xs font-bold text-agro-earth-500 mb-2 ml-1 uppercase tracking-wider">Phone Number</Text>
                  <TextInput
                    placeholder="e.g. +91 9876543210"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(val) => updateField('phone', val)}
                    placeholderTextColor="#bab194"
                    className="bg-agro-earth-50 border border-agro-earth-100 text-agro-green-950 p-4 rounded-2xl text-base focus:border-agro-green-500 transition-colors"
                  />
                </View>

                <View>
                  <Text className="text-xs font-bold text-agro-earth-500 mb-2 ml-1 uppercase tracking-wider">Password</Text>
                  <TextInput
                    placeholder="Create a strong password"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(val) => updateField('password', val)}
                    placeholderTextColor="#bab194"
                    className="bg-agro-earth-50 border border-agro-earth-100 text-agro-green-950 p-4 rounded-2xl text-base focus:border-agro-green-500 transition-colors"
                  />
                </View>

                <View>
                  <Text className="text-xs font-bold text-agro-earth-500 mb-2 ml-1 uppercase tracking-wider">Confirm Password</Text>
                  <TextInput
                    placeholder="Confirm your password"
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(val) => updateField('confirmPassword', val)}
                    placeholderTextColor="#bab194"
                    className="bg-agro-earth-50 border border-agro-earth-100 text-agro-green-950 p-4 rounded-2xl text-base focus:border-agro-green-500 transition-colors"
                  />
                </View>
              </View>

              <DynamicButton
                title="Create Account"
                onPress={handleSignup}
                loading={loading}
                className="w-full mt-8 mb-4 py-4 rounded-2xl bg-agro-green-600 shadow-lg shadow-agro-green-700/20"
                textClassName="text-white font-black"
              />

              <View className="flex-row items-center justify-center mt-2">
                <Text className="text-agro-earth-500 font-bold">Already have an account? </Text>
                <Pressable onPress={() => navigation.navigate('Login')} className="p-1 active:opacity-70">
                  <Text className="text-agro-green-700 font-black text-base">Login Here</Text>
                </Pressable>
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
