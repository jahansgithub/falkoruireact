import type { GraphQueryResult } from '../types/graph.type';

export default function GraphTableView({ data }: { data: GraphQueryResult }) {
  return (
    <div className="p-3 h-100" style={{ overflow: 'auto' }}>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Labels</th>
            <th>Properties</th>
          </tr>
        </thead>
        <tbody>
          {data.nodes.map((node) => (
            <tr key={node.id}>
              <td>{node.id}</td>
              <td>{node.labels.join(', ')}</td>
              <td>{JSON.stringify(node.data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}