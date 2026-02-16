import { useState } from 'react';
import { WheelCanvas } from './components/wheel/WheelCanvas';
import { SpinButton } from './components/wheel/SpinButton';
import { WinnerDisplay } from './components/wheel/WinnerDisplay';
import { CelebrationOverlay } from './components/wheel/CelebrationOverlay';
import { ItemEditor } from './components/items/ItemEditor';
import { ProfileSelector } from './components/profile/ProfileSelector';
import { ProfileManager } from './components/profile/ProfileManager';
import { ProfileExport } from './components/profile/ProfileExport';
import { HistoryPanel } from './components/history/HistoryPanel';
import { WheelSettingsPanel } from './components/settings/WheelSettings';
import { ThemeToggle } from './components/settings/ThemeToggle';
import { WeightTransparency } from './components/fairness/WeightTransparency';
import { DistributionTest } from './components/fairness/DistributionTest';
import { useWheel } from './hooks/useWheel';
import { useActiveProfile } from './stores/profile-store';
import './App.css';

function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button className="section-toggle" onClick={() => setOpen(!open)}>
        {title}
        <span className={`section-toggle-arrow ${open ? 'section-toggle-arrow--open' : ''}`}>
          ▾
        </span>
      </button>
      {open && children}
    </div>
  );
}

function App() {
  const { spin, phase, winnerLabel, canSpin } = useWheel();
  const profile = useActiveProfile();
  const showCelebration = phase === 'result' && (profile?.settings.celebrationEnabled ?? true);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Wheel Spinner</h1>
        <ThemeToggle />
      </header>
      <main className="app-main">
        <div className="app-main-right">
          <div className="wheel-container" style={{ position: 'relative' }}>
            <WheelCanvas />
            <CelebrationOverlay
              active={showCelebration}
              width={600}
              height={600}
            />
          </div>
          <div className="controls">
            <SpinButton
              onClick={spin}
              disabled={!canSpin}
              spinning={phase === 'animating'}
            />
            <WinnerDisplay
              winnerLabel={winnerLabel}
              visible={phase === 'result'}
            />
          </div>
        </div>
        <div className="app-main-left">
          <ProfileSelector />
          <ProfileManager />
          <ItemEditor />
          <CollapsibleSection title="Settings">
            <WheelSettingsPanel />
          </CollapsibleSection>
          <CollapsibleSection title="History">
            <HistoryPanel />
          </CollapsibleSection>
          <CollapsibleSection title="Probabilities">
            <WeightTransparency />
          </CollapsibleSection>
          <CollapsibleSection title="Fairness Test">
            <DistributionTest />
          </CollapsibleSection>
          <CollapsibleSection title="Import / Export">
            <ProfileExport />
          </CollapsibleSection>
        </div>
      </main>
    </div>
  );
}

export default App;
