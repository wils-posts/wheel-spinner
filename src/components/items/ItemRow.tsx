import { useState } from 'react';
import type { WheelItem } from '../../types';

interface ItemRowProps {
  item: WheelItem;
  onUpdate: (id: string, patch: Partial<WheelItem>) => void;
  onRemove: (id: string) => void;
}

export function ItemRow({ item, onUpdate, onRemove }: ItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(item.label);

  const handleSaveLabel = () => {
    const trimmed = editLabel.trim();
    if (trimmed && trimmed !== item.label) {
      onUpdate(item.id, { label: trimmed });
    } else {
      setEditLabel(item.label);
    }
    setIsEditing(false);
  };

  return (
    <div className={`item-row ${!item.enabled ? 'item-row--disabled' : ''}`}>
      <button
        className="item-toggle"
        onClick={() => onUpdate(item.id, { enabled: !item.enabled })}
        aria-label={item.enabled ? 'Disable item' : 'Enable item'}
        title={item.enabled ? 'Disable' : 'Enable'}
      >
        <span className={`toggle-indicator ${item.enabled ? 'toggle-on' : 'toggle-off'}`} />
      </button>

      {isEditing ? (
        <input
          className="item-label-input"
          value={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          onBlur={handleSaveLabel}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveLabel();
            if (e.key === 'Escape') {
              setEditLabel(item.label);
              setIsEditing(false);
            }
          }}
          autoFocus
        />
      ) : (
        <span
          className="item-label"
          onDoubleClick={() => setIsEditing(true)}
          title="Double-click to edit"
        >
          {item.label}
        </span>
      )}

      <div className="item-weight">
        <label className="item-weight-label" htmlFor={`weight-${item.id}`}>W</label>
        <input
          id={`weight-${item.id}`}
          className="item-weight-input"
          type="number"
          min={0.1}
          step={0.1}
          value={item.weight}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val) && val > 0) {
              onUpdate(item.id, { weight: val });
            }
          }}
        />
      </div>

      <button
        className="item-remove"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.label}`}
        title="Remove"
      >
        &times;
      </button>
    </div>
  );
}
