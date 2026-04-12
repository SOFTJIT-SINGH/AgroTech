import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";
import * as Location from "expo-location";
import { useUserStore } from "../store/userStore";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";

import AuthNavigator from "../screens/Auth/AuthNavigator";

import DetectScreen from "../screens/CropDetection/DetectScreen";
import WeatherAdviceScreen from "../screens/WeatherAdvice/WeatherAdviceScreen";
import FertilizerScreen from "../screens/FertilizerPlan/FertilizerScreen";
import CropSuggestionScreen from "../screens/BestCrop/CropSuggestionScreen";
import SowingPredictionScreen from "../screens/SowingPrediction/SowingPredictionScreen";
import BlogDetailsScreen from "@/screens/Blogs/BlogDetailsScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import HistoryScreen from "../screens/Profile/HistoryScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const handleInitialLogin = async (currentSession: Session | null) => {
    if (currentSession) {
      // Ask for location permission the moment they open the app
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        // Pre-fetch the weather so the Home Screen doesn't show loading states!
        useUserStore.getState().fetchWeather();
      }
    }
  };

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      handleInitialLogin(session);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === "SIGNED_IN") {
        handleInitialLogin(session); // <-- Trigger here
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#020617" }}>
        <ActivityIndicator size="large" color="#34d399" />
      </View>
    );
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session && session.user ? (
        // User is LOGGED IN -> Show Main App
        <>
          <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
          <Stack.Screen name="DetectCrop" component={DetectScreen} />
          <Stack.Screen name="WeatherAdvice" component={WeatherAdviceScreen} />
          <Stack.Screen name="FertilizerPlan" component={FertilizerScreen} />
          <Stack.Screen name="CropSuggestion" component={CropSuggestionScreen} />
          <Stack.Screen name="SowingPrediction" component={SowingPredictionScreen} />
          <Stack.Screen name="BlogDetails" component={BlogDetailsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </>
      ) : (
        
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}