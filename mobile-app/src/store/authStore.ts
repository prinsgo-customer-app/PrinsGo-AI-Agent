import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  user: Record<string, unknown> | null;
  token: string | null;
  workspaceId: string | null;
  setAuth: (user: Record<string, unknown>, token: string, workspaceId: string) => void;
  logout: () => void;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  workspaceId: null,
  setAuth: (user, token, workspaceId) => {
    SecureStore.setItemAsync('token', token).catch(console.error);
    SecureStore.setItemAsync('workspaceId', workspaceId).catch(console.error);
    SecureStore.setItemAsync('user', JSON.stringify(user)).catch(console.error);
    set({ user, token, workspaceId });
  },
  logout: () => {
    SecureStore.deleteItemAsync('token').catch(console.error);
    SecureStore.deleteItemAsync('workspaceId').catch(console.error);
    SecureStore.deleteItemAsync('user').catch(console.error);
    set({ user: null, token: null, workspaceId: null });
  },
  loadAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const workspaceId = await SecureStore.getItemAsync('workspaceId');
      const userStr = await SecureStore.getItemAsync('user');
      if (token && workspaceId && userStr) {
        set({ user: JSON.parse(userStr), token, workspaceId });
      }
    } catch (error) {
      console.error("Failed to load auth from secure store", error);
    }
  }
}));
