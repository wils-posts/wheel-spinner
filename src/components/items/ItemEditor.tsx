import { useState } from 'react';
import { useProfileStore, useActiveProfile } from '../../stores/profile-store';
import { ItemRow } from './ItemRow';
import { ItemBulkAdd } from './ItemBulkAdd';

export function ItemEditor() {
  const profile = useActiveProfile();
  const addItem = useProfileStore((s) => s.addItem);
  const updateItem = useProfileStore((s) => s.updateItem);
  const removeItem = useProfileStore((s) => s.removeItem);
  const bulkAddItems = useProfileStore((s) => s.bulkAddItems);

  const [newLabel, setNewLabel] = useState('');
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  if (!profile) return null;

  const handleAddItem = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    addItem(trimmed);
    setNewLabel('');
  };

  return (
    <div className="item-editor">
      <div className="item-editor-header">
        <h2>Items ({profile.items.length})</h2>
        <button
          className="btn-text"
          onClick={() => setShowBulkAdd(!showBulkAdd)}
        >
          {showBulkAdd ? 'Single add' : 'Bulk add'}
        </button>
      </div>

      {showBulkAdd ? (
        <ItemBulkAdd
          onAdd={(labels) => {
            bulkAddItems(labels);
            setShowBulkAdd(false);
          }}
        />
      ) : (
        <div className="item-add-row">
          <input
            className="item-add-input"
            type="text"
            placeholder="Add item..."
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddItem();
            }}
          />
          <button
            className="btn-add"
            onClick={handleAddItem}
            disabled={!newLabel.trim()}
          >
            Add
          </button>
        </div>
      )}

      <div className="item-list">
        {profile.items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            onUpdate={updateItem}
            onRemove={removeItem}
          />
        ))}
        {profile.items.length === 0 && (
          <div className="item-list-empty">No items yet. Add some above.</div>
        )}
      </div>
    </div>
  );
}
