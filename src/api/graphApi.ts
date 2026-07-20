import { apiClient } from './client';
import type { ApiQueryResponse } from '../types/apiResponse.types';

export async function executeQuery(graphName: string, cypherQuery: string): Promise<ApiQueryResponse> {
  const { data } = await apiClient.post<ApiQueryResponse>('/query', {
    graphName,
    cypherQuery,
  });
  return data;
}