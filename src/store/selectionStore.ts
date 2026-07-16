import { create } from 'zustand';
import type { GraphNode } from '../types/graph.type';

interface SelectionStore {
  selectedNode: GraphNode | null;
  selectNode: (node: GraphNode | null) => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
  selectedNode: null,
  selectNode: (node) =>{
    console.log('Setting selectedNode:', node);
    set({ selectedNode: node })}
}));