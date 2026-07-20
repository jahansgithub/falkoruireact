// lib/mapApiResponseToGraphData.ts
import type { ApiQueryResponse, ApiNode, ApiEdge } from '../types/apiResponse.types';
import type { GraphQueryResult } from '../types/graph.type';

// A palette to cycle through — add more hex values if you expect many distinct labels
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

// Tracks which color each label has already been assigned, so the same
// label always gets the same color within one query result
function createLabelColorAssigner() {
  const assigned = new Map<string, string>();
  let nextIndex = 0;

  return function getColorForLabel(label: string): string {
    if (!assigned.has(label)) {
      assigned.set(label, COLOR_PALETTE[nextIndex % COLOR_PALETTE.length]);
      nextIndex++;
    }
    return assigned.get(label)!;
  };
}

export function mapApiResponseToGraphData(response: ApiQueryResponse): GraphQueryResult {
  const nodeMap = new Map<number, any>();
  const linkMap = new Map<number, any>();
  const getColorForLabel = createLabelColorAssigner(); // fresh per query result

  response.rows.forEach((row) => {
    row.p.nodes.forEach((node: ApiNode) => {
      if (!nodeMap.has(node.id)) {
        const primaryLabel = node.labels[0] || 'Unknown';
        nodeMap.set(node.id, {
          id: node.id,
          labels: node.labels,
          color: getColorForLabel(primaryLabel),
          visible: true,
          data: node.properties,
        });
      }
    });

    row.p.edges.forEach((edge: ApiEdge) => {
      if (!linkMap.has(edge.id)) {
        linkMap.set(edge.id, {
          id: edge.id,
          source: edge.source,
          target: edge.destination,
          relationship: edge.relationShipType,
          visible: true,
          color: '#999999',
          data: edge.properties,
        });
      }
    });
  });

  return {
    nodes: Array.from(nodeMap.values()),
    links: Array.from(linkMap.values()),
  };
}