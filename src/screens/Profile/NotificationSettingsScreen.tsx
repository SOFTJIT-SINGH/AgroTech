import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIF_STORAGE_KEY = '@agrotech_notification_prefs';

interface NotifPrefs {
  weatherAlerts: boolean;
  cropReminders: boolean;
  marketUpdates: boolean;
  diseaseAlerts: boolean;
  appUpdates: boolean;
  promotions: boolean;
}

const defaultPrefs: NotifPrefs = {
  weatherAlerts: true,
  cropReminders: true,
  marketUpdates: true,
  diseaseAlerts: true,
  appUpdates: true,
  promotions: false,
};

export default function NotificationSettingsScreen({ navigation }: any) {
  const [prefs, setPrefs] = useState<NotifPrefs>(defaultPrefs);
  const [saving, setSaving] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const saved = await AsyncStorage.getItem(NOTIF_STORAGE_KEY);
        if (saved) {
          setPrefs(JSON.parse(saved));
        }
      } catch (err) {
        console.log("Error loading notif prefs:", err);
      }
    };
    loadPrefs();
  }, []);

  // Save to AsyncStorage whenever a toggle changes
  const togglePref = async (key: keyof NotifPrefs) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    
    try {
      await AsyncStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.log("Error saving notif prefs:", err);
    }
  };

  const notifSections = [
    {
      title: "Farm Alerts",
      description: "Critical notifications about your farm",
      items: [
        { key: 'weatherAlerts' as keyof NotifPrefs, label: 'Weather Alerts', desc: 'Severe weather warnings for your location', icon: 'thunderstorm-outline' },
        { key: 'cropReminders' as keyof NotifPrefs, label: 'Crop Reminders', desc: 'Irrigation, fertilizer, and sowing schedule', icon: 'leaf-outline' },
        { key: 'diseaseAlerts' as keyof NotifPrefs, label: 'Disease Alerts', desc: 'Regional crop disease outbreak warnings', icon: 'warning-outline' },
      ]
    },
    {
      title: "Updates",
      description: "Stay informed about market and app changes",
      items: [
        // { key: 'marketUpdates' as keyof NotifPrefs, label: 'Market Prices', desc: 'Daily MSP and mandi price updates', icon: 'trending-up-outline' },
        { key: 'appUpdates' as keyof NotifPrefs, label: 'App Updates', desc: 'New features and improvements', icon: 'rocket-outline' },
        { key: 'promotions' as keyof NotifPrefs, label: 'Tips & Offers', desc: 'Seasonal farming tips and promotions', icon: 'gift-outline' },
      ]
    }
  ];

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
          <Text className="text-2xl font-extrabold text-agro-green-950 tracking-tight">Notification <Text className="text-agro-green-600">Settings</Text></Text>
          <Text className="text-agro-earth-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Control your alerts</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* System Permission Banner */}
        <Pressable 
          onPress={() => Linking.openSettings()}
          className="bg-white rounded-[32px] p-6 mb-10 border border-agro-earth-100 flex-row items-center shadow-lg shadow-agro-green-950/5 active:bg-agro-earth-50/50"
        >
          <View className="bg-agro-green-100 p-4 rounded-[20px] border border-agro-green-200 mr-5">
            <Ionicons name="notifications-circle-outline" size={26} color="#2d722d" />
          </View>
          <View className="flex-1">
            <Text className="text-agro-green-950 font-black text-base tracking-tight">System Notifications</Text>
            <Text className="text-agro-earth-500 text-xs font-bold mt-0.5">Manage in device settings</Text>
          </View>
          <Ionicons name="open-outline" size={18} color="#bab194" />
        </Pressable>

        {/* Notification Sections */}
        {notifSections.map((section, sIndex) => (
          <View key={sIndex} className="mb-10">
            <View className="px-1 mb-4">
              <Text className="text-xl font-extrabold text-agro-green-950 tracking-tight">
                {section.title}
              </Text>
              <Text className="text-agro-earth-500 text-[11px] font-bold uppercase tracking-widest mt-1">
                {section.description}
              </Text>
            </View>

            <View className="bg-white rounded-[32px] border border-agro-earth-100 overflow-hidden shadow-sm">
              {section.items.map((item, index) => (
                <View 
                  key={item.key}
                  className={`flex-row items-center p-6 ${index < section.items.length - 1 ? 'border-b border-agro-earth-50' : ''}`}
                >
                  <View className={`p-3 rounded-2xl mr-5 border ${prefs[item.key] ? 'bg-agro-green-100 border-agro-green-200' : 'bg-agro-earth-50 border-agro-earth-100'}`}>
                    <Ionicons name={item.icon as any} size={20} color={prefs[item.key] ? "#2d722d" : "#8f7e5d"} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-agro-green-950 font-black text-[15px] tracking-tight">{item.label}</Text>
                    <Text className="text-agro-earth-500 text-xs mt-1 font-bold leading-5 pr-2">{item.desc}</Text>
                  </View>
                  <Switch
                    value={prefs[item.key]}
                    onValueChange={() => togglePref(item.key)}
                    trackColor={{ false: '#e5e2d9', true: '#3e8e3e' }}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#e5e2d9"
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
