import { useState, useEffect, useRef, type RefObject } from 'react';

interface CanvasSize {
  width: number;
  height: number;
}

export function useCanvasSize(containerRef: RefObject<HTMLDivElement | null>): CanvasSize {
  const [size, setSize] = useState<CanvasSize>({ width: 400, height: 400 });
  const lastWidthRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width } = entry.contentRect;

      // Only update when width actually changes.
      // On mobile, height fluctuates as browser chrome (address bar)
      // shows/hides, causing the wheel to visibly grow and shrink.
      // Since the container uses aspectRatio: 1, width alone
      // determines the square size.
      if (Math.abs(width - lastWidthRef.current) < 1) return;
      lastWidthRef.current = width;

      const side = Math.floor(width);
      setSize({ width: side, height: side });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  return size;
}
