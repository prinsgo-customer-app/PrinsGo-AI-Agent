import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WorkspaceState {
  workspaceId: string | null;
  setWorkspaceId: (id: string) => Promise<void>;
  loadWorkspaceId: () => Promise<void>;
  clearWorkspace: () => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaceId: null,

  setWorkspaceId: async (id: string) => {
    try {
      await AsyncStorage.setItem('workspaceId', id);
      set({ workspaceId: id });
    } catch (error) {
      console.error('Error saving workspaceId:', error);
    }
  },

  loadWorkspaceId: async () => {
    try {
      const id = await AsyncStorage.getItem('workspaceId');
      if (id) {
        set({ workspaceId: id });
      }
    } catch (error) {
      console.error('Error loading workspaceId:', error);
    }
  },

  clearWorkspace: async () => {
    try {
      await AsyncStorage.removeItem('workspaceId');
      set({ workspaceId: null });
    } catch (error) {
      console.error('Error clearing workspaceId:', error);
    }
  }
}));
