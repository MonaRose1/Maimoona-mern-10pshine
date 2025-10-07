import React from 'react';

const NoteCard = ({ title, content, date, tags = [] }) => {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{title || 'Untitled'}</h3>
        <small style={{ color: '#6b7280' }}>{date || ''}</small>
      </div>
      <p style={{ color: '#374151', marginTop: 8 }}>{content || ''}</p>
      {!!tags.length && (
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {tags.map((t, i) => (
            <span key={i} style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 6, fontSize: 12 }}>{String(t)}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteCard;


