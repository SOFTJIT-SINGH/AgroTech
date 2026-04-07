import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen({ navigation }) {
  const user = {
    name: "Surinder Singh",
    phone: "+91 9876543210",
    location: "Punjab, India",
    farmSize: "5 Acres",
    mainCrop: "Wheat"
  };

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
            <Pressable className="flex-row justify-between items-center p-5 border-b border-slate-800/80 active:bg-slate-800/60 transition-colors">
              <Text className="text-slate-200 font-semibold text-base">
                Edit Profile
              </Text>
              <Text className="text-slate-500 font-bold text-xl leading-5">
                ›
              </Text>
            </Pressable>

            <Pressable className="flex-row justify-between items-center p-5 border-b border-slate-800/80 active:bg-slate-800/60 transition-colors">
              <Text className="text-slate-200 font-semibold text-base">
                Change Password
              </Text>
              <Text className="text-slate-500 font-bold text-xl leading-5">
                ›
              </Text>
            </Pressable>

            <Pressable className="flex-row justify-between items-center p-5 active:bg-slate-800/60 transition-colors">
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
            <Pressable className="flex-row justify-between items-center p-5 border-b border-slate-800/80 active:bg-slate-800/60 transition-colors">
              <Text className="text-slate-200 font-semibold text-base">
                Notifications
              </Text>
              <Text className="text-slate-500 font-bold text-xl leading-5">
                ›
              </Text>
            </Pressable>

            <Pressable className="flex-row justify-between items-center p-5 active:bg-slate-800/60 transition-colors">
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
          <Pressable
            className="bg-red-500/10 py-4 rounded-2xl items-center border border-red-500/20 active:bg-red-500/20 active:scale-[0.98] transition-all"
            onPress={() => {
              console.log("Logout");
              navigation.replace("Auth");
            }}
          >
            <Text className="text-red-400 font-bold text-base tracking-wide uppercase">
              Logout
            </Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}