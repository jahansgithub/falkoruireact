import { create } from 'zustand';
import type { GraphQueryResult } from '../types/graph.types';
import { sampleGraphData } from '../lib/sampleGraphData';

interface QueryStore {
  query: string;
  result: GraphQueryResult | null;
  loading: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  runQuery: () => Promise<void>;
}

export const useQueryStore = create<QueryStore>((set, get) => ({
  query: '',
  result: null,
  loading: false,
  error: null,

  setQuery: (query) => set({ query }),

  runQuery: async () => {
    const { query } = get();
    if (!query.trim()) {
      set({ error: 'Query cannot be empty', result: null });
      return;
    }

    set({ loading: true, error: null });

    try {
      // TODO: replace with real call to your Spring Boot endpoint
      // const { data } = await apiClient.post('/graph/query', { query });
      await new Promise((resolve) => setTimeout(resolve, 400));
      set({ result: sampleGraphData, loading: false });
    } catch (err: any) {
      set({ error: 'Failed to run query', loading: false, result: null });
    }
  },
}));