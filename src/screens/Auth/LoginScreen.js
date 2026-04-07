// src/screens/Auth/LoginScreen.js

import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen({ navigation }) {

  return (
    <SafeAreaView className="flex-1 bg-[#F1F8E9] justify-center px-6">

      <Text className="text-3xl font-bold text-green-900 mb-2">
        AgroTech
      </Text>

      <Text className="text-gray-500 mb-6">
        Smart Farming Platform
      </Text>

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        className="bg-white p-4 rounded-xl mb-4 shadow"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        className="bg-white p-4 rounded-xl mb-4 shadow"
      />

      <Pressable
        onPress={() => navigation.navigate("Otp")}
        className="bg-green-700 p-4 rounded-xl items-center"
      >

        <Text className="text-white font-bold">
          Login
        </Text>

      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Signup")}
        className="mt-4 items-center"
      >

        <Text className="text-green-700">
          Create new account
        </Text>

      </Pressable>

    </SafeAreaView>
  );
}