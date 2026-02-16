import { useState, useEffect, type RefObject } from 'react';

interface CanvasSize {
  width: number;
  height: number;
}

export function useCanvasSize(containerRef: RefObject<HTMLDivElement | null>): CanvasSize {
  const [size, setSize] = useState<CanvasSize>({ width: 400, height: 400 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const side = Math.min(width, height);
      setSize({ width: side, height: side });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  return size;
}
