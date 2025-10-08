import React from 'react';

const NoteCard = ({
  title = '',
  content = '',
  date = '',
  tags = [],
  isPinned = false,
  onEdit = () => {},
  onDelete = () => {},
  onPinNote = () => {}
}) => {
  const formattedDate = date ? new Date(date).toLocaleString() : '';
  const snippet = typeof content === 'string' ? content.slice(0, 140) : '';

  return (
    <div className="border rounded p-4 bg-white hover:shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <h6 className="text-lg font-semibold mb-1">{title || 'Untitled'}</h6>
          {formattedDate && <span className="text-xs text-gray-500">{formattedDate}</span>}
        </div>
        <button onClick={onPinNote} className="text-sm text-blue-600">
          {isPinned ? 'Unpin' : 'Pin'}
        </button>
      </div>

      {snippet && <p className="mt-2 text-sm text-gray-700">{snippet}{content.length > 140 ? '…' : ''}</p>}

      {Array.isArray(tags) && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">{tag}</span>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-3">
        <button onClick={onEdit} className="text-sm text-blue-600">Edit</button>
        <button onClick={onDelete} className="text-sm text-red-600">Delete</button>
      </div>
    </div>
  );
};

export default NoteCard;