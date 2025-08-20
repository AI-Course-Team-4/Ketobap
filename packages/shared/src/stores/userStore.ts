import { create } from 'zustand';
import { UserPreferences } from '../types';

interface UserState {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  clearPreferences: () => void;
  hasPreferences: () => boolean;
}

const initialPreferences: UserPreferences = {
  preferredFoods: [],
  dislikedFoods: [],
  allergies: [],
  customPreferred: '',
  customDisliked: '',
  customAllergies: ''
};

export const useUserStore = create<UserState>((set, get) => ({
  preferences: initialPreferences,

  setPreferences: (preferences) => {
    set({ preferences });
  },

  updatePreferences: (updates) => {
    set((state) => ({
      preferences: { ...state.preferences, ...updates }
    }));
  },

  clearPreferences: () => {
    set({ preferences: initialPreferences });
  },

  hasPreferences: () => {
    const { preferences } = get();
    return (
      preferences.preferredFoods.length > 0 ||
      preferences.dislikedFoods.length > 0 ||
      preferences.allergies.length > 0 ||
      !!preferences.customPreferred ||
      !!preferences.customDisliked ||
      !!preferences.customAllergies
    );
  }
}));
