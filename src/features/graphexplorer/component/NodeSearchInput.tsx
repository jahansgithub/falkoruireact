import { useState } from 'react';
import { useQueryStore } from '../../../store/queryStore';
import { useSelectionStore } from '../../../store/selectionStore';

interface NodeSearchInputProps {
  canvasRef: React.RefObject<any>;
}

export default function NodeSearchInput({ canvasRef }: NodeSearchInputProps) {
  const result = useQueryStore((state) => state.result);
  const selectNode = useSelectionStore((state) => state.selectNode);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const matches = (result?.nodes ?? []).filter((node: any) =>
    query.trim() &&
    String(node.data?.name ?? '').toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (node: any) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.zoomToFit(2, (n: any) => n.id === node.id); // zoom in close on just this node
    }
    selectNode(node); // opens NodeDetailPanel, same as clicking the node directly
    setQuery(node.data?.name ?? '');
    setShowSuggestions(false);
  };

  return (
    <div className="node-search-wrapper">
      <input
        className="node-search-input"
        placeholder="Search for element in the graph..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && matches.length > 0 && (
        <div className="node-search-suggestions">
          {matches.map((node: any) => (
            <div
              key={node.id}
              className="node-search-suggestion-item"
              onMouseDown={() => handleSelect(node)} // onMouseDown fires before input's onBlur
            >
              {node.data?.name ?? `Node ${node.id}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}