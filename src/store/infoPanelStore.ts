import { create } from 'zustand';

interface InfoPanelStore {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const useInfoPanelStore = create<InfoPanelStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));