import { useState } from 'react';
import { useProfileStore } from '../../stores/profile-store';
import { ConfirmDialog } from '../common/ConfirmDialog';

export function ProfileManager() {
  const profiles = useProfileStore((s) => s.profiles);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const createProfile = useProfileStore((s) => s.createProfile);
  const renameProfile = useProfileStore((s) => s.renameProfile);
  const duplicateProfile = useProfileStore((s) => s.duplicateProfile);
  const deleteProfile = useProfileStore((s) => s.deleteProfile);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  const handleCreate = () => {
    const name = `Wheel ${profiles.length + 1}`;
    createProfile(name);
  };

  const handleStartRename = () => {
    if (!activeProfile) return;
    setRenameValue(activeProfile.name);
    setRenaming(true);
  };

  const handleFinishRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed && activeProfileId) {
      renameProfile(activeProfileId, trimmed);
    }
    setRenaming(false);
  };

  const handleDuplicate = () => {
    if (activeProfileId) {
      duplicateProfile(activeProfileId);
    }
  };

  const handleDelete = () => {
    if (activeProfileId && profiles.length > 1) {
      deleteProfile(activeProfileId);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div className="profile-manager">
      {renaming ? (
        <div className="profile-rename-row">
          <input
            className="profile-rename-input"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleFinishRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFinishRename();
              if (e.key === 'Escape') setRenaming(false);
            }}
            autoFocus
          />
        </div>
      ) : (
        <div className="profile-actions">
          <button className="btn-sm" onClick={handleCreate} title="New profile">
            + New
          </button>
          <button className="btn-sm" onClick={handleStartRename} title="Rename profile">
            Rename
          </button>
          <button className="btn-sm" onClick={handleDuplicate} title="Duplicate profile">
            Duplicate
          </button>
          <button
            className="btn-sm btn-sm-danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={profiles.length <= 1}
            title="Delete profile"
          >
            Delete
          </button>
        </div>
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Profile"
        message={`Are you sure you want to delete "${activeProfile?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        destructive
      />
    </div>
  );
}
