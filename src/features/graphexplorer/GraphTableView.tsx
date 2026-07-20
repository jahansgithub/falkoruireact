import type { GraphQueryResult } from '../../types/graph.type';

export default function GraphTableView({ data }: { data: GraphQueryResult }) {
  // Collect every unique property key across all nodes, in first-seen order
  const allKeys = Array.from(
    new Set(data.nodes.flatMap((node) => Object.keys(node.data ?? {})))
  );

  return (
    <div className="p-3 h-100" style={{ overflow: 'auto' }}>
      <table className="table table-sm table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Labels</th>
            {allKeys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.nodes.map((node) => (
            <tr key={node.id}>
              <td>{node.id}</td>
              <td>{node.labels.join(', ')}</td>
              {allKeys.map((key) => (
                <td key={key}>{String(node.data?.[key] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}