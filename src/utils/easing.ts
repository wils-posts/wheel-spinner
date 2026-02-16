export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5);
}

export function spinEase(t: number): number {
  if (t < 0.6) {
    return 0.85 * (t / 0.6);
  }
  const localT = (t - 0.6) / 0.4;
  return 0.85 + 0.15 * easeOutCubic(localT);
}
