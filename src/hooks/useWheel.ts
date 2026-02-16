import { useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useSpinStore } from '../stores/spin-store';
import { useProfileStore, useActiveProfile } from '../stores/profile-store';
import { resolveSpinTarget } from '../engine/spin-resolver';
import { startWheelAnimation } from '../canvas/wheel-animator';
import { applyCooldowns } from '../engine/cooldown-manager';
import { easeOutQuint } from '../utils/easing';
import { getEligibleItems } from '../engine/weighted-selection';
import { soundManager } from '../audio/sound-manager';

export function useWheel() {
  const cancelRef = useRef<(() => void) | null>(null);
  const profile = useActiveProfile();

  const phase = useSpinStore((s) => s.phase);
  const winnerLabel = useSpinStore((s) => s.winnerLabel);
  const currentAngleRad = useSpinStore((s) => s.currentAngleRad);

  const startSpin = useSpinStore((s) => s.startSpin);
  const setAnimationAngle = useSpinStore((s) => s.setAnimationAngle);
  const completeSpin = useSpinStore((s) => s.completeSpin);
  const resetSpin = useSpinStore((s) => s.reset);
  const addHistoryRecord = useProfileStore((s) => s.addHistoryRecord);

  const spin = useCallback(() => {
    if (!profile) return;
    if (phase !== 'idle' && phase !== 'result') return;

    // Reset if showing result
    if (phase === 'result') {
      resetSpin();
    }

    // Initialize sound on first spin (user gesture required)
    soundManager.initialize();

    const currentAngle = useSpinStore.getState().currentAngleRad;
    const lastWinnerId = profile.history[0]?.winnerItemId ?? null;
    const resolution = resolveSpinTarget(
      profile.items,
      profile.settings,
      1.0,
      lastWinnerId,
      currentAngle,
    );

    if (!resolution) return;

    startSpin(
      resolution.winnerId,
      resolution.winnerLabel,
      currentAngle + resolution.targetAngleRad,
      resolution.seed,
    );

    // Compute slice boundaries for tick detection
    const eligible = getEligibleItems(profile.items);
    const totalWeight = eligible.reduce((s, i) => s + i.weight, 0);
    const boundaries: number[] = [];
    let cumAngle = 0;
    for (const item of eligible) {
      cumAngle += (item.weight / totalWeight) * Math.PI * 2;
      boundaries.push(cumAngle);
    }

    cancelRef.current?.();
    cancelRef.current = startWheelAnimation({
      startAngle: currentAngle,
      targetAngle: currentAngle + resolution.targetAngleRad,
      durationMs: resolution.durationMs,
      easingFn: easeOutQuint,
      onFrame: setAnimationAngle,
      sliceBoundaries: boundaries,
      onTick: () => {
        if (profile.settings.soundEnabled) {
          soundManager.playTick();
        }
      },
      onComplete: () => {
        completeSpin();

        // Play celebration sound
        if (profile.settings.soundEnabled) {
          soundManager.playCelebration();
        }

        // Add history record
        addHistoryRecord({
          id: nanoid(),
          timestamp: new Date().toISOString(),
          winnerLabel: resolution.winnerLabel,
          winnerItemId: resolution.winnerId,
          seed: resolution.seed,
        });

        // Apply cooldowns to items
        const currentState = useProfileStore.getState();
        const activeProfile = currentState.profiles.find(
          (p) => p.id === currentState.activeProfileId,
        );
        if (activeProfile) {
          const updatedItems = applyCooldowns(
            activeProfile.items,
            resolution.winnerId,
            activeProfile.settings,
          );
          useProfileStore.setState({
            profiles: currentState.profiles.map((p) =>
              p.id === currentState.activeProfileId
                ? { ...p, items: updatedItems, updatedAt: new Date().toISOString() }
                : p,
            ),
          });
        }
      },
    });
  }, [profile, phase, startSpin, setAnimationAngle, completeSpin, resetSpin, addHistoryRecord]);

  const canSpin = profile !== undefined && getEligibleItems(profile.items).length > 0;

  return {
    spin,
    phase,
    winnerLabel,
    currentAngleRad,
    canSpin,
  };
}
