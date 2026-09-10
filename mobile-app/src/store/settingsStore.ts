import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface SettingsState {
  notificationsEnabled: boolean;
  darkMode: boolean;
  setNotifications: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  notificationsEnabled: true,
  darkMode: false,
  setNotifications: (enabled) => {
    SecureStore.setItemAsync('notificationsEnabled', JSON.stringify(enabled)).catch(console.error);
    set({ notificationsEnabled: enabled });
  },
  setDarkMode: (enabled) => {
    SecureStore.setItemAsync('darkMode', JSON.stringify(enabled)).catch(console.error);
    set({ darkMode: enabled });
  },
  loadSettings: async () => {
    try {
      const notifStr = await SecureStore.getItemAsync('notificationsEnabled');
      const darkStr = await SecureStore.getItemAsync('darkMode');

      set({
        notificationsEnabled: notifStr ? JSON.parse(notifStr) : true,
        darkMode: darkStr ? JSON.parse(darkStr) : false
      });
    } catch (error) {
      console.error("Failed to load settings from secure store", error);
    }
  }
}));
