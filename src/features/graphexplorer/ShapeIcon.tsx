import { useEffect, useRef } from 'react';
import { drawShape } from '../../../lib/nodeShapes';
import type { NodeShape } from '../../../lib/nodeShapes';

interface Props {
  shape: NodeShape;
  color: string;
  size?: number;
}

export default function ShapeIcon({ shape, color, size = 16 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Render at device resolution so it stays sharp on high-DPI screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Same function the graph uses. The radius is smaller because
    // the star extends to 1.25x the radius and must fit in the box.
    drawShape(ctx, shape, size / 2, size / 2, size * 0.34);
    ctx.fillStyle = color;
    ctx.fill();
  }, [shape, color, size]);

  return <canvas ref={ref} style={{ width: size, height: size, flexShrink: 0 }} />;
}