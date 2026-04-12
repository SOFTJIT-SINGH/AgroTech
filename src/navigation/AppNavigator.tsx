import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";

import AuthNavigator from "../screens/Auth/AuthNavigator";

import DetectScreen from "../screens/CropDetection/DetectScreen";
import WeatherAdviceScreen from "../screens/WeatherAdvice/WeatherAdviceScreen";
import FertilizerScreen from "../screens/FertilizerPlan/FertilizerScreen";
import CropSuggestionScreen from "../screens/BestCrop/CropSuggestionScreen";
import SowingPredictionScreen from "../screens/SowingPrediction/SowingPredictionScreen";
import BlogDetailsScreen from "@/screens/Blogs/BlogDetailsScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import HistoryScreen from "../screens/Profile/HistoryScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="MainDrawer" component={DrawerNavigator} />

      <Stack.Screen name="DetectCrop" component={DetectScreen} />
      <Stack.Screen name="WeatherAdvice" component={WeatherAdviceScreen} />
      <Stack.Screen name="FertilizerPlan" component={FertilizerScreen} />
      <Stack.Screen name="CropSuggestion" component={CropSuggestionScreen} />
      <Stack.Screen name="SowingPrediction" component={SowingPredictionScreen} />
      <Stack.Screen
        name="BlogDetails"
        component={BlogDetailsScreen}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
}