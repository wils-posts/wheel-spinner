import type { WheelItem, WheelSettings } from '../types';

export function applyCooldowns(
  items: WheelItem[],
  winnerId: string,
  settings: WheelSettings,
): WheelItem[] {
  return items.map((item) => {
    const updated = { ...item };

    // Decrement spin-based cooldowns for ALL items
    if (updated.cooldownSpinsRemaining > 0) {
      updated.cooldownSpinsRemaining -= 1;
    }

    // Apply new cooldown/elimination to the winner
    if (item.id === winnerId) {
      if (settings.cooldownMode === 'by-spins' && item.cooldownSpins > 0) {
        updated.cooldownSpinsRemaining = item.cooldownSpins;
      }
      if (settings.cooldownMode === 'by-time' && item.cooldownTimeMs > 0) {
        updated.cooldownExpiresAt = Date.now() + item.cooldownTimeMs;
      }
      if (item.removeAfterSpin || settings.autoRemoveAfterSelection) {
        updated.temporarilyEliminated = true;
      }
    }

    return updated;
  });
}
