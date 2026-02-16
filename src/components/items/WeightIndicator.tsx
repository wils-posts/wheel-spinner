interface WeightIndicatorProps {
  weight: number;
  totalWeight: number;
}

export function WeightIndicator({ weight, totalWeight }: WeightIndicatorProps) {
  const percentage = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;

  return (
    <div className="weight-indicator" title={`${percentage.toFixed(1)}% chance`}>
      <div
        className="weight-indicator-bar"
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
      <span className="weight-indicator-text">{percentage.toFixed(1)}%</span>
    </div>
  );
}
