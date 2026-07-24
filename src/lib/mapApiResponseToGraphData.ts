// lib/mapApiResponseToGraphData.ts
import type { ApiQueryResponse } from '../types/apiResponse.types';
import type { GraphQueryResult } from '../types/graph.types';

// Palettes to cycle through — add more hex values if you expect many distinct labels/relationship types
const COLOR_PALETTE = [
  '#5b6bf5', // blue
  '#f5a623', // orange
  '#4caf50', // green
  '#e91e63', // pink
  '#9c27b0', // purple
  '#00bcd4', // cyan
  '#ff5722', // deep orange
  '#795548', // brown
];

const EDGE_COLOR_PALETTE = [
  '#f5a623', // orange
  '#e91e63', // pink
  '#5b6bf5', // blue
  '#00bcd4', // cyan
  '#4caf50', // green
  '#9c27b0', // purple
  '#ff5722', // deep orange
  '#795548', // brown
];

// Tracks which color each key (label or relationship type) has already been
// assigned, so the same key always gets the same color within one query result
function createColorAssigner(palette: string[]) {
  const assigned = new Map<string, string>();
  let nextIndex = 0;

  return function getColor(key: string): string {
    if (!assigned.has(key)) {
      assigned.set(key, palette[nextIndex % palette.length]);
      nextIndex++;
    }
    return assigned.get(key)!;
  };
}

// --- Shape detection helpers ---
// FalkorDB/Cypher can return raw nodes, raw edges, full paths (with .nodes/.edges
// arrays), or arrays/nested combinations of any of these depending on the query.
// These helpers let us figure out what any given value actually is.

function isPathObject(value: any): boolean {
  return (
    value &&
    typeof value === 'object' &&
    Array.isArray(value.nodes) &&
    Array.isArray(value.edges)
  );
}

function isNodeObject(value: any): boolean {
  return value && typeof value === 'object' && Array.isArray(value.labels);
}

function isEdgeObject(value: any): boolean {
  return (
    value &&
    typeof value === 'object' &&
    typeof (value.relationShipType ?? value.relationshipType) === 'string' &&
    'source' in value
  );
}

// Recursively walk any value — could be a node, edge, path, array of any of
// these, or a plain scalar (string/number/null) — and extract nodes/edges
// wherever they appear, at any nesting depth. This makes the mapper resilient
// to ANY query shape (RETURN p, RETURN n, e, m, RETURN collect(n), etc.)
// without needing future updates per query style.
function extractGraphElements(
  value: any,
  addNode: (n: any) => void,
  addEdge: (e: any) => void
) {
  if (value == null) return; // null/undefined column — skip (e.g. "e": null from OPTIONAL MATCH)

  if (Array.isArray(value)) {
    value.forEach((item) => extractGraphElements(item, addNode, addEdge));
    return;
  }

  if (typeof value !== 'object') return; // scalar (string, number, boolean) — nothing to extract

  if (isPathObject(value)) {
    value.nodes.forEach((n: any) => addNode(n));
    value.edges.forEach((e: any) => addEdge(e));
    return;
  }

  if (isNodeObject(value)) {
    addNode(value);
    return;
  }

  if (isEdgeObject(value)) {
    addEdge(value);
    return;
  }

  // Unrecognized object shape (e.g. a plain map returned by Cypher) — ignore safely
}

export function mapApiResponseToGraphData(response: ApiQueryResponse): GraphQueryResult {
  const nodeMap = new Map<number, any>();
  const linkMap = new Map<number, any>();
  const getColorForLabel = createColorAssigner(COLOR_PALETTE); // fresh per query result
  const getColorForRelationship = createColorAssigner(EDGE_COLOR_PALETTE); // fresh per query result

  const addNode = (node: any) => {
    if (!node || nodeMap.has(node.id)) return;
    const primaryLabel = node.labels?.[0] || 'Unknown';
    nodeMap.set(node.id, {
      id: node.id,
      labels: node.labels,
      color: getColorForLabel(primaryLabel),
      visible: true,
      size: 12,
      data: node.properties ?? {},
    });
  };

  const addEdge = (edge: any) => {
    if (!edge || linkMap.has(edge.id)) return;
    const relType = edge.relationShipType ?? edge.relationshipType;
    linkMap.set(edge.id, {
      id: edge.id,
      source: edge.source,
      target: edge.destination ?? edge.target,
      relationship: relType,
      visible: true,
      color: getColorForRelationship(relType),
      data: edge.properties ?? {},
    });
  };

  response.rows.forEach((row: any) => {
    Object.values(row).forEach((value: any) => {
      extractGraphElements(value, addNode, addEdge);
    });
  });

  return {
    nodes: Array.from(nodeMap.values()),
    links: Array.from(linkMap.values()),
  };
}