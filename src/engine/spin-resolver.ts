import type { WheelItem, WheelSettings } from '../types';
import { selectWinner, getEligibleItems } from './weighted-selection';
import { POINTER_ANGLE } from '../utils/constants';

export interface SpinResolution {
  winnerId: string;
  winnerLabel: string;
  targetAngleRad: number;
  durationMs: number;
  seed: string;
}

export function resolveSpinTarget(
  items: WheelItem[],
  settings: WheelSettings,
  animationSpeedMultiplier: number,
  lastWinnerId: string | null,
  currentWheelAngle: number,
): SpinResolution | null {
  const result = selectWinner(items, {
    allowRepeat: settings.allowRepeatWinners,
    lastWinnerId,
  });
  if (!result) return null;

  // The visual wheel always shows ALL eligible items (not filtering lastWinner).
  // selectWinner may filter out lastWinner when allowRepeat is false, so
  // winnerIndex is into that potentially-smaller list. We need to find the
  // winner's angle in the VISUAL wheel's eligible list (which matches the renderer).
  const visualEligible = getEligibleItems(items);
  const totalWeight = visualEligible.reduce((s, i) => s + i.weight, 0);

  // Find the winning item's position in the visual wheel
  const winnerItem = visualEligible.find((item) => item.id === result.winnerId);
  if (!winnerItem) return null;

  let angleStart = 0;
  for (const item of visualEligible) {
    if (item.id === result.winnerId) break;
    angleStart += (item.weight / totalWeight) * Math.PI * 2;
  }
  const sliceAngle = (winnerItem.weight / totalWeight) * Math.PI * 2;

  // Apply boundary bias: shift landing toward center of slice
  const bias = settings.boundaryBias;
  const biasedMin = angleStart + sliceAngle * (0.5 - 0.5 * (1 - bias));
  const biasedMax = angleStart + sliceAngle * (0.5 + 0.5 * (1 - bias));
  const landingAngle = biasedMin + Math.random() * (biasedMax - biasedMin);

  // Geometry:
  // - Slices are drawn starting at angle 0 (3 o'clock) going clockwise.
  // - The canvas applies ctx.rotate(totalAngle) before drawing the wheel.
  // - A slice at draw-angle L appears on screen at angle (L + totalAngle).
  // - The pointer is fixed at POINTER_ANGLE (-PI/2, i.e. 12 o'clock).
  // - For the pointer to land on the slice: L + totalAngle ≡ POINTER_ANGLE (mod 2PI)
  // - So: totalAngle = POINTER_ANGLE - L (mod 2PI)
  //
  // totalAngle = currentWheelAngle + deltaRotation
  // deltaRotation = POINTER_ANGLE - landingAngle - currentWheelAngle (mod 2PI)
  //
  // We add extra full rotations for dramatic spinning effect.

  const TWO_PI = Math.PI * 2;
  const desiredTotalAngle = POINTER_ANGLE - landingAngle;
  let baseRotation = ((desiredTotalAngle - currentWheelAngle) % TWO_PI + TWO_PI) % TWO_PI;

  // Ensure at least some rotation so it doesn't look like it barely moved
  if (baseRotation < 0.3) {
    baseRotation += TWO_PI;
  }

  const extraRads = settings.extraRotations * TWO_PI;
  const targetAngle = extraRads + baseRotation;

  const effectiveDuration = settings.spinDurationMs * animationSpeedMultiplier;

  return {
    winnerId: result.winnerId,
    winnerLabel: winnerItem.label,
    targetAngleRad: targetAngle,
    durationMs: effectiveDuration,
    seed: result.seed,
  };
}
