import type { WheelItem } from '../types';

export interface SelectionResult {
  winnerId: string;
  winnerIndex: number;
  seed: string;
}

function generateSeed(): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0].toString(16).padStart(8, '0');
}

// Mulberry32 PRNG — deterministic given a seed
function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedToNumber(seed: string): number {
  return parseInt(seed, 16) || 0;
}

export function getEligibleItems(items: WheelItem[]): WheelItem[] {
  const now = Date.now();
  return items.filter(
    (item) =>
      item.enabled &&
      !item.temporarilyEliminated &&
      item.cooldownSpinsRemaining <= 0 &&
      (item.cooldownExpiresAt === 0 || now >= item.cooldownExpiresAt),
  );
}

export function selectWinner(
  items: WheelItem[],
  options: {
    allowRepeat: boolean;
    lastWinnerId: string | null;
    seed?: string;
  },
): SelectionResult | null {
  let eligible = getEligibleItems(items);

  if (!options.allowRepeat && options.lastWinnerId) {
    eligible = eligible.filter((item) => item.id !== options.lastWinnerId);
  }

  if (eligible.length === 0) return null;

  // Build cumulative weights
  const cumulative: number[] = [];
  let total = 0;
  for (const item of eligible) {
    total += item.weight;
    cumulative.push(total);
  }

  const seed = options.seed ?? generateSeed();
  const rng = mulberry32(seedToNumber(seed));
  const randomValue = rng() * total;

  // Binary search
  let lo = 0;
  let hi = cumulative.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (cumulative[mid] <= randomValue) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  return {
    winnerId: eligible[lo].id,
    winnerIndex: lo,
    seed,
  };
}
