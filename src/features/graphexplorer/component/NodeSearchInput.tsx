import { useState, useRef, useEffect } from 'react';
import { useQueryStore } from '../../../store/queryStore';
import { useSelectionStore } from '../../../store/selectionStore';
import { computeGraphInfo } from '../../../lib/computeGraphInfo';

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
  const activeItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Build a label -> color lookup so each suggestion can show its tag
  const { labels: labelInfo } = computeGraphInfo(result);
  const labelColorMap = new Map(labelInfo.map((l) => [l.name, l.color]));

  const matches = (result?.nodes ?? []).filter((node: any) => {
    if (!query.trim()) return false;
    const name = String(node.data?.name ?? '').toLowerCase();
    const id = String(node.id ?? '').toLowerCase();
    const labelsStr = (node.labels ?? []).join(' ').toLowerCase();
    const q = query.toLowerCase();
    return name.includes(q) || id.includes(q) || labelsStr.includes(q);
  });

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
              ref={index === activeIndex ? activeItemRef : null}
              className={`node-search-suggestion-item ${index === activeIndex ? 'active' : ''}`}
              onMouseDown={() => handleSelect(node)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className="node-search-result-label">
                {node.data?.name ?? `Node ${node.id}`}
              </span>
              <span className="node-search-tags">
                {(node.labels ?? []).map((label: string) => (
                  <span
                    key={label}
                    className="node-search-tag"
                    style={{ backgroundColor: labelColorMap.get(label) ?? '#9ca3af' }}
                  >
                    {label}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}