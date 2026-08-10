import { useLegendStore } from '../../../store/legendStore';
import { computeGraphInfo } from '../../../lib/computeGraphInfo';
import type { GraphQueryResult } from '../../../types/graph.types';

interface Props {
  result: GraphQueryResult | null;
}

export function GraphLegendPanel({ result }: Props) {
  const { hiddenLabels, hiddenRelationships, toggleLabel, toggleRelationship } = useLegendStore();

  if (!result) return null;
  const { labels, relationships } = computeGraphInfo(result);

  return (
    <div className="graph-legend-panel" style={{ pointerEvents: 'auto' }}>
      {labels.length > 0 && (
        <div className="legend-section">
          <div className="legend-section-title">Labels</div>
          {labels.map((label) => {
            const hidden = hiddenLabels.has(label.name);
            return (
              <div
                key={label.name}
                className="legend-item"
                onClick={() => toggleLabel(label.name)}
                style={{
                  cursor: 'pointer',
                  opacity: hidden ? 0.4 : 1,
                  textDecoration: hidden ? 'line-through' : 'none',
                }}
              >
                <span className="legend-dot" style={{ backgroundColor: label.color }} />
                {label.name}
              </div>
            );
          })}
        </div>
      )}

      {relationships.length > 0 && (
        <div className="legend-section">
          <div className="legend-section-title">Relationships</div>
          {relationships.map((rel) => {
            const hidden = hiddenRelationships.has(rel.name);
            return (
              <div
                key={rel.name}
                className="legend-item"
                onClick={() => toggleRelationship(rel.name)}
                style={{
                  cursor: 'pointer',
                  opacity: hidden ? 0.4 : 1,
                  textDecoration: hidden ? 'line-through' : 'none',
                }}
              >
                <span className="legend-dot" style={{ backgroundColor: rel.color }} />
                {rel.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}