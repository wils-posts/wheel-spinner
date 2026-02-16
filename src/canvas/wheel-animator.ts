export interface AnimationConfig {
  startAngle: number;
  targetAngle: number;
  durationMs: number;
  easingFn: (t: number) => number;
  onFrame: (currentAngle: number) => void;
  onTick?: (sliceIndex: number) => void;
  sliceBoundaries?: number[];
  onComplete: () => void;
}

export function startWheelAnimation(config: AnimationConfig): () => void {
  let startTime: number | null = null;
  let rafId: number;
  let lastSliceIndex = -1;

  function frame(timestamp: number) {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const t = Math.min(elapsed / config.durationMs, 1);
    const easedT = config.easingFn(t);
    const currentAngle =
      config.startAngle + (config.targetAngle - config.startAngle) * easedT;

    config.onFrame(currentAngle);

    // Tick detection
    if (config.onTick && config.sliceBoundaries && config.sliceBoundaries.length > 0) {
      const normalizedAngle = ((currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      let currentSliceIndex = 0;
      for (let i = 0; i < config.sliceBoundaries.length; i++) {
        if (normalizedAngle >= config.sliceBoundaries[i]) {
          currentSliceIndex = i + 1;
        }
      }
      if (currentSliceIndex !== lastSliceIndex) {
        lastSliceIndex = currentSliceIndex;
        config.onTick(currentSliceIndex);
      }
    }

    if (t < 1) {
      rafId = requestAnimationFrame(frame);
    } else {
      config.onComplete();
    }
  }

  rafId = requestAnimationFrame(frame);

  return () => cancelAnimationFrame(rafId);
}
