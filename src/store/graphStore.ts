import { create } from 'zustand';

export interface GraphItem {
  id: string;
  name: string;
}

interface GraphStore {
  graphs: GraphItem[];
  selectedGraph: GraphItem | null;
  addGraph: (name: string) => void;
  selectGraph: (graph: GraphItem) => void;
}

export const useGraphStore = create<GraphStore>((set) => ({
  graphs: [],
  selectedGraph: null,

  addGraph: (name) =>
    set((state) => {
      const newGraph: GraphItem = { id: crypto.randomUUID(), name };
      return {
        graphs: [...state.graphs, newGraph],
        selectedGraph: newGraph,
      };
    }),

  selectGraph: (graph) => set({ selectedGraph: graph }),
}));