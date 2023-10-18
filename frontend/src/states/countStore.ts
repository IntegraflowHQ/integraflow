import { create } from 'zustand';

interface CountState {
  count: number;
  increment: () => void;
  clearCount: () => void;
}

export const useCountStore = create<CountState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  clearCount: () => set({ count: 0 }),
}))