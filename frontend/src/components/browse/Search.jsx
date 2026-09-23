import React, { useState } from 'react';
import './search.css';
import { useNavigate, Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const CATEGORIES = ['All', 'Design', 'Development', 'Marketing', 'Content', 'Data', 'Other'];

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim() !== '') params.set('query', searchTerm.trim());
    if (activeCategory !== 'All') params.set('category', activeCategory);
    navigate(`/browse-profiles${params.toString() ? `?${params}` : ''}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className="quick-search-section">
      <h2 className="section-title">Find the Right Skill Connection</h2>
      <p className="section-subtitle">
        Search for skills, topics, or people to collaborate with
      </p>

      <div className="quick-search-bar">
        <div className="search-input-wrapper">
          <MagnifyingGlassIcon className="search-icon" />
          <input
            type="text"
            className="quick-search-input"
            placeholder="Search skills, topics, or people"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <button className="quick-search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="category-pills">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="browse-link">
        Or <Link to="/browse-profiles">Explore People</Link>
      </p>
    </section>
  );
}

export default Search;