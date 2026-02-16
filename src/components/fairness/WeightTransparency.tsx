import { useActiveProfile } from '../../stores/profile-store';
import { getEligibleItems } from '../../engine/weighted-selection';

export function WeightTransparency() {
  const profile = useActiveProfile();
  if (!profile) return null;

  const eligible = getEligibleItems(profile.items);
  if (eligible.length === 0) return null;

  const totalWeight = eligible.reduce((s, i) => s + i.weight, 0);

  return (
    <div className="weight-transparency">
      <h3>Probabilities</h3>
      <div className="probability-list">
        {eligible.map((item) => {
          const pct = (item.weight / totalWeight) * 100;
          return (
            <div key={item.id} className="probability-row">
              <span className="probability-label">{item.label}</span>
              <div className="probability-bar-track">
                <div
                  className="probability-bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="probability-pct">{pct.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
