import { useState, useRef } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = (result?.nodes ?? []).filter((node: any) =>
    query.trim() &&
    String(node.data?.name ?? '').toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (node: any) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.zoomToFit(2, (n: any) => n.id === node.id);
    }
    selectNode(node);
    setQuery(node.data?.name ?? '');
    setShowSuggestions(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || matches.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + matches.length) % matches.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = activeIndex >= 0 ? matches[activeIndex] : matches[0];
      handleSelect(chosen);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="node-search-wrapper">
      <input
        ref={inputRef}
        className="node-search-input"
        placeholder="Search for element in the graph..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && matches.length > 0 && (
        <div className="node-search-suggestions">
          {matches.map((node: any, index: number) => (
            <div
              key={node.id}
              className={`node-search-suggestion-item ${index === activeIndex ? 'active' : ''}`}
              onMouseDown={() => handleSelect(node)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {node.data?.name ?? `Node ${node.id}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}