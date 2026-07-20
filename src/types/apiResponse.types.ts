// types/apiResponse.types.ts
export interface ApiNode {
  id: number;
  labels: string[];
  properties: Record<string, any>;
}

export interface ApiEdge {
  id: number;
  relationShipType: string;   // matches backend's actual casing — keep as-is unless you fix it server-side
  source: number;
  destination: number;
  properties: Record<string, any>;
}

export interface ApiPath {
  nodes: ApiNode[];
  edges: ApiEdge[];
}

export interface ApiQueryResponse {
  graphName: string;
  executedQuery: string;
  columns: string[];
  rows: { p: ApiPath }[];
  statistics: Record<string, any>;
}