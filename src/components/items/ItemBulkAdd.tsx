import { useState } from 'react';

interface ItemBulkAddProps {
  onAdd: (labels: string[]) => void;
}

export function ItemBulkAdd({ onAdd }: ItemBulkAddProps) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    const labels = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (labels.length > 0) {
      onAdd(labels);
      setText('');
    }
  };

  const lineCount = text.split('\n').filter((l) => l.trim().length > 0).length;

  return (
    <div className="bulk-add">
      <textarea
        className="bulk-add-textarea"
        placeholder="Enter items, one per line..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
      />
      <div className="bulk-add-footer">
        <span className="bulk-add-count">{lineCount} item{lineCount !== 1 ? 's' : ''}</span>
        <button
          className="btn-add"
          onClick={handleAdd}
          disabled={lineCount === 0}
        >
          Add all
        </button>
      </div>
    </div>
  );
}
