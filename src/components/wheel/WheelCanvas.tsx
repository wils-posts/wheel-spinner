import { useRef, useEffect, useMemo } from 'react';
import { useCanvasSize } from '../../hooks/useCanvasSize';
import { useSpinStore } from '../../stores/spin-store';
import { useActiveProfile } from '../../stores/profile-store';
import { renderStaticWheel } from '../../canvas/wheel-renderer';
import { drawPointer } from '../../canvas/pointer-renderer';
import { getEligibleItems } from '../../engine/weighted-selection';
import type { WheelSlice } from '../../canvas/wheel-renderer';

export function WheelCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticWheelRef = useRef<HTMLCanvasElement | null>(null);
  const { width, height } = useCanvasSize(containerRef);

  const currentAngle = useSpinStore((s) => s.currentAngleRad);
  const profile = useActiveProfile();

  const slices: WheelSlice[] = useMemo(() => {
    if (!profile) return [];
    return getEligibleItems(profile.items).map((item) => ({
      label: item.label,
      weight: item.weight,
    }));
  }, [profile]);

  // Re-render static wheel when slices or size changes
  useEffect(() => {
    const radius = Math.min(width, height) / 2;
    if (radius <= 0) return;
    staticWheelRef.current = renderStaticWheel(slices, radius);
  }, [slices, width, height]);

  // Draw every frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (staticWheelRef.current) {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(currentAngle);
      ctx.drawImage(staticWheelRef.current, -width / 2, -height / 2);
      ctx.restore();
    }

    drawPointer(ctx, width, height);
  }, [currentAngle, width, height]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        aspectRatio: '1',
        maxWidth: '600px',
        maxHeight: '600px',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%' }}
        role="img"
        aria-label={
          slices.length > 0
            ? `Wheel with ${slices.length} options: ${slices.map((s) => s.label).join(', ')}`
            : 'Empty wheel'
        }
      />
    </div>
  );
}
