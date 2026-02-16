interface SpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  spinning: boolean;
}

export function SpinButton({ onClick, disabled, spinning }: SpinButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || spinning}
      className="spin-button"
      aria-label={spinning ? 'Wheel is spinning' : 'Spin the wheel'}
    >
      {spinning ? 'Spinning...' : 'SPIN'}
    </button>
  );
}
