import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "../screens/Home/HomeScreen";
import BlogsScreen from "../screens/Blogs/BlogsScreen";
import MarketScreen from "../screens/SellingTime/MarketScreen";
import ChatbotScreen from "../screens/Chatbot/ChatbotScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Tab = createBottomTabNavigator();

function ChatbotButton({ children, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="-top-6 justify-center items-center"
    >
      <View 
        className="w-[68px] h-[68px] rounded-full bg-emerald-500 justify-center items-center shadow-lg shadow-emerald-500/50 border-[4px] border-slate-950"
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 75,
          borderTopWidth: 1,
          borderTopColor: "#1e293b", // Tailwind slate-800
          backgroundColor: "#020617", // Tailwind slate-950
          elevation: 0, // Removed to keep the flat dark UI look clean
          shadowOpacity: 0,
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={focused ? "#34d399" : "#64748b"} // emerald-400 : slate-500
            />
          )
        }}
      />

      <Tab.Screen
        name="Blogs"
        component={BlogsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "newspaper-variant" : "newspaper-variant-outline"}
              size={26}
              color={focused ? "#34d399" : "#64748b"}
            />
          )
        }}
      />

      <Tab.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons name="robot" size={30} color="#020617" /> // slate-950 to contrast with emerald button
          ),
          tabBarButton: props => (
            <ChatbotButton {...props} />
          )
        }}
      />

      <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "storefront" : "storefront-outline"}
              size={26}
              color={focused ? "#34d399" : "#64748b"}
            />
          )
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={focused ? "#34d399" : "#64748b"}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}