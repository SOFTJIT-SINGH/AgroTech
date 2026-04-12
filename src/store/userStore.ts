import { create } from 'zustand';

export interface CropHistory {
  id: string;
  imageUri: string;
  disease: string;
  confidence: string;
  treatment: string;
  date: string;
}

interface UserState {
  name: string;
  phone: string;
  location: string;
  farmSize: string;
  mainCrop: string;
  history: CropHistory[];
  addHistory: (item: CropHistory) => void;
  updateProfile: (data: Partial<UserState>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: "Surinder Singh",
  phone: "+91 9876543210",
  location: "Punjab, India",
  farmSize: "5 Acres",
  mainCrop: "Wheat",
  history: [],
  addHistory: (item) => set((state) => ({ history: [item, ...state.history] })),
  updateProfile: (data) => set((state) => ({ ...state, ...data })),
}));
