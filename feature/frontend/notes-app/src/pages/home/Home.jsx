import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from '../../components/navbar';
import SearchBar from '../../components/SearchBar';
import NoteCard from '../../components/NoteCard';
import { apiRequest } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await apiRequest('/notes', { method: 'GET' });
        if (active) setNotes(Array.isArray(data) ? data : (data?.notes || []));
      } catch (e) {
        if (active) setError(e.message || 'Failed to load notes');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);
  const handleSearch = () => {
    // Implement search logic here
  };
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  return (
    <>
    <Navbar />
    <SearchBar 
    value ={searchQuery}
    onChange={e => setSearchQuery(e.target.value)}
    handleSearch={handleSearch}
    onClearSearch={handleClearSearch}
    />
    {loading && <Loading text="Loading notes..." />}
    <ErrorMessage message={error} />
    <div className='grid gap-4 p-4'>
      {notes
        .filter(n => !searchQuery || (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()))
        .map(note => (
          <div key={note.id || note._id} onClick={() => navigate(`/note/${note.id || note._id}`)} className='cursor-pointer'>
            <NoteCard
              title={note.title}
              content={note.snippet || note.content}
              date={note.lastModified || note.updatedAt || ''}
              tags={note.tags || []}
              isPinned={note.isPinned}
              onEdit={() => navigate(`/note/${note.id || note._id}`)}
              onDelete={() => {}}
              onPinNote={() => {}}
            />
          </div>
        ))}
    </div>
        </>
  );
};

export default Home;