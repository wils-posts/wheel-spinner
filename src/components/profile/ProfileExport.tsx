import { useRef } from 'react';
import { useProfileStore, useActiveProfile } from '../../stores/profile-store';
import {
  exportProfile,
  exportAllProfiles,
  parseImport,
  downloadFile,
  readFileAsText,
} from '../../utils/export-import';
import { nanoid } from 'nanoid';

export function ProfileExport() {
  const profile = useActiveProfile();
  const profiles = useProfileStore((s) => s.profiles);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCurrent = () => {
    if (!profile) return;
    const json = exportProfile(profile);
    downloadFile(json, `${profile.name}.json`);
  };

  const handleExportAll = () => {
    const json = exportAllProfiles(profiles);
    downloadFile(json, 'wheel-spinner-backup.json');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await readFileAsText(file);
      const result = parseImport(text);

      if (result.errors.length > 0) {
        alert(`Import warnings:\n${result.errors.join('\n')}`);
      }

      if (result.profiles.length === 0) {
        alert('No valid profiles found in the file.');
        return;
      }

      // Add profiles with new IDs to avoid collisions
      const state = useProfileStore.getState();
      const newProfiles = result.profiles.map((p) => ({
        ...p,
        id: nanoid(),
        items: p.items.map((item) => ({ ...item, id: nanoid() })),
      }));

      useProfileStore.setState({
        profiles: [...state.profiles, ...newProfiles],
        activeProfileId: newProfiles[0].id,
      });

      alert(`Imported ${newProfiles.length} profile(s).`);
    } catch {
      alert('Failed to import file. Please check the file format.');
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="profile-export">
      <div className="export-actions">
        <button className="btn-sm" onClick={handleExportCurrent}>
          Export current
        </button>
        <button className="btn-sm" onClick={handleExportAll}>
          Export all
        </button>
        <button className="btn-sm" onClick={() => fileInputRef.current?.click()}>
          Import
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
    </div>
  );
}
