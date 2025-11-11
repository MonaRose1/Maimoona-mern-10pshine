import React from 'react';
import { Link } from 'react-router-dom';

const NoteCard = ({ note, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="note-card">
      <div className="note-header">
        <h3 className="note-title">{note.title || 'Untitled'}</h3>
        <div className="note-actions">
          <Link to={`/note/${note.id}`} className="edit-btn">Edit</Link>
          <button onClick={() => onDelete(note.id)} className="delete-btn">Delete</button>
        </div>
      </div>
      <div className="note-content">
        <p>{note.content?.substring(0, 100)}...</p>
      </div>
      <div className="note-footer">
        <span className="note-date">{formatDate(note.updatedAt || note.createdAt)}</span>
      </div>
    </div>
  );
};

export default NoteCard;
