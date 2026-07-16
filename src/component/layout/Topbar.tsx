import { Dropdown } from 'react-bootstrap';
import { useGraphStore } from '../../store/graphStore';
import {useQueryStore } from '../../store/queryStore';

export default function Topbar() {
  const graphs = useGraphStore((state) => state.graphs);
  const selectedGraph = useGraphStore((state) => state.selectedGraph);
  const selectGraph = useGraphStore((state) => state.selectGraph);

  const query = useQueryStore((state) => state.query);
  const setQuery = useQueryStore((state) => state.setQuery);
  const runQuery = useQueryStore((state) => state.runQuery);
  const loading = useQueryStore((state) => state.loading);

  return (
    <div className="app-topbar d-flex align-items-center gap-3 px-3 py-2">
      <Dropdown>
        <Dropdown.Toggle className="graph-select-toggle" variant="light">
          <i className="bi bi-chevron-down me-2"></i>
          {selectedGraph ? selectedGraph.name : 'Select Graph'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {graphs.length === 0 && <Dropdown.Item disabled>No graphs yet</Dropdown.Item>}
          {graphs.map((graph) => (
            <Dropdown.Item key={graph.id} onClick={() => selectGraph(graph)}>
              {graph.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <input
        type="text"
        className="query-input flex-grow-1"
        placeholder="Type your query here to start"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && runQuery()}
      />

      <button className="run-btn" onClick={runQuery} disabled={loading}>
        {loading ? '...' : 'RUN'}
      </button>

      <div className="d-flex align-items-center gap-2 topbar-icons">
        <i className="bi bi-info-circle"></i>
        <i className="bi bi-clock-history"></i>
        <i className="bi bi-arrows-fullscreen"></i>
      </div>
    </div>
  );
}