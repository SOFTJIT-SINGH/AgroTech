import "./global.css"; // This MUST be the first line
import "react-native-gesture-handler"; // Required for Drawer Navigator
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import {  SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" backgroundColor="#020617" />
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
    </>
  );
}