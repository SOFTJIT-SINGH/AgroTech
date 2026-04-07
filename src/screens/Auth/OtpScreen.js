// src/screens/Auth/OtpScreen.js

import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OtpScreen({ navigation }) {

  return (
    <SafeAreaView className="flex-1 bg-[#F1F8E9] justify-center px-6">

      <Text className="text-2xl font-bold text-green-900 mb-2">
        OTP Verification
      </Text>

      <Text className="text-gray-500 mb-6">
        Enter the OTP sent to your phone
      </Text>

      <TextInput
        placeholder="Enter OTP"
        keyboardType="numeric"
        className="bg-white p-4 rounded-xl mb-4 shadow text-center text-lg"
      />

      <Pressable
        onPress={() => navigation.replace("MainTabs")}
        className="bg-green-700 p-4 rounded-xl items-center"
      >

        <Text className="text-white font-bold">
          Verify OTP
        </Text>

      </Pressable>

      <Pressable className="mt-4 items-center">

        <Text className="text-green-700">
          Resend OTP
        </Text>

      </Pressable>

    </SafeAreaView>
  );
}