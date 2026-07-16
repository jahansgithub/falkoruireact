import { useSelectionStore } from '../../store/selectionStore';
import '../../component/layout/css/NodeDetailPanel.css';

export default function NodeDetailPanel() {

    const selectedNode = useSelectionStore((state) => state.selectedNode);
    console.log('NodeDetailPanel render, selectedNode:',selectedNode);
  const selectNode = useSelectionStore((state) => state.selectNode);

  if (!selectedNode) return null;

  return (
    <div className="node-detail-panel p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <strong>Node Details</strong>
        <i className="bi bi-x-lg" style={{ cursor: 'pointer' }} onClick={() => selectNode(null)}></i>
      </div>

      <div className="mb-2">
        <div className="text-muted small">Labels</div>
        <div>{selectedNode.labels.join(', ')}</div>
      </div>

      <div className="mb-2">
        <div className="text-muted small">ID</div>
        <div>{selectedNode.id}</div>
      </div>

      <hr />

      <div className="text-muted small mb-1">Properties</div>
      {Object.entries(selectedNode.data).map(([key, value]) => (
        <div key={key} className="d-flex justify-content-between border-bottom py-1 small">
          <span className="text-muted">{key}</span>
          <span>{String(value)}</span>
        </div>
      ))}
    </div>
  );
}