import React from 'react'
import './welcome.css'
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
function Welcome({isProfileComplete,openPostPopup}) {
  const navigate = useNavigate();
   const handleCompleteProfile = () => {
    // if profile isn’t complete, send them to the edit page
    navigate('/edit-profile');
  };
  const handleCreatePost=()=>{
    openPostPopup();
  }
  return (
   <section className="hero-section">
      <div className="hero-overlay" />

      <div className="hero-content">
        <h1 className="hero-title">
          Welcome to <span>SkillSync</span>
        </h1>
        <p className="hero-subtitle">
          Find partners. Share your skills. Learn something new <br />
          all in one place.
        </p>

        <div className="hero-buttons">
        {isProfileComplete ?(
         
            <button className="btn-filled" onClick={handleCreatePost}>
              Post a Request / Offer
              <ArrowRightIcon className="btn-icon" />
            </button>
         ):(
             <button className="btn-outline" onClick={handleCompleteProfile}>
            Complete Profile
            <ArrowRightIcon className="btn-icon" />
          </button>
         ) }
        </div>
      </div>
    </section>

   
  )
}

export default Welcome
