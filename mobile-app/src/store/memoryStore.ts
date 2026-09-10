import { create } from 'zustand';

interface MemoryState {
  memories: Record<string, unknown>[];
  setMemories: (memories: Record<string, unknown>[]) => void;
  addMemory: (memory: Record<string, unknown>) => void;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  memories: [],
  setMemories: (memories) => set({ memories }),
  addMemory: (memory) => set((state) => ({ memories: [memory, ...state.memories] }))
}));