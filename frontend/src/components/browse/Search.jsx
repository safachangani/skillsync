import React, { useState } from 'react';
import './search.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      // If empty, just go to browse-profiles without query
      navigate('/browse-profiles');
    } else {
      navigate(`/browse-profiles?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
     return (
    <section className="quick-search-section">
      <h2 className="section-title">Find a Partner</h2>
      <div className="quick-search-bar">
        <input
          type="text"
          className="quick-search-input"
          placeholder="Type a skill, topic, or name…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="quick-search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <p className="browse-link">
        Or <Link to="/browse-profiles">Browse All Profiles</Link>
      </p>
    </section>
  );
}

export default Search;
