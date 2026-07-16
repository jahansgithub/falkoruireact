import { useEffect, useRef } from 'react';
import '@falkordb/canvas';
import { useQueryStore } from '../../store/queryStore';
import { useSelectionStore } from '../../store/selectionStore';
import { useViewStore } from '../../store/viewStore';
import NodeDetailPanel from '../graphexplorer/NodeDetailPanel';
import GraphTableView from '../graphexplorer/GraphTableView';

export default function GraphExplorerPage() {
  const canvasRef = useRef<any>(null);

  const result = useQueryStore((state) => state.result);
  const loading = useQueryStore((state) => state.loading);
  const error = useQueryStore((state) => state.error);

  const selectNode = useSelectionStore((state) => state.selectNode);
  const view = useViewStore((state) => state.view);

  // Combined: register click handlers AND push data, together, whenever result changes
  useEffect(() => {
    const canvas = canvasRef.current;
    console.log('Canvas ref:', canvas);
  console.log('setConfig exists?', typeof canvas?.setConfig)
    if (!canvas || !result) return;

    canvas.setConfig({
      debug: true,
      eventHandlers: {
        onNodeClick: (node: any) => {
          console.log('Clicked node:', node); // temporary — confirm this fires
          selectNode(node);
        },
        onBackgroundClick: () => selectNode(null),
      },
    });

    canvas.setData(result);
  }, [result]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
        Running query...
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 text-danger">
        {error}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
        Type a query above and hit RUN to see the graph.
      </div>
    );
  }

  if (view === 'table') {
    return <GraphTableView data={result} />;
  }

  if (view === 'text') {
    return (
      <pre className="p-3" style={{ height: '100%', overflow: 'auto', margin: 0 }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    );
  }

  return (
    <div className="d-flex h-100">
      <falkordb-canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      <NodeDetailPanel />
    </div>
  );
}