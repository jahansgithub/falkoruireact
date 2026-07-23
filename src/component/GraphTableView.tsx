import type { GraphQueryResult } from '../types/graph.type';
import * as XLSX from 'xlsx';
export default function GraphTableView({ data }: { data: GraphQueryResult }) {

 const allKeys = Array.from(
    new Set(data.nodes.flatMap((node) => Object.keys(node.data ?? {})))
  );

  const handleExportExcel = () => {
    if (!data || data.nodes.length === 0) return;

    const rows = data.nodes.map((node) => {
      const row: Record<string, any> = { ID: node.id, Labels: node.labels.join(', ') };
      allKeys.forEach((key) => {
        row[key] = node.data?.[key] ?? '';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Graph Data');
    XLSX.writeFile(workbook, 'graph-export.xlsx');
  };
  return (
    <div className="p-3 h-100" style={{ overflow: 'auto' }}>
      <button className="export-btn" onClick={handleExportExcel}>
  <i className="bi bi-file-earmark-excel me-1"></i> Export to Excel
</button>
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