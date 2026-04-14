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
import BlogDetailsScreen from "../screens/Blogs/BlogDetailsScreen";
import CreateBlogScreen from "../screens/Blogs/CreateBlogScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import HistoryScreen from "../screens/Profile/HistoryScreen";
import ChangePasswordScreen from "../screens/Profile/ChangePasswordScreen";
import HelpSupportScreen from "../screens/Profile/HelpSupportScreen";
import NotificationSettingsScreen from "../screens/Profile/NotificationSettingsScreen";
import PrivacyPolicyScreen from "../screens/Profile/PrivacyPolicyScreen";
import CropLibraryScreen from "../screens/CropLibrary/CropLibraryScreen";
import FertilizerLibraryScreen from "../screens/FertilizerLibrary/FertilizerLibraryScreen";
import PestsLibraryScreen from "../screens/PestsLibrary/PestsLibraryScreen";
import AboutUsScreen from "../screens/AboutUs/AboutUsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const handleInitialLogin = async (currentSession: Session | null) => {
    if (currentSession) {
      // Hydrate user store from Supabase metadata
      const meta = currentSession.user?.user_metadata;
      if (meta) {
        useUserStore.getState().updateProfile({
          name: meta.full_name || meta.fullName || currentSession.user.email?.split('@')[0] || 'Farmer',
          phone: meta.phone || useUserStore.getState().phone,
          location: meta.location || useUserStore.getState().location,
          farmSize: meta.farm_size || meta.farmSize || useUserStore.getState().farmSize,
          mainCrop: meta.primary_crop || meta.primaryCrop || useUserStore.getState().mainCrop,
          farmingExperience: meta.farming_experience || meta.farmingExperience || useUserStore.getState().farmingExperience,
          preferredLanguage: meta.preferred_language || meta.preferredLanguage || useUserStore.getState().preferredLanguage,
        });
      }

      // Ask for location permission the moment they open the app
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        // Pre-fetch the weather so the Home Screen doesn't show loading states
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
        handleInitialLogin(session);
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
          <Stack.Screen name="CreateBlog" component={CreateBlogScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="CropLibrary" component={CropLibraryScreen} />
          <Stack.Screen name="FertilizerLibrary" component={FertilizerLibraryScreen} />
          <Stack.Screen name="PestsLibrary" component={PestsLibraryScreen} />
          <Stack.Screen name="AboutUs" component={AboutUsScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}