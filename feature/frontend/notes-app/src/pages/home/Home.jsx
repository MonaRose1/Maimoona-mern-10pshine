import React from 'react';
import { useState } from 'react';
import Navbar from '../../components/navbar';
import SearchBar from '../../components/searchbar';
import NoteCard from '../../components/NoteCard';
const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
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
    <NoteCard />
        </>
  );
};

export default Home;