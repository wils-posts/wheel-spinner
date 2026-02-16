import type { WheelItem } from './item';
import type { SpinRecord } from './history';

export interface WheelSettings {
  spinDurationMs: number;
  extraRotations: number;
  allowRepeatWinners: boolean;
  cooldownMode: 'none' | 'by-spins' | 'by-time';
  autoRemoveAfterSelection: boolean;
  soundEnabled: boolean;
  celebrationEnabled: boolean;
  boundaryBias: number;
}

export const DEFAULT_WHEEL_SETTINGS: WheelSettings = {
  spinDurationMs: 4000,
  extraRotations: 5,
  allowRepeatWinners: true,
  cooldownMode: 'none',
  autoRemoveAfterSelection: false,
  soundEnabled: true,
  celebrationEnabled: true,
  boundaryBias: 0.7,
};

export interface Profile {
  id: string;
  name: string;
  items: WheelItem[];
  settings: WheelSettings;
  history: SpinRecord[];
  historyLimit: number;
  createdAt: string;
  updatedAt: string;
}
