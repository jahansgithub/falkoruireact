import { useEffect, useRef } from 'react';
import '@falkordb/canvas';
import { useQueryStore } from '../../store/queryStore';

export default function GraphExplorerPage() {
  
  const canvasRef = useRef<any>(null);
  const result = useQueryStore((state) => state.result);
  const loading = useQueryStore((state) => state.loading);
  const error = useQueryStore((state) => state.error);

  useEffect(() => {
    if (result && canvasRef.current) {
      canvasRef.current.setData(result);
    }
  }, [result]);

  if (loading) return <div className="d-flex align-items-center justify-content-center h-100 text-muted">Running query...</div>;
  if (error) return <div className="d-flex align-items-center justify-content-center h-100 text-danger">{error}</div>;
  if (!result) return <div className="d-flex align-items-center justify-content-center h-100 text-muted">Type a query above and hit RUN to see the graph.</div>;

  return (
    <falkordb-canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}