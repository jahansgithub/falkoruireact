import * as XLSX from 'xlsx';
import { useQueryStore } from '../../../store/queryStore';
import type { GraphQueryResult } from '../../../types/graph.types';

export default function GraphTableView({ data }: { data: GraphQueryResult }) {
  const rawResponse = useQueryStore((state) => state.rawResponse);

  const allKeys = Array.from(
    new Set(data.nodes.flatMap((node) => Object.keys(node.data ?? {})))
  );

  // Existing clean/flattened export — unchanged
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

  // New raw/column-based export
  const handleExportRawExcel = () => {
    if (!rawResponse) return;

    const rows = rawResponse.rows.map((row: any) => {
      const flatRow: Record<string, string> = {};
      rawResponse.columns.forEach((col: string) => {
        const cellValue = row[col];
        flatRow[col] = cellValue == null ? '' : JSON.stringify(cellValue);
      });
      return flatRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Query Result');
    XLSX.writeFile(workbook, `${rawResponse.graphName || 'graph'}-raw-export.xlsx`);
  };

  return (
    <div className="p-3 h-100" style={{ overflow: 'auto' }}>
      <div className="d-flex gap-2 mb-2">
        <button className="export-btn" onClick={handleExportExcel}>
          <i className="bi bi-file-earmark-excel me-1"></i> Export to Excel
        </button>
        <button className="export-btn" onClick={handleExportRawExcel}>
          <i className="bi bi-file-earmark-spreadsheet me-1"></i> Export Raw Result
        </button>
      </div>

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