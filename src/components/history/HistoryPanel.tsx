import { useProfileStore, useActiveProfile } from '../../stores/profile-store';

export function HistoryPanel() {
  const profile = useActiveProfile();
  const clearHistory = useProfileStore((s) => s.clearHistory);

  if (!profile) return null;

  return (
    <div className="history-panel">
      <div className="history-header">
        <h2>History ({profile.history.length})</h2>
        {profile.history.length > 0 && (
          <button className="btn-text" onClick={clearHistory}>
            Clear
          </button>
        )}
      </div>
      <div className="history-list">
        {profile.history.length === 0 ? (
          <div className="history-empty">No spins yet.</div>
        ) : (
          profile.history.map((record) => (
            <div key={record.id} className="history-entry">
              <span className="history-winner">{record.winnerLabel}</span>
              <span className="history-time">
                {new Date(record.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
