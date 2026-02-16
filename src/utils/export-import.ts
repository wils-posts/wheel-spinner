import type { Profile } from '../types';
import type { GlobalSettings } from '../types';

interface ExportData {
  formatVersion: number;
  exportedAt: string;
  app: string;
  type: 'single-profile' | 'all-profiles';
  data: {
    profiles: Profile[];
    globalSettings?: GlobalSettings;
  };
}

export function exportProfile(profile: Profile): string {
  const data: ExportData = {
    formatVersion: 1,
    exportedAt: new Date().toISOString(),
    app: 'wheel-spinner',
    type: 'single-profile',
    data: { profiles: [profile] },
  };
  return JSON.stringify(data, null, 2);
}

export function exportAllProfiles(profiles: Profile[], globalSettings?: GlobalSettings): string {
  const data: ExportData = {
    formatVersion: 1,
    exportedAt: new Date().toISOString(),
    app: 'wheel-spinner',
    type: 'all-profiles',
    data: { profiles, globalSettings },
  };
  return JSON.stringify(data, null, 2);
}

export function exportHistoryCSV(profile: Profile): string {
  const header = 'Timestamp,Winner';
  const rows = profile.history.map(
    (r) => `${r.timestamp},"${r.winnerLabel.replace(/"/g, '""')}"`,
  );
  return [header, ...rows].join('\n');
}

export interface ImportResult {
  profiles: Profile[];
  globalSettings?: GlobalSettings;
  errors: string[];
}

export function parseImport(json: string): ImportResult {
  const errors: string[] = [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { profiles: [], errors: ['Invalid JSON file'] };
  }

  const data = parsed as Record<string, unknown>;

  if (data.app !== 'wheel-spinner') {
    errors.push('Not a Wheel Spinner export file');
    return { profiles: [], errors };
  }

  if (typeof data.formatVersion !== 'number' || data.formatVersion > 1) {
    errors.push(`Unsupported format version: ${data.formatVersion}`);
  }

  const innerData = data.data as Record<string, unknown> | undefined;
  if (!innerData || !Array.isArray(innerData.profiles)) {
    errors.push('Missing or invalid profiles data');
    return { profiles: [], errors };
  }

  const profiles: Profile[] = [];
  for (const p of innerData.profiles as unknown[]) {
    const profile = p as Record<string, unknown>;
    if (!profile.id || !profile.name || !Array.isArray(profile.items)) {
      errors.push(`Skipped invalid profile: ${profile.name ?? 'unnamed'}`);
      continue;
    }
    profiles.push(profile as unknown as Profile);
  }

  const globalSettings = innerData.globalSettings as GlobalSettings | undefined;

  return { profiles, globalSettings, errors };
}

export function downloadFile(content: string, filename: string, mimeType = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
