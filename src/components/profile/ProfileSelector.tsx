import { useProfileStore } from '../../stores/profile-store';

export function ProfileSelector() {
  const profiles = useProfileStore((s) => s.profiles);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile);

  return (
    <div className="profile-selector">
      <label htmlFor="profile-select" className="profile-selector-label">
        Profile
      </label>
      <select
        id="profile-select"
        className="profile-select"
        value={activeProfileId ?? ''}
        onChange={(e) => setActiveProfile(e.target.value)}
      >
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.items.length} items)
          </option>
        ))}
      </select>
    </div>
  );
}
