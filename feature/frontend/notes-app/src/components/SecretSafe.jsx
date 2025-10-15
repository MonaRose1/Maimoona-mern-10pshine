import React from 'react';

const SecretSafe = ({ notes = [] }) => {
  if (!Array.isArray(notes) || notes.length === 0) {
    return <div className="p-4 text-gray-600">No secret notes yet.</div>;
  }
  return (
    <div className="p-4 grid gap-3">
      {notes.map(n => (
        <div key={n.id || n._id} className="border rounded p-3 bg-white">
          <h4 className="font-semibold mb-1">{n.title || 'Untitled'}</h4>
          <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: n.content || '' }} />
        </div>
      ))}
    </div>
  );
};

export default SecretSafe;


