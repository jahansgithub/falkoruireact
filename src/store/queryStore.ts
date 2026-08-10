
import type { ApiQueryResponse } from '../types/apiResponse.types';
interface QueryStore {
  query: string;
  result: GraphQueryResult | null;
  rawResponse: ApiQueryResponse | null;  // ADD THIS
  loading: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  runQuery: () => Promise<void>;
}

export const useQueryStore = create<QueryStore>((set, get) => ({
  query: '',
  result: null,
  rawResponse: null,  // ADD THIS
  loading: false,
  error: null,

  setQuery: (query) => set({ query }),

  runQuery: async () => {
    const { query } = get();

    if (!query.trim()) {
      set({ error: 'Query cannot be empty', result: null, rawResponse: null });
      return;
    }

    const selectedGraph = useGraphStore.getState().selectedGraph;
    if (!selectedGraph) {
      set({ error: 'Select a graph first', result: null, rawResponse: null });
      return;
    }

    set({ loading: true, error: null });

    try {
      const apiResponse = await executeQuery(selectedGraph.name, query);
      const graphData = mapApiResponseToGraphData(apiResponse);
      set({ result: graphData, rawResponse: apiResponse, loading: false }); // ADD rawResponse HERE
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to run query',
        loading: false,
        result: null,
        rawResponse: null, // ADD THIS
      });
    }
  },
}));