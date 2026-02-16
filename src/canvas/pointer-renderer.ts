export function drawPointer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const centerX = width / 2;
  const pointerSize = Math.min(width, height) * 0.05;

  ctx.save();

  // Pointer triangle at top center, pointing down
  ctx.beginPath();
  ctx.moveTo(centerX, pointerSize * 0.3);
  ctx.lineTo(centerX - pointerSize * 0.6, 0);
  ctx.lineTo(centerX + pointerSize * 0.6, 0);
  ctx.closePath();

  ctx.fillStyle = '#e74c3c';
  ctx.fill();

  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}
