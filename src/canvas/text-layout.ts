import {
  LABEL_FONT_FAMILY,
  LABEL_FONT_SIZE_MAX,
  LABEL_FONT_SIZE_MIN,
  LABEL_MAX_WIDTH_RATIO,
  MIN_SLICE_ARC_FOR_LABEL,
} from '../utils/constants';

export function drawSliceLabel(
  ctx: CanvasRenderingContext2D,
  label: string,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  sliceAngle: number,
): void {
  const arcLength = sliceAngle * radius;
  if (arcLength < MIN_SLICE_ARC_FOR_LABEL) return;

  const midAngle = startAngle + sliceAngle / 2;
  const maxLabelWidth = radius * LABEL_MAX_WIDTH_RATIO;

  // Find a font size that fits
  let fontSize = LABEL_FONT_SIZE_MAX;
  ctx.font = `${fontSize}px ${LABEL_FONT_FAMILY}`;

  let displayLabel = label;
  let measured = ctx.measureText(displayLabel);

  // Reduce font size if needed
  while (measured.width > maxLabelWidth && fontSize > LABEL_FONT_SIZE_MIN) {
    fontSize -= 1;
    ctx.font = `${fontSize}px ${LABEL_FONT_FAMILY}`;
    measured = ctx.measureText(displayLabel);
  }

  // Truncate with ellipsis if still too wide
  if (measured.width > maxLabelWidth) {
    while (displayLabel.length > 1 && ctx.measureText(displayLabel + '…').width > maxLabelWidth) {
      displayLabel = displayLabel.slice(0, -1);
    }
    displayLabel += '…';
  }

  // Position label along the middle of the slice
  const labelRadius = radius * 0.55;
  const x = centerX + Math.cos(midAngle) * labelRadius;
  const y = centerY + Math.sin(midAngle) * labelRadius;

  ctx.save();
  ctx.translate(x, y);

  // Rotate text to follow the slice angle
  let textAngle = midAngle;
  // Flip text if it would be upside down
  if (midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2) {
    textAngle += Math.PI;
  }
  ctx.rotate(textAngle);

  ctx.fillStyle = '#1a1a2e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(displayLabel, 0, 0);
  ctx.restore();
}
