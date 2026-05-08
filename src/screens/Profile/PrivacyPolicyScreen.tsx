import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const POLICY_SECTIONS = [
  {
    title: "1. Information We Collect",
    content: `When you use AgroTech, we collect the following types of information:

• Account Information: Your name, email address, and phone number provided during registration.

• Farm Data: Location coordinates (with permission), crop scan images, and analysis results stored locally on your device.

• Usage Data: App interaction patterns, feature usage frequencies, and error logs to improve our services.

• Device Information: Device model, operating system version, and app version for compatibility and support purposes.`
  },
  {
    title: "2. How We Use Your Data",
    content: `We use your information to:

• Provide personalized farming recommendations based on your location and weather conditions.

• Process crop disease scans using Google's Gemini AI. Images are sent to Google's servers for analysis but are not stored permanently.

• Deliver weather-based farming advisories using your device's location.

• Improve our AI models and app features through anonymized usage analytics.

• Send you relevant notifications about weather alerts, crop reminders, and market updates (if enabled).`
  },
  {
    title: "3. Data Storage & Security",
    content: `• Authentication data is securely managed through Supabase with industry-standard encryption.

• Crop scan history and preferences are stored locally on your device using AsyncStorage.

• All API communications use HTTPS encryption.

• We do not sell, trade, or rent your personal information to third parties.

• Your password is hashed using bcrypt and never stored in plain text.`
  },
  {
    title: "4. Third-Party Services",
    content: `AgroTech integrates with the following trusted third-party services:

• Supabase: For authentication and user account management.

• Google Gemini AI: For crop disease detection and intelligent chatbot responses. Images sent for analysis are processed under Google's AI terms.

• Open-Meteo: For real-time weather data using your device coordinates. No personal identifiers are shared.

• Expo Services: For app delivery, push notifications, and camera access.`
  },
  {
    title: "5. Location Data",
    content: `• We request foreground location permission to provide localized weather data and farming advice.

• Location data is used in real-time and is not permanently stored on our servers.

• You can revoke location permission at any time through your device settings. The app will continue to work with limited functionality.`
  },
  {
    title: "6. Your Rights",
    content: `You have the right to:

• Access and update your personal information through the Edit Profile screen.

• Delete your account by contacting support@agrotech.com.

• Opt out of non-essential notifications through the Notification Settings screen.

• Withdraw camera and location permissions at any time through your device settings.

• Request a copy of your data by emailing our support team.`
  },
  {
    title: "7. Data Retention",
    content: `• Account data is retained as long as your account is active.

• Scan history is stored locally on your device and can be cleared by uninstalling the app.

• If you delete your account, all associated data will be removed from our servers within 30 days.`
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes through in-app notifications or email. Continued use of the app after changes constitutes acceptance of the updated policy.`
  },
  {
    title: "9. Contact Us",
    content: `If you have questions about this Privacy Policy, contact us at:

• Email: surinderbhullar307@gmail.com
• Phone: 8198058974
• Address: Guru Nanak Dev University, Amritsar, Punjab, India`
  },
];

export default function PrivacyPolicyScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      {/* Header */}
      <View className="px-6 py-5 border-b border-agro-earth-100 flex-row items-center bg-white shadow-sm">
        <Pressable 
          onPress={() => navigation.goBack()} 
          className="mr-4 p-2 bg-agro-earth-50 rounded-full border border-agro-earth-100 active:scale-90 transition-all"
        >
          <Ionicons name="arrow-back" size={22} color="#3e8e3e" />
        </Pressable>
        <View>
          <Text className="text-2xl font-extrabold text-agro-green-950 tracking-tight">Privacy <Text className="text-agro-green-600">Policy</Text></Text>
          <Text className="text-agro-earth-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Your data protection</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* Last Updated */}
        <View className="flex-row items-center mb-6 ml-1">
          <View className="bg-agro-green-100 p-1.5 rounded-full mr-2">
            <Ionicons name="time-outline" size={14} color="#2d722d" />
          </View>
          <Text className="text-agro-earth-500 text-xs font-black uppercase tracking-widest">
            Last updated: April 12, 2026
          </Text>
        </View>

        {/* Intro */}
        <View className="bg-white rounded-[32px] p-6 mb-10 border border-agro-earth-100 shadow-lg shadow-agro-green-950/5">
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-agro-green-50 rounded-full items-center justify-center border border-agro-green-100 mr-3">
              <Ionicons name="shield-checkmark" size={16} color="#3e8e3e" />
            </View>
            <Text className="text-agro-green-600 font-black text-xs uppercase tracking-widest">Your Privacy Matters</Text>
          </View>
          <Text className="text-agro-green-950 text-sm leading-7 font-bold">
            AgroTech is committed to protecting your personal information. This policy explains what data we collect, how we use it, and the controls you have.
          </Text>
        </View>

        {/* Policy Sections */}
        {POLICY_SECTIONS.map((section, index) => (
          <View key={index} className="mb-10">
            <View className="flex-row items-center mb-4 px-1">
              <View className="w-1 h-6 bg-agro-green-500 rounded-full mr-3" />
              <Text className="text-agro-green-950 font-black text-lg tracking-tight">
                {section.title}
              </Text>
            </View>
            <View className="bg-white rounded-[28px] p-6 border border-agro-earth-100 shadow-sm">
              <Text className="text-agro-earth-600 text-sm leading-8 font-bold">
                {section.content}
              </Text>
            </View>
          </View>
        ))}

        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
