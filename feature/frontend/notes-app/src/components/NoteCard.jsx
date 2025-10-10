import React from 'react';

const NoteCard = ({ 
  title, 
  content, 
  date, 
  tags = [], 
  isPinned = false, 
  onEdit, 
  onDelete, 
  onPinNote 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {title || 'Untitled Note'}
        </h3>
        <div className="flex items-center space-x-2">
          {isPinned && (
            <span className="text-yellow-500 text-sm">📌</span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPinNote?.();
            }}
            className="text-gray-400 hover:text-yellow-500 text-sm"
          >
            {isPinned ? '📌' : '📍'}
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
        {content || 'No content'}
      </p>
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(date)}</span>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;