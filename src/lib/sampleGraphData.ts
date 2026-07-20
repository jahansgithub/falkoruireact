import type { GraphQueryResult } from '../types/graph.type';

export const sampleGraphData: GraphQueryResult = {
  nodes: [
    { id: 1, labels: ['Person'], color: '#5b6bf5', visible: true, data: { name: 'Alice', age: 32 } },
    { id: 2, labels: ['Person'], color: '#5b6bf5', visible: true, data: { name: 'Bob', age: 28 } },
    { id: 3, labels: ['Company'], color: '#f5a623', visible: true, data: { name: 'Infosys' } },
    { id: 4, labels: ['Company'], color: '#f5a623', visible: true, data: { name: 'TCS' } },
    { id: 5, labels: ['Project'], color: '#4caf50', visible: true, data: { name: 'FSA' } },
  ],
  links: [
    { id: 101, source: 1, target: 3, relationship: 'WORKS_AT', visible: true, color: '#999999', data: {} },
    { id: 102, source: 2, target: 4, relationship: 'WORKS_AT', visible: true, color: '#999999', data: {} },
    { id: 103, source: 1, target: 5, relationship: 'CONTRIBUTES_TO', visible: true, color: '#999999', data: {} },
    { id: 104, source: 2, target: 5, relationship: 'CONTRIBUTES_TO', visible: true, color: '#999999', data: {} },
    { id: 105, source: 1, target: 2, relationship: 'KNOWS', visible: true, color: '#999999', data: {} },
  ],
};