import { generateSliceColors } from './color-palette';
import { drawSliceLabel } from './text-layout';
import { SLICE_BORDER_WIDTH, SLICE_BORDER_COLOR } from '../utils/constants';

export interface WheelSlice {
  label: string;
  weight: number;
}

export function renderStaticWheel(
  slices: WheelSlice[],
  radius: number,
  isDark = false,
): HTMLCanvasElement {
  const diameter = radius * 2;
  const canvas = document.createElement('canvas');
  canvas.width = diameter;
  canvas.height = diameter;
  const ctx = canvas.getContext('2d')!;
  const center = radius;

  if (slices.length === 0) {
    // Draw empty state
    ctx.beginPath();
    ctx.arc(center, center, radius - 2, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#2a2a3e' : '#e8e8ec';
    ctx.fill();
    ctx.fillStyle = isDark ? '#888' : '#999';
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Add items to spin', center, center);
    return canvas;
  }

  const totalWeight = slices.reduce((sum, s) => sum + s.weight, 0);
  const colors = generateSliceColors(slices.length, isDark);

  let currentAngle = 0;
  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i];
    const sliceAngle = (slice.weight / totalWeight) * Math.PI * 2;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius - 2, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    // Draw border
    ctx.strokeStyle = SLICE_BORDER_COLOR;
    ctx.lineWidth = SLICE_BORDER_WIDTH;
    ctx.stroke();

    // Draw label
    drawSliceLabel(ctx, slice.label, center, center, radius, currentAngle, sliceAngle);

    currentAngle += sliceAngle;
  }

  // Draw center circle
  ctx.beginPath();
  ctx.arc(center, center, radius * 0.06, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? '#1a1a2e' : '#ffffff';
  ctx.fill();
  ctx.strokeStyle = isDark ? '#444' : '#ccc';
  ctx.lineWidth = 2;
  ctx.stroke();

  return canvas;
}
