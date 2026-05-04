import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import DynamicButton from "../../components/DynamicButton";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useUserStore } from "../../store/userStore";
import { Ionicons } from "@expo/vector-icons";
import { getInitials } from "../../utils/stringUtils";

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const user = useUserStore();
  const [email, setEmail] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setEmail(session.user.email || '');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            setLoggingOut(true);
            await supabase.auth.signOut();
            setLoggingOut(false);
            // Session change auto-navigates to Auth via AppNavigator
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      <ScrollView showsVerticalScrollIndicator={false} className="pb-10">

        {/* HEADER */}
        <View className="items-center mt-6">
          <View className="relative">
            {/* Subtle background glow effect */}
            <View className="absolute inset-0 bg-agro-green-500/10 rounded-full blur-xl scale-110" />
            <View 
              className="w-[110px] h-[110px] rounded-full border-[4px] border-white bg-agro-green-50 relative z-10 items-center justify-center overflow-hidden shadow-lg shadow-agro-green-950/10"
            >
              {user.profileImage ? (
                <Image
                  source={{ uri: user.profileImage }}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Text className="text-agro-green-700 text-4xl font-black tracking-tighter">
                  {getInitials(user.name)}
                </Text>
              )}
            </View>
          </View>

          <Text className="text-agro-green-950 text-3xl font-extrabold mt-5 tracking-tight">
            {user.name}
          </Text>

          {email ? (
            <Text className="text-agro-earth-500 text-sm mt-1 font-bold">{email}</Text>
          ) : null}

          <View className="bg-agro-green-100 px-4 py-1.5 rounded-full mt-2.5 border border-agro-green-200">
            <Text className="text-agro-green-800 font-black text-xs uppercase tracking-widest">
              Farmer
            </Text>
          </View>
        </View>

        {/* PERSONAL DETAILS */}
        <View className="px-6 mt-10">
          <Text className="text-lg font-bold text-agro-green-950 mb-4 px-1">
            Personal Details
          </Text>

          <View className="bg-white rounded-3xl p-6 border border-agro-earth-200 shadow-sm">
            <View className="flex-row justify-between items-center border-b border-agro-earth-50 pb-4 mb-4">
              <Text className="text-agro-earth-500 font-bold text-sm">Phone</Text>
              <Text className="text-agro-green-950 font-bold text-base">{user.phone || '—'}</Text>
            </View>

            <View className="flex-row justify-between items-center border-b border-agro-earth-50 pb-4 mb-4">
              <Text className="text-agro-earth-500 font-bold text-sm">Location</Text>
              <Text className="text-agro-green-950 font-bold text-base">{user.location || '—'}</Text>
            </View>

            <View className="flex-row justify-between items-center border-b border-agro-earth-50 pb-4 mb-4">
              <Text className="text-agro-earth-500 font-bold text-sm">Farm Size</Text>
              <Text className="text-agro-green-950 font-bold text-base">{user.farmSize || '—'}</Text>
            </View>

            <View className="flex-row justify-between items-center border-b border-agro-earth-50 pb-4 mb-4">
              <Text className="text-agro-earth-500 font-bold text-sm">Main Crop</Text>
              <Text className="text-agro-green-600 font-black text-base">{user.mainCrop || '—'}</Text>
            </View>

            <View className="flex-row justify-between items-center border-b border-agro-earth-50 pb-4 mb-4">
              <Text className="text-agro-earth-500 font-bold text-sm">Experience</Text>
              <Text className="text-agro-green-950 font-bold text-base">{user.farmingExperience ? `${user.farmingExperience} Yrs` : '—'}</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-agro-earth-500 font-bold text-sm">Language</Text>
              <Text className="text-agro-green-950 font-bold text-base">{user.preferredLanguage || '—'}</Text>
            </View>
          </View>
        </View>

        {/* ACCOUNT OPTIONS */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-bold text-agro-green-950 mb-4 px-1">
            Account
          </Text>

          <View className="bg-white rounded-3xl border border-agro-earth-100 overflow-hidden shadow-sm">
            <Pressable onPress={() => navigation.navigate("EditProfile")} className="flex-row justify-between items-center p-5 border-b border-agro-earth-50 active:bg-agro-green-50 transition-colors">
              <View className="flex-row items-center">
                <Ionicons name="create-outline" size={20} color="#3e8e3e" style={{ marginRight: 12 }} />
                <Text className="text-agro-green-950 font-bold text-base">Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8f7e5d" />
            </Pressable>

            <Pressable onPress={() => navigation.navigate("History")} className="flex-row justify-between items-center p-5 border-b border-agro-earth-50 active:bg-agro-green-50 transition-colors">
              <View className="flex-row items-center">
                <Ionicons name="leaf-outline" size={20} color="#3e8e3e" style={{ marginRight: 12 }} />
                <Text className="text-agro-green-950 font-bold text-base">My Crops & Scans</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8f7e5d" />
            </Pressable>

            <Pressable onPress={() => navigation.navigate("ChangePassword")} className="flex-row justify-between items-center p-5 border-b border-agro-earth-50 active:bg-agro-green-50 transition-colors">
              <View className="flex-row items-center">
                <Ionicons name="lock-closed-outline" size={20} color="#3e8e3e" style={{ marginRight: 12 }} />
                <Text className="text-agro-green-950 font-bold text-base">Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8f7e5d" />
            </Pressable>

            <Pressable onPress={() => navigation.navigate("HelpSupport")} className="flex-row justify-between items-center p-5 active:bg-agro-green-50 transition-colors">
              <View className="flex-row items-center">
                <Ionicons name="help-buoy-outline" size={20} color="#3e8e3e" style={{ marginRight: 12 }} />
                <Text className="text-agro-green-950 font-bold text-base">Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8f7e5d" />
            </Pressable>
          </View>
        </View>

        {/* APP SETTINGS */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-bold text-agro-green-950 mb-4 px-1">
            App Settings
          </Text>

          <View className="bg-white rounded-3xl border border-agro-earth-100 overflow-hidden shadow-sm">
            <Pressable onPress={() => navigation.navigate("NotificationSettings")} className="flex-row justify-between items-center p-5 border-b border-agro-earth-50 active:bg-agro-green-50 transition-colors">
              <View className="flex-row items-center">
                <Ionicons name="notifications-outline" size={20} color="#3e8e3e" style={{ marginRight: 12 }} />
                <Text className="text-agro-green-950 font-bold text-base">Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8f7e5d" />
            </Pressable>

            <Pressable onPress={() => navigation.navigate("PrivacyPolicy")} className="flex-row justify-between items-center p-5 border-b border-agro-earth-50 active:bg-agro-green-50 transition-colors">
              <View className="flex-row items-center">
                <Ionicons name="shield-checkmark-outline" size={20} color="#3e8e3e" style={{ marginRight: 12 }} />
                <Text className="text-agro-green-950 font-bold text-base">Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8f7e5d" />
            </Pressable>

            <Pressable onPress={() => navigation.navigate("AboutUs")} className="flex-row justify-between items-center p-5 active:bg-agro-green-50 transition-colors">
              <View className="flex-row items-center">
                <Ionicons name="information-circle-outline" size={20} color="#3e8e3e" style={{ marginRight: 12 }} />
                <Text className="text-agro-green-950 font-bold text-base">About AgroTech</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8f7e5d" />
            </Pressable>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <View className="px-6 mt-10 mb-12">
          <DynamicButton
            title="SIGN OUT"
            onPress={handleLogout}
            loading={loggingOut}
            variant="outline"
            className="border-red-200 bg-red-50"
            textClassName="text-red-600 font-black"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}