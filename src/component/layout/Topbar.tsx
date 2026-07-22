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

  const [lineCount, setLineCount] = useState(1);
const lineNumbersRef = useRef<HTMLDivElement>(null);

const handleScroll = () => {
  if (lineNumbersRef.current && textareaRef.current) {
    lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
  }
};

const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setQuery(e.target.value);
  setLineCount(e.target.value.split('\n').length);
};

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

   <div className={`query-editor flex-grow-1 ${isFocused ? 'query-editor-expanded' : ''}`}>
  {isFocused && (
    <div className="query-line-numbers" ref={lineNumbersRef}>
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  )}
  <textarea
    ref={textareaRef}
    className="query-input"
    placeholder="Type your query here to start"
    value={query}
    onChange={handleChange}
    onScroll={handleScroll}
    onFocus={() => setIsFocused(true)}
    onBlur={() => setIsFocused(false)}
    onKeyDown={handleKeyDown}
    rows={1}
  />
</div>

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