import React from 'react';

const NoteCard = ({
  title,
  content,
  date,
  tags = [], // Default to empty array
  isPinned,
  onEdit,
  onDelete,
  onPinNote
}) => {
  return (
    <div>
        <div className=''>
            <div>
                <h6 className="text-lg font-semibold">{title}</h6>
                <span>{date}</span>
      <p>{content}</p>
      
      <div>
        {Array.isArray(tags) && tags.map(tag => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
      <button onClick={onPinNote}>{isPinned ? 'Unpin' : 'Pin'}</button>
            </div>
        </div>

      
    </div>
  );
};

export default NoteCard;