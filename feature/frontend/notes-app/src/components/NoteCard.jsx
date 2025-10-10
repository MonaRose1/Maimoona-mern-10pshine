import React from 'react';

const NoteCard = ({ title, content, date, tags = [], isPinned, onEdit, onDelete, onPinNote }) => {
  return (
    <div className="note-card">
      <div className="note-card__header">
        <h3 className="note-card__title">{title || 'Untitled'}</h3>
        <div className="note-card__actions">
          <button className={`pin-btn ${isPinned ? 'is-pinned' : ''}`} onClick={onPinNote} aria-label="Pin note">📌</button>
          <button className="icon-btn" onClick={onEdit} aria-label="Edit note">✏️</button>
          <button className="icon-btn" onClick={onDelete} aria-label="Delete note">🗑️</button>
        </div>
      </div>
      <div className="note-card__content" dangerouslySetInnerHTML={{ __html: content || '' }} />
      <div className="note-card__footer">
        {date && <span className="note-card__date">{new Date(date).toLocaleString()}</span>}
        <div className="note-card__tags">
          {Array.isArray(tags) && tags.map((t) => (
            <span key={String(t)} className="note-tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
