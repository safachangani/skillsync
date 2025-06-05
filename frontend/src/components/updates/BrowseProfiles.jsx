// src/components/browse/BrowseProfiles.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import Navbar from '../navbar/Navbar';
import './browse-profile.css';
import { Link } from 'react-router-dom';

function BrowseProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);

  // Pagination state (2 rows × 3 columns)
  const perPage = 6;
  const [page, setPage] = useState(0);

  // Fetch all profiles on mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('user-token');
        const resp = await axios.get('/get-all-profiles', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfiles(resp.data);
      } catch (err) {
        console.error('Error fetching profiles:', err);
      }
    };
    fetchProfiles();
  }, []);

  // Search handler (by username or any skill name)
  const searchProfiles = (q = query) => {
    const lc = q.toLowerCase();
    const results = profiles.filter(p =>
      p.username.toLowerCase().includes(lc) ||
      p.skills.some(skill => skill.name.toLowerCase().includes(lc))
    );
    setSearchResults(results);
    setSearched(true);
    setPage(0);
  };

  // Tag‐click handler
  const onTagClick = (tag) => {
    setQuery(tag);
    searchProfiles(tag);
  };

  // Decide which list to render, then paginate
  const list = searched ? searchResults : profiles;
  const paged = list.slice(page * perPage, (page + 1) * perPage);

  // Popular tags for quick filtering
  const popularTags = [
    'Web Development', 'UI/UX Design', 'Python',
    'Marketing', 'Data Analysis', 'Content Writing',
    'Machine Learning', 'Photography'
  ];

  return (
    <>
      <Navbar />

      {/* ─── Search Bar ───────────────────────────────────────────────────── */}
      <div className="search-container">
        <input
          className="search-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or skill"
        />
        <button className="search-button" onClick={() => searchProfiles()}>
          Search
        </button>
      </div>

      {/* ─── Popular Tag Filters ─────────────────────────────────────────────── */}
      <div className="tag-filters">
        {popularTags.map(tag => (
          <button
            key={tag}
            className="tag"
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ─── No results message ─────────────────────────────────────────────── */}
      {searched && searchResults.length === 0 && (
        <p className="no-results">No results found for “{query}”.</p>
      )}

      {/* ─── Profile Grid ───────────────────────────────────────────────────── */}
      <div className="profile-card-grid">
        {paged.map(p => (
          <div className="partner-card" key={p._id}>
            {/* Decorative header stripe */}
            <div className="partner-card-header" />

            {/* Avatar */}
            <img
              src={`http://localhost:9000/skillsync/uploads/${p.filename}`}
              alt={p.username}
              className="partner-avatar"
            />

            {/* Username & Role/Bio */}
            <h3 className="partner-name">{p.username}</h3>
            <p className="partner-role">{p.about}</p>

            {/* First three skills as “pills” */}
            <div className="partner-skills">
              {p.skills.slice(0, 3).map((skillObj, i) => (
                <span key={i} className="skill-pill">
                  {skillObj.name}
                </span>
              ))}
              {p.skills.length > 3 && (
                <span className="skill-pill extra">
                  +{p.skills.length - 3}
                </span>
              )}
            </div>

            {/* “View Full Profile” button */}
            <Link to="/profile-visit" state={{ profileId: p._id }}>
              <button className="view-button">View Full Profile</button>
            </Link>
          </div>
        ))}
      </div>

      {/* ─── Pagination Controls ─────────────────────────────────────────────── */}
      {list.length > perPage && (
        <div className="pagination-controls">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * perPage >= list.length}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default BrowseProfiles;
