import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import HistoryScreen from '../screens/Profile/HistoryScreen';
import HelpSupportScreen from '../screens/Profile/HelpSupportScreen';
import NotificationSettingsScreen from '../screens/Profile/NotificationSettingsScreen';
import CropLibraryScreen from '../screens/CropLibrary/CropLibraryScreen';
import FertilizerLibraryScreen from '../screens/FertilizerLibrary/FertilizerLibraryScreen';
import PestsLibraryScreen from '../screens/PestsLibrary/PestsLibraryScreen';
import AboutUsScreen from '../screens/AboutUs/AboutUsScreen';
import CommunityChatScreen from '../screens/CommunityChat/CommunityChatScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useUserStore } from '../store/userStore';
import { supabase } from '../services/supabase';
import { getInitials } from '../utils/stringUtils';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const { name } = useUserStore();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await supabase.auth.signOut();
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-slate-950">
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Drawer Header */}
        <View className="px-6 pt-16 pb-8 bg-slate-900 border-b border-slate-800 relative overflow-hidden">
          {/* Ambient Glow */}
          <View className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
          
          <View 
            className="w-[68px] h-[68px] rounded-full mb-4 border-2 border-emerald-500 bg-slate-800 items-center justify-center overflow-hidden"
          >
            {useUserStore.getState().profileImage ? (
              <Image
                source={{ uri: useUserStore.getState().profileImage! }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Text className="text-white text-2xl font-black tracking-tighter">
                {getInitials(name)}
              </Text>
            )}
          </View>
          <Text className="text-2xl font-extrabold text-white tracking-tight">{name}</Text>
          <Text className="text-emerald-400 font-bold text-xs uppercase tracking-widest mt-1">
            Premium Farmer
          </Text>
        </View>

        {/* Drawer Items */}
        <View className="flex-1 px-4 pt-2 space-y-2">
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      
      {/* Drawer Footer */}
      <View className="p-6 border-t border-slate-800 bg-slate-950">
        <Pressable 
          onPress={handleSignOut}
          className="flex-row items-center p-3 rounded-2xl bg-red-500/10 border border-red-500/20 active:bg-red-500/20 transition-colors"
        >
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text className="text-red-400 font-bold text-base ml-3 tracking-wide">Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#020617', // slate-950
          width: 300,
        },
        drawerActiveBackgroundColor: '#0f172a', // slate-900
        drawerActiveTintColor: '#34d399', // emerald-400
        drawerInactiveTintColor: '#94a3b8', // slate-400
        drawerLabelStyle: {
          marginLeft: -8,
          fontWeight: 'bold',
          fontSize: 15,
          letterSpacing: 0.5,
        },
        drawerItemStyle: {
          borderRadius: 16,
          paddingHorizontal: 8,
          marginBottom: 8,
        }
      }}
    >
      <Drawer.Screen
        name="MainDrawerHome"
        component={BottomTabs}
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CommunityChatDrawer"
        component={CommunityChatScreen}
        options={{
          drawerLabel: 'Community Chat',
          drawerIcon: ({ color }) => (
            <Ionicons name="people-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProfileDrawer"
        component={ProfileScreen}
        options={{
          drawerLabel: 'My Profile',
          drawerIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CropsArchive"
        component={HistoryScreen}
        options={{
          drawerLabel: 'My Crops',
          drawerIcon: ({ color }) => (
            <Ionicons name="leaf-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="SettingsDrawer"
        component={NotificationSettingsScreen}
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="SupportDrawer"
        component={HelpSupportScreen}
        options={{
          drawerLabel: 'Help & Support',
          drawerIcon: ({ color }) => (
            <Ionicons name="help-buoy-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CropLibraryDrawer"
        component={CropLibraryScreen}
        options={{
          drawerLabel: 'Crop Library',
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="book-open-variant" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="FertilizerLibraryDrawer"
        component={FertilizerLibraryScreen}
        options={{
          drawerLabel: 'Fertilizers',
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="flask-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="PestsLibraryDrawer"
        component={PestsLibraryScreen}
        options={{
          drawerLabel: 'Pests & Diseases',
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="bug-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AboutUsDrawer"
        component={AboutUsScreen}
        options={{
          drawerLabel: 'About Us',
          drawerIcon: ({ color }) => (
            <Ionicons name="information-circle-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
