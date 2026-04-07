import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
// Import any other screens you want in the drawer
import ProfileScreen from '../screens/Profile/ProfileScreen'; // Placeholder, modify if exists
import { Ionicons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#e8f5e9',
        drawerActiveTintColor: '#2e7d32',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -20,
          fontFamily: 'Roboto',
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="MainDrawerHome"
        component={BottomTabs}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      
      {/* We can add Profile or other sidebar links here */}
      <Drawer.Screen
        name="ProfileDrawer"
        component={ProfileScreen}
        options={{
          drawerLabel: 'My Profile',
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
