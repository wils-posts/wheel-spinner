import { create } from 'zustand';

export type SpinPhase = 'idle' | 'animating' | 'result';

interface SpinStoreState {
  phase: SpinPhase;
  winnerId: string | null;
  winnerLabel: string | null;
  currentAngleRad: number;
  targetAngleRad: number;
  seed: string | null;

  startSpin: (winnerId: string, winnerLabel: string, targetAngle: number, seed: string) => void;
  setAnimationAngle: (angle: number) => void;
  completeSpin: () => void;
  reset: () => void;
}

export const useSpinStore = create<SpinStoreState>()((set) => ({
  phase: 'idle',
  winnerId: null,
  winnerLabel: null,
  currentAngleRad: 0,
  targetAngleRad: 0,
  seed: null,

  startSpin: (winnerId, winnerLabel, targetAngle, seed) => {
    set({
      phase: 'animating',
      winnerId,
      winnerLabel,
      targetAngleRad: targetAngle,
      seed,
    });
  },

  setAnimationAngle: (angle) => {
    set({ currentAngleRad: angle });
  },

  completeSpin: () => {
    set({ phase: 'result' });
  },

  reset: () => {
    set((state) => ({
      phase: 'idle',
      winnerId: null,
      winnerLabel: null,
      // Keep the current angle so the wheel stays where it landed
      currentAngleRad: state.currentAngleRad % (Math.PI * 2),
      targetAngleRad: 0,
      seed: null,
    }));
  },
}));
