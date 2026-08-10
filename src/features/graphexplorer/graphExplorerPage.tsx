import { useEffect, useRef } from 'react';
import '@falkordb/canvas';
import { useQueryStore } from '../../store/queryStore';
import { useSelectionStore } from '../../store/selectionStore';
import { useViewStore } from '../../store/viewStore';
import { useLegendStore } from '../../store/legendStore';
import NodeDetailPanel from '../graphexplorer/NodeDetailPanel';
import GraphTableView from '../graphexplorer/GraphTableView';
import NodeSearchInput from './component/NodeSearchInput';
import GraphLegendPanel from './component/GraphLegendPanel';

export default function GraphExplorerPage() {
  const canvasRef = useRef<any>(null);

  const result = useQueryStore((state) => state.result);
  const loading = useQueryStore((state) => state.loading);
  const error = useQueryStore((state) => state.error);

  const selectNode = useSelectionStore((state) => state.selectNode);
  const view = useViewStore((state) => state.view);

  const hiddenLabels = useLegendStore((state) => state.hiddenLabels);
  const hiddenRelationships = useLegendStore((state) => state.hiddenRelationships);

  // Combined: register click handlers AND push data, together, whenever result or legend filters change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result || view !== 'graph') return;

    canvas.setConfig({
      captionsKeys: ['name'],
      eventHandlers: {
        onNodeClick: (node: any, event: MouseEvent) => {
          event?.stopPropagation?.();
          selectNode(node);
        },
        onBackgroundClick: () => selectNode(null),
      },
    });

    const filteredNodes = result.nodes.map((node: any) => ({
      ...node,
      visible: !node.labels?.some((l: string) => hiddenLabels.has(l)),
    }));

    const filteredLinks = result.links.map((link: any) => ({
      ...link,
      visible: !hiddenRelationships.has(link.relationship),
    }));

    canvas.setData({ nodes: filteredNodes, links: filteredLinks });
  }, [view, result, hiddenLabels, hiddenRelationships, selectNode]);

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
    <div className="d-flex h-100" style={{ position: 'relative' }}>
      <div
        className="graph-overlay-column"
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 50,
          maxHeight: '40%',
          overflowY: 'auto',
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <NodeSearchInput canvasRef={canvasRef} />
        </div>
        <div style={{ pointerEvents: 'auto', marginTop: 8 }}>
          <GraphLegendPanel result={result} />
        </div>
      </div>
      <falkordb-canvas
        ref={canvasRef}
        style={{ flex: 1, height: '100%', display: 'block', minWidth: 0 }}
      />
      <NodeDetailPanel />
    </div>
  );
}