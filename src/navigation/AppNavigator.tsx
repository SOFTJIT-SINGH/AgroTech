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
import AboutUsScreen from "../screens/AboutUs/AboutUsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const handleInitialLogin = async (currentSession: Session | null) => {
    if (currentSession) {
      const userId = currentSession.user.id;
      const meta = currentSession.user?.user_metadata;

      // 1. First, hydrate from metadata for immediate UI update (if not already set)
      if (meta) {
        const currentStore = useUserStore.getState();
        useUserStore.getState().updateProfile({
          name: meta.full_name || meta.fullName || (currentStore.name !== 'Farmer' ? currentStore.name : currentSession.user.email?.split('@')[0]) || 'Farmer',
          phone: meta.phone || currentStore.phone,
        });
      }

      // 2. Fetch full profile from the database for accuracy
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileData) {
          // Profile exists, update store
          useUserStore.getState().updateProfile({
            name: profileData.full_name || profileData.name || useUserStore.getState().name,
            phone: profileData.phone || useUserStore.getState().phone,
            profileImage: profileData.profile_image || useUserStore.getState().profileImage,
            location: profileData.farm_location || useUserStore.getState().location,
            farmSize: profileData.farm_size || useUserStore.getState().farmSize,
            mainCrop: profileData.primary_crop || useUserStore.getState().mainCrop,
            farmingExperience: profileData.farming_experience || useUserStore.getState().farmingExperience,
            preferredLanguage: profileData.preferred_language || useUserStore.getState().preferredLanguage,
          });
        } else if (!error || error.code === 'PGRST116') {
          // Profile missing (Self-healing)
          console.log("Profile missing, creating one...");
          await supabase.from('profiles').upsert({
            id: userId,
            full_name: meta?.full_name || currentSession.user.email?.split('@')[0] || 'Farmer',
            name: meta?.full_name || currentSession.user.email?.split('@')[0] || 'Farmer',
            email: currentSession.user.email,
            phone: meta?.phone || '',
            updated_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Error fetching/syncing profile:", err);
      }

      // 3. Ask for location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        useUserStore.getState().fetchWeather();
      }
    }
  };

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          if (error.message.includes("Refresh Token Not Found") || error.status === 400) {
            console.log("Auth session invalid, signing out...");
            await supabase.auth.signOut();
            setSession(null);
          }
        } else {
          setSession(session);
          if (session) {
            handleInitialLogin(session);
          }
        }
      } catch (err) {
        console.error("Unexpected session check error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      setSession(session);
      if (event === "SIGNED_IN" && session) {
        handleInitialLogin(session);
      } else if (event === "SIGNED_OUT") {
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f7f6f2" }}>
        <ActivityIndicator size="large" color="#3e8e3e" />
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
          <Stack.Screen name="AboutUs" component={AboutUsScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}