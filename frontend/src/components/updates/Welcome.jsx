import React from 'react'
import './welcome.css'
import { ArrowRightIcon, UserGroupIcon, LightBulbIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

function Welcome({ isProfileComplete, openPostPopup }) {
  const navigate = useNavigate();
  const handleCompleteProfile = () => navigate('/edit-profile');
  const handleCreatePost = () => openPostPopup();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="hero-eyebrow">Skills bring people closer</p>
        <h1 className="hero-title">
          Learn Together, <br />Grow <span>Together</span>
        </h1>
        <p className="hero-subtitle">
          A skill exchange community where you can request help, offer your
          skills, and collaborate with amazing people.
        </p>

        <div className="hero-buttons">
          {isProfileComplete ? (
            <button className="btn-filled" onClick={handleCreatePost}>
              Post a Request or Offer
              <ArrowRightIcon className="btn-icon" />
            </button>
          ) : (
            <button className="btn-outline" onClick={handleCompleteProfile}>
              Complete Profile
              <ArrowRightIcon className="btn-icon" />
            </button>
          )}
        </div>
        <p className="hero-tagline">Small Skills. Big Opportunities.</p>
      </div>

      <div className="hero-overlay">
        <div className="hero-card request">
          <div className="hero-card-icon"><UserGroupIcon width={20} /></div>
          <div>
            <strong>Request</strong>
            <span>Learn from the community</span>
          </div>
        </div>
        <div className="hero-card offer">
          <div className="hero-card-icon"><LightBulbIcon width={20} /></div>
          <div>
            <strong>Offer</strong>
            <span>Share what you know</span>
          </div>
        </div>
        <span className="hero-annotation a1">Share Skills ↘</span>
        <span className="hero-annotation a2">Grow Together ♡</span>
        <span className="hero-annotation a3">Build Connections ↗</span>
      </div>
    </section>
  )
}

export default Welcome