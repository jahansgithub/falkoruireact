import { create } from 'zustand';

export type ViewMode = 'graph' | 'table' | 'text';

interface ViewStore {
  view: ViewMode;
  setView: (view: ViewMode) => void;
}

export const useViewStore = create<ViewStore>((set) => ({
  view: 'graph',
  setView: (view) => set({ view }),
}));