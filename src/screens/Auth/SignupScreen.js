// src/screens/Auth/SignupScreen.js

import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupScreen({ navigation }) {

  return (
    <SafeAreaView className="flex-1 bg-[#F1F8E9] justify-center px-6">

      <Text className="text-3xl font-bold text-green-900 mb-6">
        Create Account
      </Text>

      <TextInput
        placeholder="Full Name"
        className="bg-white p-4 rounded-xl mb-4 shadow"
      />

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
          Signup
        </Text>

      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Login")}
        className="mt-4 items-center"
      >

        <Text className="text-green-700">
          Already have account?
        </Text>

      </Pressable>

    </SafeAreaView>
  );
}