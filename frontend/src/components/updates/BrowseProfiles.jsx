import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import './browse-profile.css';
import Navbar from '../navbar/Navbar';

function BrowseProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const searchProfiles = () => {
    const results = profiles.filter((profile) => {
      const matchesUsername = profile.username.toLowerCase().includes(query.toLowerCase());
      const matchesSkills = profile.skills.some((skill) => skill.toLowerCase().includes(query.toLowerCase()));
      return matchesUsername || matchesSkills;
    });
    setSearchResults(results);
    setSearched(true);
  };

  useEffect(() => {
    // Fetch profiles from the backend when the component mounts
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('user-token');
        const response = await axios.get('get-all-profiles', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfiles(response.data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  const renderProfile = (profile) => (
    <div className="profile-card" key={profile._id}>
      <img src={`http://localhost:9000/skillsync/uploads/${profile.filename}`} alt={profile.username} />
      <div className="profile-details">
        <h2>{profile.username}</h2>
        <p>{profile.about}</p>
        <p>Skills: {profile.skills.join(', ')}</p>
        <p>Education Level: {profile.educationLevel}</p>
        <p>LinkedIn: {profile.linkedinURL}</p>
        <p>Github: {profile.githubURL}</p>
        <p>Website: {profile.websiteURL}</p>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or skill"
        />
        <button className="search-button" onClick={searchProfiles}>Search</button>
      </div>
      <div className='profile--'>
        {searched && searchResults.length === 0 && <p>No results found.</p>}
        {searched ? (
          searchResults.map(renderProfile)
        ) : (
          profiles.map(renderProfile)
        )}
      </div>
    </div>
  );
}

export default BrowseProfiles;

