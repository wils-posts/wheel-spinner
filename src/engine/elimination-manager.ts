import type { WheelItem } from '../types';

export function resetAllEliminations(items: WheelItem[]): WheelItem[] {
  return items.map((item) => ({
    ...item,
    temporarilyEliminated: false,
  }));
}

export function resetAllCooldowns(items: WheelItem[]): WheelItem[] {
  return items.map((item) => ({
    ...item,
    cooldownSpinsRemaining: 0,
    cooldownExpiresAt: 0,
  }));
}

export function getEliminatedCount(items: WheelItem[]): number {
  return items.filter((i) => i.temporarilyEliminated).length;
}

export function getCooldownCount(items: WheelItem[]): number {
  const now = Date.now();
  return items.filter(
    (i) =>
      i.cooldownSpinsRemaining > 0 ||
      (i.cooldownExpiresAt > 0 && now < i.cooldownExpiresAt),
  ).length;
}
