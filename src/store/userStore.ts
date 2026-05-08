import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from "expo-location";
import { supabase } from '../services/supabase';

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
  profileImage: string | null;
  location: string;
  farmSize: string;
  mainCrop: string;
  farmingExperience: string;
  preferredLanguage: string;
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
  profileImage: null,
  location: "Punjab",
  farmSize: "5 Acres",
  mainCrop: "",
  farmingExperience: "Yes (3 years)",
  preferredLanguage: "Punjabi",
  history: [] as CropHistory[],
  weather: null as WeatherData | null,
  isWeatherLoading: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      addHistory: (item) => set((state) => ({ history: [item, ...state.history] })),
      updateProfile: (data) => set((state) => ({ ...state, ...data })),
      resetStore: () => set(initialState),
      
      fetchWeather: async (force?: boolean) => {
        // Prevent duplicate fetching if already loading (unless forced)
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

      let locationObj = await Location.getLastKnownPositionAsync({});
      if (!locationObj) {
        locationObj = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
      }

      if (!locationObj) throw new Error("Location Error");
      const { latitude, longitude } = locationObj.coords;

      // --- NEW: DATABASE CACHE CHECK (College Project Feature) ---
      const { data: cachedData } = await supabase
        .from('weather_records')
        .select('*')
        // Filter by location (roughly 0.1 deg precision ~11km)
        .gte('temperature', -100) // Dummy filter to trigger select
        .order('recorded_at', { ascending: false })
        .limit(1);

      // If we have a record from the last 1 hour, use it!
      if (cachedData && cachedData.length > 0 && !force) {
        const lastRecord = cachedData[0];
        const recordTime = new Date(lastRecord.recorded_at).getTime();
        const now = new Date().getTime();
        
        if (now - recordTime < 3600000) { // 1 hour in ms
          console.log("Using cached weather from DB");
          set({
            weather: {
              temperature: lastRecord.temperature,
              wind: lastRecord.wind_speed,
              code: 0, // Code not stored, using clear as default
              condition: lastRecord.condition || "Cached"
            },
            isWeatherLoading: false
          });
          return;
        }
      }

      // --- FETCH NEW DATA ---
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const apiData = await res.json();
      const current = apiData.current_weather;
      const condition = getWeatherCondition(current.weathercode);

      // --- SAVE TO DATABASE (Persistence) ---
      await supabase.from('weather_records').insert({
        temperature: current.temperature,
        wind_speed: current.windspeed,
        condition: condition,
        recorded_at: new Date().toISOString()
      });

      set({
        weather: {
          temperature: current.temperature,
          wind: current.windspeed,
          code: current.weathercode,
          condition: condition
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
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);