import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";

import AuthNavigator from "../screens/Auth/AuthNavigator";

import DetectScreen from "../screens/CropDetection/DetectScreen";
import WeatherAdviceScreen from "../screens/WeatherAdvice/WeatherAdviceScreen";
import FertilizerScreen from "../screens/FertilizerPlan/FertilizerScreen";
import CropSuggestionScreen from "../screens/BestCrop/CropSuggestionScreen";
import SowingPredictionScreen from "../screens/SowingPrediction/SowingPredictionScreen";
import BlogDetailsScreen from "@/screens/Blogs/BlogDetailsScreen";

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
    </Stack.Navigator>
  );
}