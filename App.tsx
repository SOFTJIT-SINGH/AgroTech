import "./global.css"; // This MUST be the first line
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import {  SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
    </>
  );
}