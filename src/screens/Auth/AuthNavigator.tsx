// src/navigation/AuthNavigator.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";
import OtpScreen from "./OtpScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="Signup" component={SignupScreen} />

      <Stack.Screen name="Otp" component={OtpScreen} />

      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

    </Stack.Navigator>
  );
}