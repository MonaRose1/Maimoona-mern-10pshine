import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { NoteCard } from '../../components/note-card';
import { SearchBar } from '../../components/searchbar';
import { apiRequest } from '../../utils/api';

export const Home = () => {
  const { data: notes, isLoading, error } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await apiRequest('/api/notes');
      return response.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading notes</div>;

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>My Notes</h1>
        <SearchBar />
      </div>
      <div className="notes-grid">
        {notes?.map(note => (
          <NoteCard key={note._id} note={note} />
        ))}
      </div>
    </div>
  );
};