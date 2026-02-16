import type { WheelSettings } from './profile';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ExportFormat = 'json' | 'csv';

export interface GlobalSettings {
  theme: ThemeMode;
  animationSpeedMultiplier: number;
  defaultProfileTemplate: {
    settings: Partial<WheelSettings>;
    historyLimit: number;
  };
  exportFormat: ExportFormat;
  backupReminderEnabled: boolean;
  backupReminderIntervalDays: number;
  lastBackupReminder: string | null;
  reducedMotion: boolean | null;
}

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  theme: 'system',
  animationSpeedMultiplier: 1.0,
  defaultProfileTemplate: {
    settings: {},
    historyLimit: 100,
  },
  exportFormat: 'json',
  backupReminderEnabled: true,
  backupReminderIntervalDays: 7,
  lastBackupReminder: null,
  reducedMotion: null,
};
