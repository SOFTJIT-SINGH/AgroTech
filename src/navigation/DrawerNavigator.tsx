import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import ProfileScreen from '../screens/Profile/ProfileScreen'; // Placeholder
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  return (
    <View className="flex-1 bg-slate-950">
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Drawer Header */}
        <View className="px-6 pt-16 pb-8 bg-slate-900 border-b border-slate-800 relative overflow-hidden">
          {/* Ambient Glow */}
          <View className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
          
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
            style={{ width: 68, height: 68 }}
            className="rounded-full mb-4 border-2 border-emerald-500"
          />
          <Text className="text-2xl font-extrabold text-white tracking-tight">Surinder Singh</Text>
          <Text className="text-emerald-400 font-bold text-xs uppercase tracking-widest mt-1">
            Premium Farmer
          </Text>
        </View>

        {/* Drawer Items */}
        <View className="flex-1 px-4 pt-6 space-y-2">
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      
      {/* Drawer Footer */}
      <View className="p-6 border-t border-slate-800 bg-slate-950">
        <Pressable className="flex-row items-center p-3 rounded-2xl bg-red-500/10 border border-red-500/20 active:bg-red-500/20 transition-colors">
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
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
          marginLeft: -16,
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
        component={ProfileScreen} // Mocked out to profile for now
        options={{
          drawerLabel: 'My Crops',
          drawerIcon: ({ color }) => (
            <Ionicons name="leaf-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="SettingsDrawer"
        component={ProfileScreen} // Mocked out to profile for now
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="SupportDrawer"
        component={ProfileScreen} // Mocked out to profile for now
        options={{
          drawerLabel: 'Help & Support',
          drawerIcon: ({ color }) => (
            <Ionicons name="help-buoy-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
