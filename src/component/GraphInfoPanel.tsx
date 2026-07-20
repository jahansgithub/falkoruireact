import { useRef, useState } from 'react';
import { useInfoPanelStore } from '../store/infoPanelStore';
import { useGraphStore } from '../store/graphStore';
import { useQueryStore } from '../store/queryStore';
import { computeGraphInfo } from '../lib/computeGraphInfo';
import '../component/layout/css/GraphInfoPanel.css';

export default function GraphInfoPanel() {
  const isOpen = useInfoPanelStore((state) => state.isOpen);
  const close = useInfoPanelStore((state) => state.close);
  const selectedGraph = useGraphStore((state) => state.selectedGraph);
  const result = useQueryStore((state) => state.result);

  const [width, setWidth] = useState(300);
  const isDragging = useRef(false);

  const info = computeGraphInfo(result);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const newWidth = e.clientX; // panel is docked at the left edge of the content area
    if (newWidth >= 220 && newWidth <= 600) {
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  if (!isOpen) return null;

  return (
    <div className="graph-info-panel" style={{ width }}>
      <div className="graph-info-header d-flex justify-content-between align-items-center px-3 py-2">
        <strong>Graph Info</strong>
        <i className="bi bi-x-lg" style={{ cursor: 'pointer' }} onClick={close}></i>
      </div>

      <div className="graph-info-body px-3 py-2">
        <div className="mb-3">
          <div className="text-muted small">Graph Name</div>
          <div>{selectedGraph?.name ?? '—'}</div>
        </div>

        <div className="mb-3">
          <div className="text-muted small">Nodes ({info.nodeCount})</div>
          <div className="d-flex flex-wrap gap-2 mt-1">
            {info.labels.map((label) => (
              <span key={label.name} className="info-chip" style={{ backgroundColor: label.color }}>
                {label.name}
              </span>
            ))}
            {info.labels.length === 0 && <span className="text-muted small">No data loaded</span>}
          </div>
        </div>

        <div className="mb-3">
          <div className="text-muted small">Edges ({info.edgeCount})</div>
          <div className="d-flex flex-wrap gap-2 mt-1">
            {info.relationships.map((rel) => (
              <span key={rel.name} className="info-chip" style={{ backgroundColor: rel.color }}>
                {rel.name}
              </span>
            ))}
            {info.relationships.length === 0 && <span className="text-muted small">No data loaded</span>}
          </div>
        </div>

        <div className="mb-3">
          <div className="text-muted small">Property Keys ({info.propertyKeys.length})</div>
          <div className="d-flex flex-wrap gap-2 mt-1">
            {info.propertyKeys.map((key) => (
              <span key={key} className="info-chip-outline">
                {key}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="graph-info-resize-handle" onMouseDown={handleMouseDown}></div>
    </div>
  );
}