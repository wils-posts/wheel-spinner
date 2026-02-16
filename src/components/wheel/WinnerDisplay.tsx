interface WinnerDisplayProps {
  winnerLabel: string | null;
  visible: boolean;
}

export function WinnerDisplay({ winnerLabel, visible }: WinnerDisplayProps) {
  if (!visible || !winnerLabel) return null;

  return (
    <div className="winner-display" aria-live="assertive" role="alert">
      <span className="winner-label-prefix">Winner:</span>
      <span className="winner-label-text">{winnerLabel}</span>
    </div>
  );
}
