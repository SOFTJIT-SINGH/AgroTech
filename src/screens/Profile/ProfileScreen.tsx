import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import DynamicButton from "../../components/DynamicButton";
import { useEffect } from "react";
import { supabase } from "../../services/supabase";

import { useUserStore } from "../../store/userStore";
import { Alert } from "react-native";

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const user = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata) {
        user.updateProfile({
          name: session.user.user_metadata.fullName || session.user.email,
          phone: session.user.user_metadata.phone || user.phone,
          location: session.user.user_metadata.location || user.location,
          farmSize: session.user.user_metadata.farmSize || user.farmSize,
          mainCrop: session.user.user_metadata.primaryCrop || user.mainCrop,
        });
      }
    };
    fetchUser();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView showsVerticalScrollIndicator={false} className="pb-10">

        {/* HEADER */}
        <View className="items-center mt-6">
          <View className="relative">
            {/* Subtle background glow effect */}
            <View className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl scale-110" />
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }}
              style={{ width: 110, height: 110 }}
              contentFit="cover"
              className="rounded-full border-[4px] border-slate-950 bg-slate-800 relative z-10"
            />
          </View>

          <Text className="text-white text-3xl font-extrabold mt-5 tracking-tight">
            {user.name}
          </Text>

          <View className="bg-emerald-500/10 px-4 py-1.5 rounded-full mt-2.5 border border-emerald-500/20">
            <Text className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
              Farmer
            </Text>
          </View>
        </View>

        {/* PERSONAL DETAILS */}
        <View className="px-6 mt-10">
          <Text className="text-lg font-bold text-slate-100 mb-4 px-1">
            Personal Details
          </Text>

          <View className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <View className="flex-row justify-between items-center border-b border-slate-800/80 pb-4 mb-4">
              <Text className="text-slate-400 font-medium text-sm">Phone</Text>
              <Text className="text-slate-100 font-bold text-base">{user.phone}</Text>
            </View>

            <View className="flex-row justify-between items-center border-b border-slate-800/80 pb-4 mb-4">
              <Text className="text-slate-400 font-medium text-sm">Location</Text>
              <Text className="text-slate-100 font-bold text-base">{user.location}</Text>
            </View>

            <View className="flex-row justify-between items-center border-b border-slate-800/80 pb-4 mb-4">
              <Text className="text-slate-400 font-medium text-sm">Farm Size</Text>
              <Text className="text-slate-100 font-bold text-base">{user.farmSize}</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-slate-400 font-medium text-sm">Main Crop</Text>
              <Text className="text-emerald-400 font-extrabold text-base">{user.mainCrop}</Text>
            </View>
          </View>
        </View>

        {/* ACCOUNT OPTIONS */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-bold text-slate-100 mb-4 px-1">
            Account
          </Text>

          <View className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
            <Pressable onPress={() => navigation.navigate("EditProfile")} className="flex-row justify-between items-center p-5 border-b border-slate-800/80 active:bg-slate-800/60 transition-colors">
              <Text className="text-slate-200 font-semibold text-base">
                Edit Profile
              </Text>
              <Text className="text-slate-500 font-bold text-xl leading-5">
                ›
              </Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate("History")} className="flex-row justify-between items-center p-5 border-b border-slate-800/80 active:bg-slate-800/60 transition-colors">
              <Text className="text-slate-200 font-semibold text-base">
                My Crops & Scans
              </Text>
              <Text className="text-slate-500 font-bold text-xl leading-5">
                ›
              </Text>
            </Pressable>

            <Pressable onPress={() => Alert.alert("Coming Soon", "Change Password will be available soon.")} className="flex-row justify-between items-center p-5 border-b border-slate-800/80 active:bg-slate-800/60 transition-colors">
              <Text className="text-slate-200 font-semibold text-base">
                Change Password
              </Text>
              <Text className="text-slate-500 font-bold text-xl leading-5">
                ›
              </Text>
            </Pressable>

            <Pressable onPress={() => Alert.alert("Help & Support", "Contact us at support@agrotech.com")} className="flex-row justify-between items-center p-5 active:bg-slate-800/60 transition-colors">
              <Text className="text-slate-200 font-semibold text-base">
                Help & Support
              </Text>
              <Text className="text-slate-500 font-bold text-xl leading-5">
                ›
              </Text>
            </Pressable>
          </View>
        </View>

        {/* APP SETTINGS */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-bold text-slate-100 mb-4 px-1">
            App Settings
          </Text>

          <View className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
            <Pressable onPress={() => Alert.alert("Notifications", "Notification settings are up to date.")} className="flex-row justify-between items-center p-5 border-b border-slate-800/80 active:bg-slate-800/60 transition-colors">
              <Text className="text-slate-200 font-semibold text-base">
                Notifications
              </Text>
              <Text className="text-slate-500 font-bold text-xl leading-5">
                ›
              </Text>
            </Pressable>

            <Pressable onPress={() => Alert.alert("Privacy Policy", "Review our terms at agrotech.com/privacy")} className="flex-row justify-between items-center p-5 active:bg-slate-800/60 transition-colors">
              <Text className="text-slate-200 font-semibold text-base">
                Privacy Policy
              </Text>
              <Text className="text-slate-500 font-bold text-xl leading-5">
                ›
              </Text>
            </Pressable>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <View className="px-6 mt-10 mb-12">
          <DynamicButton
            title="LOGOUT"
            onPress={() => {
              console.log("Logout");
              navigation.replace("Auth");
            }}
            variant="outline"
            className="border-red-500/50 bg-red-500/10"
            textClassName="text-red-400"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}