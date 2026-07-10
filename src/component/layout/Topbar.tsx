import { useState } from 'react';
import "./css/Topbar.css";

export default function Topbar() {
  const [query, setQuery] = useState('');

  return (
    <div className="app-topbar d-flex align-items-center gap-3 px-3 py-2">
      <div className="graph-select d-flex align-items-center gap-1">
        <i className="bi bi-chevron-down"></i>
        <span>Select Graph</span>
      </div>

      <input
        type="text"
        className="query-input flex-grow-1"
        placeholder="Type your query here to start"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button className="run-btn">RUN</button>

      <div className="d-flex align-items-center gap-2 topbar-icons">
        <i className="bi bi-info-circle"></i>
        <i className="bi bi-clock-history"></i>
        <i className="bi bi-arrows-fullscreen"></i>
      </div>
    </div>
  );
}