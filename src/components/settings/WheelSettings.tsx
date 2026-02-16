import { useProfileStore, useActiveProfile } from '../../stores/profile-store';

export function WheelSettingsPanel() {
  const profile = useActiveProfile();
  const updateSettings = useProfileStore((s) => s.updateSettings);
  const resetCooldowns = useProfileStore((s) => s.resetCooldowns);
  const resetEliminations = useProfileStore((s) => s.resetEliminations);

  if (!profile) return null;
  const { settings } = profile;

  return (
    <div className="settings-panel">
      <h2>Wheel Settings</h2>

      <div className="setting-group">
        <label className="setting-label" htmlFor="spin-duration">
          Spin duration (ms)
        </label>
        <input
          id="spin-duration"
          className="setting-input"
          type="number"
          min={1000}
          max={15000}
          step={500}
          value={settings.spinDurationMs}
          onChange={(e) => updateSettings({ spinDurationMs: Number(e.target.value) })}
        />
      </div>

      <div className="setting-group">
        <label className="setting-label" htmlFor="extra-rotations">
          Extra rotations
        </label>
        <input
          id="extra-rotations"
          className="setting-input"
          type="number"
          min={2}
          max={20}
          step={1}
          value={settings.extraRotations}
          onChange={(e) => updateSettings({ extraRotations: Number(e.target.value) })}
        />
      </div>

      <div className="setting-group">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={settings.allowRepeatWinners}
            onChange={(e) => updateSettings({ allowRepeatWinners: e.target.checked })}
          />
          Allow repeat winners
        </label>
      </div>

      <div className="setting-group">
        <label className="setting-label" htmlFor="cooldown-mode">
          Cooldown mode
        </label>
        <select
          id="cooldown-mode"
          className="setting-select"
          value={settings.cooldownMode}
          onChange={(e) =>
            updateSettings({
              cooldownMode: e.target.value as 'none' | 'by-spins' | 'by-time',
            })
          }
        >
          <option value="none">None</option>
          <option value="by-spins">By spins</option>
          <option value="by-time">By time</option>
        </select>
      </div>

      <div className="setting-group">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={settings.autoRemoveAfterSelection}
            onChange={(e) => updateSettings({ autoRemoveAfterSelection: e.target.checked })}
          />
          Auto-remove after selection
        </label>
      </div>

      <div className="setting-group">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
          />
          Sound effects
        </label>
      </div>

      <div className="setting-group">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={settings.celebrationEnabled}
            onChange={(e) => updateSettings({ celebrationEnabled: e.target.checked })}
          />
          Celebration animation
        </label>
      </div>

      <div className="setting-group">
        <label className="setting-label" htmlFor="boundary-bias">
          Boundary bias ({(settings.boundaryBias * 100).toFixed(0)}%)
        </label>
        <input
          id="boundary-bias"
          className="setting-range"
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={settings.boundaryBias}
          onChange={(e) => updateSettings({ boundaryBias: Number(e.target.value) })}
        />
      </div>

      <div className="setting-actions">
        <button className="btn-sm" onClick={resetCooldowns}>
          Reset cooldowns
        </button>
        <button className="btn-sm" onClick={resetEliminations}>
          Reset eliminations
        </button>
      </div>
    </div>
  );
}
