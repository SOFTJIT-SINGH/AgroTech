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
        { key: 'marketUpdates' as keyof NotifPrefs, label: 'Market Prices', desc: 'Daily MSP and mandi price updates', icon: 'trending-up-outline' },
        { key: 'appUpdates' as keyof NotifPrefs, label: 'App Updates', desc: 'New features and improvements', icon: 'rocket-outline' },
        { key: 'promotions' as keyof NotifPrefs, label: 'Tips & Offers', desc: 'Seasonal farming tips and promotions', icon: 'gift-outline' },
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => navigation.goBack()} className="mr-4 p-2 bg-slate-900 rounded-2xl border border-slate-800 active:scale-95">
            <Ionicons name="arrow-back" size={22} color="#34d399" />
          </Pressable>
          <Text className="text-2xl font-extrabold text-white tracking-tight">
            Notification <Text className="text-emerald-400">Settings</Text>
          </Text>
        </View>

        {/* System Permission Banner */}
        <Pressable 
          onPress={() => Linking.openSettings()}
          className="bg-slate-900/80 rounded-[24px] p-5 mb-8 border border-slate-800 flex-row items-center active:bg-slate-800/60"
        >
          <View className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 mr-4">
            <Ionicons name="phone-portrait-outline" size={22} color="#34d399" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-200 font-semibold text-base">System Notifications</Text>
            <Text className="text-slate-500 text-sm mt-0.5">Manage in device settings</Text>
          </View>
          <Ionicons name="open-outline" size={18} color="#64748b" />
        </Pressable>

        {/* Notification Sections */}
        {notifSections.map((section, sIndex) => (
          <View key={sIndex} className="mb-8">
            <Text className="text-lg font-bold text-slate-100 mb-1 px-1">
              {section.title}
            </Text>
            <Text className="text-slate-500 text-xs font-medium mb-4 px-1">
              {section.description}
            </Text>

            <View className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
              {section.items.map((item, index) => (
                <View 
                  key={item.key}
                  className={`flex-row items-center p-5 ${index < section.items.length - 1 ? 'border-b border-slate-800/80' : ''}`}
                >
                  <View className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/50 mr-4">
                    <Ionicons name={item.icon as any} size={20} color={prefs[item.key] ? "#34d399" : "#64748b"} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-200 font-semibold text-[15px]">{item.label}</Text>
                    <Text className="text-slate-500 text-xs mt-0.5 font-medium">{item.desc}</Text>
                  </View>
                  <Switch
                    value={prefs[item.key]}
                    onValueChange={() => togglePref(item.key)}
                    trackColor={{ false: '#1e293b', true: '#065f46' }}
                    thumbColor={prefs[item.key] ? '#34d399' : '#64748b'}
                    ios_backgroundColor="#1e293b"
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
