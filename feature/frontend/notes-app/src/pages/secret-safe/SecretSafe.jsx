import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NoteCard } from '../../components/note-card';
import { SecretSearchBar } from '../../components/SecretSearchBar';
import { apiRequest } from '../../utils/api';

export const SecretSafe = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: secretNotes, isLoading, error } = useQuery({
    queryKey: ['secretNotes'],
    queryFn: async () => {
      const response = await apiRequest('/api/secret/notes');
      return response.data;
    }
  });

  if (isLoading) return <div>Loading secret notes...</div>;
  if (error) return <div>Error loading secret notes</div>;

  const filteredNotes = secretNotes?.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="secret-safe-page">
      <div className="secret-safe-header">
        <h1>Secret Safe</h1>
        <SecretSearchBar onSearch={setSearchTerm} />
      </div>
      <div className="secret-notes-grid">
        {filteredNotes?.map(note => (
          <NoteCard key={note._id} note={note} isSecret={true} />
        ))}
      </div>
    </div>
  );
};