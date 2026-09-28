export type NodeShape = 'circle' | 'star' | 'square' | 'diamond' | 'triangle' | 'hexagon';

const SHAPES: NodeShape[] = ['circle', 'star', 'square', 'diamond', 'triangle', 'hexagon'];
const assigned = new Map<string, NodeShape>();

// Same label always gets the same shape for the whole session
export function getShapeForLabel(label: string): NodeShape {
  if (!assigned.has(label)) assigned.set(label, SHAPES[assigned.size % SHAPES.length]);
  return assigned.get(label)!;
}

export function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: NodeShape,
  x: number,
  y: number,
  r: number
) {
  ctx.beginPath();
  switch (shape) {
    case 'star': {
      const outer = r * 1.25;
      const inner = r * 0.55;
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? outer : inner;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
    case 'square':
      ctx.rect(x - r, y - r, r * 2, r * 2);
      break;
    case 'diamond':
      ctx.moveTo(x, y - r * 1.2);
      ctx.lineTo(x + r * 1.2, y);
      ctx.lineTo(x, y + r * 1.2);
      ctx.lineTo(x - r * 1.2, y);
      ctx.closePath();
      break;
    case 'triangle':
      ctx.moveTo(x, y - r * 1.2);
      ctx.lineTo(x + r * 1.1, y + r * 0.8);
      ctx.lineTo(x - r * 1.1, y + r * 0.8);
      ctx.closePath();
      break;
    case 'hexagon':
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = x + Math.cos(angle) * r * 1.1;
        const py = y + Math.sin(angle) * r * 1.1;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    default:
      ctx.arc(x, y, r, 0, Math.PI * 2);
  }
}