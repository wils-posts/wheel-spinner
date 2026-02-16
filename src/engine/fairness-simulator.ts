import type { WheelItem } from '../types';
import { getEligibleItems } from './weighted-selection';

export interface SimulationResult {
  itemId: string;
  label: string;
  expected: number;
  actual: number;
}

export function simulateSpins(
  items: WheelItem[],
  count: number = 1000,
): SimulationResult[] {
  const eligible = getEligibleItems(items);
  if (eligible.length === 0) return [];

  const totalWeight = eligible.reduce((s, i) => s + i.weight, 0);
  const hits = new Map<string, number>();

  for (let i = 0; i < count; i++) {
    // Simple weighted random (no cooldowns/eliminations in sim)
    const r = Math.random() * totalWeight;
    let cum = 0;
    for (const item of eligible) {
      cum += item.weight;
      if (r < cum) {
        hits.set(item.id, (hits.get(item.id) ?? 0) + 1);
        break;
      }
    }
  }

  return eligible.map((item) => ({
    itemId: item.id,
    label: item.label,
    expected: (item.weight / totalWeight) * 100,
    actual: ((hits.get(item.id) ?? 0) / count) * 100,
  }));
}
