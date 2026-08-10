import { create } from 'zustand';

interface LegendState {
  hiddenLabels: Set<string>;
  hiddenRelationships: Set<string>;
  toggleLabel: (label: string) => void;
  toggleRelationship: (relType: string) => void;
}

export const useLegendStore = create<LegendState>((set) => ({
  hiddenLabels: new Set(),
  hiddenRelationships: new Set(),
  toggleLabel: (label) =>
    set((state) => {
      const next = new Set(state.hiddenLabels);
      next.has(label) ? next.delete(label) : next.add(label);
      return { hiddenLabels: next };
    }),
  toggleRelationship: (relType) =>
    set((state) => {
      const next = new Set(state.hiddenRelationships);
      next.has(relType) ? next.delete(relType) : next.add(relType);
      return { hiddenRelationships: next };
    }),
}));