import { create } from 'zustand';

interface TaskState {
  tasks: Record<string, unknown>[];
  setTasks: (tasks: Record<string, unknown>[]) => void;
  addTask: (task: Record<string, unknown>) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] }))
}));