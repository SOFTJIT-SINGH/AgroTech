import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import HistoryScreen from '../screens/Profile/HistoryScreen';
import HelpSupportScreen from '../screens/Profile/HelpSupportScreen';
import NotificationSettingsScreen from '../screens/Profile/NotificationSettingsScreen';
import CropLibraryScreen from '../screens/CropLibrary/CropLibraryScreen';
import FertilizerLibraryScreen from '../screens/FertilizerLibrary/FertilizerLibraryScreen';
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
  const { navigation } = props;

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

  const navigateToTab = (tabName: string) => {
    navigation.navigate('MainDrawerHome', { screen: tabName });
    navigation.closeDrawer();
  };

  return (
    <View className="flex-1 bg-agro-earth-50">
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Drawer Header */}
        <View className="px-6 pt-16 pb-8 bg-white border-b border-agro-earth-100 relative overflow-hidden">
          {/* Ambient Glow */}
          <View className="absolute -top-10 -right-10 w-40 h-40 bg-agro-green-500/10 rounded-full blur-3xl" />

          <View
            className="w-[68px] h-[68px] rounded-full mb-4 border-2 border-agro-green-500 bg-agro-green-50 items-center justify-center overflow-hidden"
          >
            {useUserStore.getState().profileImage ? (
              <Image
                source={{ uri: useUserStore.getState().profileImage! }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Text className="text-agro-green-700 text-2xl font-black tracking-tighter">
                {getInitials(name)}
              </Text>
            )}
          </View>
          <Text className="text-2xl font-extrabold text-agro-green-950 tracking-tight">{name}</Text>
          <Text className="text-agro-green-600 font-bold text-xs uppercase tracking-widest mt-1">
            Premium Farmer
          </Text>
        </View>

        {/* Custom Drawer Items for Tabs */}
        <View className="pt-2">
          <DrawerItem
            label="Dashboard"
            icon={({ color }) => <Ionicons name="grid-outline" size={22} color={color} />}
            onPress={() => navigateToTab('Home')}
            labelStyle={{ marginLeft: -8, fontWeight: 'bold', fontSize: 15, letterSpacing: 0.5 }}
            style={{ borderRadius: 16, paddingHorizontal: 8, marginBottom: 8, marginHorizontal: 10 }}
          />

          <DrawerItem
            label="Community Chat"
            icon={({ color }) => <Ionicons name="people-outline" size={22} color={color} />}
            onPress={() => navigateToTab('Community')}
            labelStyle={{ marginLeft: -8, fontWeight: 'bold', fontSize: 15, letterSpacing: 0.5 }}
            style={{ borderRadius: 16, paddingHorizontal: 8, marginBottom: 8, marginHorizontal: 10 }}
          />

          <DrawerItem
            label="My Profile"
            icon={({ color }) => <Ionicons name="person-circle-outline" size={22} color={color} />}
            onPress={() => navigateToTab('Profile')}
            labelStyle={{ marginLeft: -8, fontWeight: 'bold', fontSize: 15, letterSpacing: 0.5 }}
            style={{ borderRadius: 16, paddingHorizontal: 8, marginBottom: 8, marginHorizontal: 10 }}
          />
        </View>

        {/* Remaining Drawer Items */}
        <View className="flex-1">
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Drawer Footer */}
      <View className="p-6 border-t border-agro-earth-100 bg-white">
        <Pressable
          onPress={handleSignOut}
          className="flex-row items-center p-3 rounded-2xl bg-red-50 border border-red-100 active:bg-red-100 transition-colors"
        >
          <Ionicons name="log-out-outline" size={24} color="#dc2626" />
          <Text className="text-red-600 font-bold text-base ml-3 tracking-wide">Sign Out</Text>
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
          backgroundColor: '#f7f6f2',
          width: 300,
        },
        drawerActiveBackgroundColor: '#dcf0dc',
        drawerActiveTintColor: '#2d722d',
        drawerInactiveTintColor: '#695a43',
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
          marginHorizontal: 10,
        }
      }}
    >
      {/* Hidden default dashboard to allow manual link handling if needed, 
          but we keep it as the base screen */}
      <Drawer.Screen
        name="MainDrawerHome"
        component={BottomTabs}
        options={{
          drawerItemStyle: { display: 'none' }, // Hide from ItemList as we handle it manually
        }}
      />
      
      <Drawer.Screen
        name="HistoryDrawer"
        component={HistoryScreen}
        options={{
          drawerLabel: 'My Crops',
          drawerIcon: ({ color }) => (
            <Ionicons name="leaf-outline" size={22} color={color} />
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
        name="NotificationSettingsDrawer"
        component={NotificationSettingsScreen}
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="HelpSupportDrawer"
        component={HelpSupportScreen}
        options={{
          drawerLabel: 'Help & Support',
          drawerIcon: ({ color }) => (
            <Ionicons name="help-buoy-outline" size={22} color={color} />
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
