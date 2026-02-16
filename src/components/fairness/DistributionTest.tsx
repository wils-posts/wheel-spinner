import { useState } from 'react';
import { useActiveProfile } from '../../stores/profile-store';
import { simulateSpins, type SimulationResult } from '../../engine/fairness-simulator';

export function DistributionTest() {
  const profile = useActiveProfile();
  const [results, setResults] = useState<SimulationResult[] | null>(null);
  const [count, setCount] = useState(1000);

  if (!profile) return null;

  const handleSimulate = () => {
    const r = simulateSpins(profile.items, count);
    setResults(r);
  };

  return (
    <div className="distribution-test">
      <h3>Distribution Test</h3>
      <div className="sim-controls">
        <label className="sim-label" htmlFor="sim-count">
          Simulations:
        </label>
        <input
          id="sim-count"
          className="setting-input"
          type="number"
          min={100}
          max={10000}
          step={100}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          style={{ width: 80 }}
        />
        <button className="btn-sm" onClick={handleSimulate}>
          Run
        </button>
      </div>
      {results && (
        <div className="sim-results">
          {results.map((r) => (
            <div key={r.itemId} className="sim-row">
              <span className="sim-item-label">{r.label}</span>
              <div className="sim-bars">
                <div className="sim-bar-expected" style={{ width: `${r.expected}%` }} />
                <div className="sim-bar-actual" style={{ width: `${r.actual}%` }} />
              </div>
              <span className="sim-values">
                {r.expected.toFixed(1)}% / {r.actual.toFixed(1)}%
              </span>
            </div>
          ))}
          <div className="sim-legend">
            <span className="sim-legend-expected">Expected</span>
            <span className="sim-legend-actual">Actual</span>
          </div>
        </div>
      )}
    </div>
  );
}
