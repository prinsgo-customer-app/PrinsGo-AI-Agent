import { create } from 'zustand';

interface AuthState {
  user: Record<string, unknown> | null;
  token: string | null;
  workspaceId: string | null;
  setAuth: (user: Record<string, unknown>, token: string, workspaceId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  workspaceId: null,
  setAuth: (user, token, workspaceId) => set({ user, token, workspaceId }),
  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    set({ user: null, token: null, workspaceId: null });
  }
}));