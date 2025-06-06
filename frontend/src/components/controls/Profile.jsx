import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import Navbar from '../navbar/Navbar';
import './profile.css';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, CodeBracketIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const defaultImage =
    'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('user-token');
        const response = await axios.get('/get-profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div className="profile-loading">Loading...</div>;

  return (
    <>

      {/* ─── PROFILE WRAPPER ───────────────────────────────────────────────────────── */}
      <div className="profile-wrapper">

        {/* ─── 1) HEADER AREA ─────────────────────────────────────────────────────── */}
        <header className="profile-header">
         
            <div className="avatar-container">
              <img
                className="profile-avatar"
                src={
                  profile.filename
                    ? `https://skillsync-backend-xiwx.onrender.com/skillsync/uploads/${profile.filename}`
                    : defaultImage
                }
                alt="Profile"
              />
            </div>

            {/* Name / Username / Location */}
            <div className="profile-basic-text">
              <h1 className="profile-name">{profile.fullName}</h1>
             {profile.username && <p className="profile-username">@{profile.username}</p>}
              {profile.location && (
                <p className="profile-location">📍 {profile.location}</p>
              )}
            </div>

            {/* Edit Button */}
            <Link to="/edit-profile" className="edit-profile-button">
              Edit Profile
            </Link>
          {/* </div> */}
        </header>

        {/* ─── 2) STATS CARDS AREA ───────────────────────────────────────────────── */}
        {/* <section className="profile-stats-cards">
          <div className="stat-card">
            <div className="stat-number">{profile.projectsCount || 0}</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{profile.connectionsCount || 0}</div>
            <div className="stat-label">Connections</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{profile.endorsementsCount || 0}</div>
            <div className="stat-label">Endorsements</div>
          </div>
        </section> */}

        {/* ─── 3) MAIN BODY CARDS ─────────────────────────────────────────────────── */}
        <div className="profile-main-content">
          {/* ─── 3a) SKILLS CARD ─────────────────────────────────────────────────── */}
          <div className="profile-card skills-card">
            <div className="card-header">
              <div className="header-accent skills-accent" />
              <h2 className="card-title">Skills</h2>
            </div>
            <div className="skills-list">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, idx) => (
                  <span className="skill-tag" key={idx}>
                    {skill.name}
                    <span className="skill-level">{skill.level}</span>
                  </span>
                ))
              ) : (
                <p className="no-skills">No skills added yet.</p>
              )}
            </div>
          </div>

          {/* ─── 3b) ABOUT CARD ─────────────────────────────────────────────────── */}
          <div className="profile-card about-card">
            <div className="card-header">
              <div className="header-accent about-accent" />
              <h2 className="card-title">About</h2>
            </div>
            <div className="about-text">
              {profile.bio ? profile.bio : <em>No bio provided.</em>}
            </div>
          </div>

          {/* ─── 3c) SOCIAL LINKS CARD ─────────────────────────────────────────── */}
          <div className="profile-card social-card">
            <div className="card-header">
              <div className="header-accent social-accent" />
              <h2 className="card-title">Social Links</h2>
            </div>
   <div className="social-buttons">
      {profile.linkedinURL && (
        <a
          href={profile.linkedinURL}
          target="_blank"
          rel="noopener noreferrer"
          className="social-button linkedin"
        >
          {/* BriefcaseIcon used for LinkedIn */}
          <BriefcaseIcon className="icon" aria-hidden="true" />
          <span>LinkedIn</span>
        </a>
      )}

      {profile.githubURL && (
        <a
          href={profile.githubURL}
          target="_blank"
          rel="noopener noreferrer"
          className="social-button github"
        >
          {/* CodeBracketIcon used for GitHub */}
          <CodeBracketIcon className="icon" aria-hidden="true" />
          <span>GitHub</span>
        </a>
      )}

      {profile.websiteURL && (
        <a
          href={profile.websiteURL}
          target="_blank"
          rel="noopener noreferrer"
          className="social-button website"
        >
          {/* GlobeAltIcon used for Portfolio/Website */}
          <GlobeAltIcon className="icon" aria-hidden="true" />
          <span>Portfolio</span>
        </a>
      )}

      {!profile.linkedinURL &&
        !profile.githubURL &&
        !profile.websiteURL && (
          <p className="no-links">No social links added yet.</p>
        )}
    </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
