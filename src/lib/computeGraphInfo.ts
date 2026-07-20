import type { GraphQueryResult } from '../types/graph.type';

export interface GraphInfo {
  labels: { name: string; color: string }[];
  relationships: { name: string; color: string }[];
  propertyKeys: string[];
  nodeCount: number;
  edgeCount: number;
}

export function computeGraphInfo(data: GraphQueryResult | null): GraphInfo {
  if (!data) {
    return { labels: [], relationships: [], propertyKeys: [], nodeCount: 0, edgeCount: 0 };
  }

  const labelMap = new Map<string, string>();
  data.nodes.forEach((node: any) => {
    node.labels.forEach((label: string) => {
      if (!labelMap.has(label)) labelMap.set(label, node.color);
    });
  });

  const relMap = new Map<string, string>();
  data.links.forEach((link: any) => {
    if (!relMap.has(link.relationship)) relMap.set(link.relationship, link.color);
  });

  const propertyKeySet = new Set<string>();
  data.nodes.forEach((node: any) => {
    Object.keys(node.data ?? {}).forEach((key) => propertyKeySet.add(key));
  });

  return {
    labels: Array.from(labelMap.entries()).map(([name, color]) => ({ name, color })),
    relationships: Array.from(relMap.entries()).map(([name, color]) => ({ name, color })),
    propertyKeys: Array.from(propertyKeySet),
    nodeCount: data.nodes.length,
    edgeCount: data.links.length,
  };
}