import { create } from 'zustand';
import * as Location from "expo-location";

export interface CropHistory {
  id: string;
  imageUri: string;
  disease: string;
  confidence: string;
  treatment: string;
  date: string;
}

export interface WeatherData {
  temperature: number | string;
  wind: number | string;
  code: number;
  condition: string;
}

interface UserState {
  name: string;
  phone: string;
  location: string;
  farmSize: string;
  mainCrop: string;
  history: CropHistory[];
  weather: WeatherData | null;
  isWeatherLoading: boolean;
  addHistory: (item: CropHistory) => void;
  updateProfile: (data: Partial<UserState>) => void;
  fetchWeather: (force?: boolean) => Promise<void>;
  resetStore: () => void;
}

// Helper to map WMO codes to readable conditions
const getWeatherCondition = (code: number) => {
  if (code === 0) return "Sunny";
  if (code >= 1 && code <= 3) return "Partly Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rainy";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "Clear";
};

const initialState = {
  name: "Farmer",
  phone: "",
  location: "",
  farmSize: "",
  mainCrop: "",
  history: [] as CropHistory[],
  weather: null as WeatherData | null,
  isWeatherLoading: false,
};

export const useUserStore = create<UserState>((set, get) => ({
  ...initialState,
  
  addHistory: (item) => set((state) => ({ history: [item, ...state.history] })),
  updateProfile: (data) => set((state) => ({ ...state, ...data })),
  resetStore: () => set(initialState),
  
  fetchWeather: async (force?: boolean) => {
    // Prevent duplicate fetching if already loading (unless forced by pull-to-refresh)
    if (get().isWeatherLoading && !force) return;
    
    set({ isWeatherLoading: true });
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        set({ 
          weather: { temperature: "--", wind: "--", code: 0, condition: "Permission Denied" }, 
          isWeatherLoading: false 
        });
        return;
      }

      // Grab cached location first (instant) to prevent infinite hanging
      let locationObj = await Location.getLastKnownPositionAsync({});

      // If no cache exists, use Low accuracy (Network-based) instead of GPS
      if (!locationObj) {
        locationObj = await Location.getCurrentPositionAsync({ 
          accuracy: Location.Accuracy.Low 
        });
      }

      if (!locationObj) {
        throw new Error("Could not resolve location coordinates.");
      }

      const { latitude, longitude } = locationObj.coords;

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const data = await res.json();
      const current = data.current_weather;

      set({
        weather: {
          temperature: current.temperature,
          wind: current.windspeed,
          code: current.weathercode,
          condition: getWeatherCondition(current.weathercode)
        },
        isWeatherLoading: false
      });
    } catch (err) {
      console.log("Store Weather error:", err);
      set({ 
        weather: { temperature: "--", wind: "--", code: 0, condition: "Unavailable" }, 
        isWeatherLoading: false 
      });
    }
  }
}));