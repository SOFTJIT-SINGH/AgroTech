import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DynamicButton from '../../components/DynamicButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Otp: undefined;
};

// MainTabs is in AppNavigator, so we replace instead of navigate. 
// Let's type it loosely for now
type Props = NativeStackScreenProps<AuthStackParamList, 'Otp'> & { navigation: any };

export default function OtpScreen({ navigation }: Props) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainDrawer');
    }, 1000);
  };

  return (
    <LinearGradient
      colors={['#1b4332', '#2d6a4f', '#40916c']}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View className="flex-1 justify-center px-8 pb-12 pt-10">
              <View className="mb-10 items-center drop-shadow-2xl">
                <Text className="text-4xl font-black text-white tracking-widest text-center shadow-sm">
                  Verification
                </Text>
                <Text className="text-green-100 text-lg mt-2 font-medium tracking-wide text-center">
                  We've sent a 6-digit code to your phone.
                </Text>
              </View>

              <View className="bg-white/95 rounded-3xl p-8 shadow-2xl border border-white/40">
                <Text className="text-2xl font-bold text-gray-800 mb-6 antialiased text-center">
                  Enter OTP
                </Text>

                <View className="mb-8 items-center">
                  <TextInput
                    placeholder="• • • • • •"
                    keyboardType="numeric"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                    placeholderTextColor="#9CA3AF"
                    className="bg-gray-50 border border-gray-200 text-gray-800 p-4 rounded-2xl text-2xl tracking-[0.5em] text-center w-full shadow-sm focus:border-green-600 focus:bg-white transition-colors"
                  />
                  <Pressable className="mt-4">
                    <Text className="text-green-700 font-semibold text-sm">Resend OTP</Text>
                  </Pressable>
                </View>

                <DynamicButton
                  title="Verify & Proceed"
                  onPress={handleVerify}
                  loading={loading}
                  className="w-full mb-4 py-5 rounded-2xl"
                />

                <View className="flex-row items-center justify-center mt-2">
                  <Pressable onPress={() => navigation.goBack()} className="p-1">
                    <Text className="text-gray-500 font-bold text-base">Back to Login</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}