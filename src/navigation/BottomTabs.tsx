import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "../screens/Home/HomeScreen";
import BlogsScreen from "../screens/Blogs/BlogsScreen";
import ChatbotScreen from "../screens/Chatbot/ChatbotScreen";
import DetectScreen from "../screens/CropDetection/DetectScreen";
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
        className="w-[68px] h-[68px] rounded-full bg-agro-green-600 justify-center items-center shadow-lg shadow-agro-green-700/30 border-[4px] border-agro-earth-50"
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
          borderTopColor: "#ebe9df", // agro-earth-100
          backgroundColor: "#ffffff",
          elevation: 10,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowColor: "#1a3c1a",
          shadowOffset: { width: 0, height: -4 }
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
              color={focused ? "#3e8e3e" : "#8f7e5d"} // agro-green-500 : agro-earth-500
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
              color={focused ? "#3e8e3e" : "#8f7e5d"}
            />
          )
        }}
      />

      <Tab.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons name="robot" size={30} color="#ffffff" />
          ),
          tabBarButton: props => (
            <ChatbotButton {...props} />
          )
        }}
      />


      <Tab.Screen
        name="Scanner"
        component={DetectScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "scan-circle" : "scan-circle-outline"}
              size={28}
              color={focused ? "#3e8e3e" : "#8f7e5d"}
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
              color={focused ? "#3e8e3e" : "#8f7e5d"}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}