import { create } from 'zustand';
import type { GraphQueryResult } from '../types/graph.type';
import { executeQuery } from '../api/graphApi';
import { mapApiResponseToGraphData } from '../lib/mapApiResponseToGraphData';
import { useGraphStore } from './graphStore';

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

    const selectedGraph = useGraphStore.getState().selectedGraph;
    if (!selectedGraph) {
      set({ error: 'Select a graph first', result: null });
      return;
    }

    set({ loading: true, error: null });

    try {
      const apiResponse = await executeQuery(selectedGraph.name, query);
      const graphData = mapApiResponseToGraphData(apiResponse);
      set({ result: graphData, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to run query',
        loading: false,
        result: null,
      });
    }
  },
}));