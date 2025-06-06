import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import './partners.css';
import {
  UserIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import IconButton from '@mui/material/IconButton'


function Partners() {
  const [partners, setPartners] = useState([]);
  const [myId, setMyId] = useState('');





  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = localStorage.getItem('user-token');
        const response = await axios.get('/get-partners', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPartners(response.data.partnerData);
        setMyId(response.data.myId);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };
    fetchPartners();


  }, []);

  const viewPartnerProfile = (userId) => {
    // any logic you need (analytics, pre-fetch, etc.)

  };


  const submitComment = async (partnerId, commentContent) => {
    try {
      const token = localStorage.getItem('user-token');
      const response = await axios.post('/submit-comment', {
        partnerId,
        content: commentContent
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Comment submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

return (
    <div className="partners-page">
      <h1 className="partners-title">Partners</h1>
      <p className="partners-subtitle">View and manage your collaborative partners.</p>

      <div className="partners-list-grid">
        {partners.map(partner => (
          <div className="partner-list-card" key={partner._id}>
            <div className="partner-top-bg" />
            <img
              className="partner-list-avatar"
              src={`https://skillsync-backend-xiwx.onrender.com/skillsync/uploads/${partner.partnerProfile.filename}`}
              alt={partner.partnerProfile.username}
            />
            <h3 className="partner-name">{partner.partnerProfile.username}</h3>
           <p className="partner-role">
  {partner.partnerProfile.skills && partner.partnerProfile.skills.length > 0
    ? partner.partnerProfile.skills
        .map(skill => `${skill.name} (${skill.level})`)
        .join(', ')
    : 'No skills listed'}
</p>
            <Link
              to={`/update/${partner.postId}`}
              state={{ data: partner.postId }}
              className="partner-post-link"
            >
              {partner.postTitle}
            </Link>
            <div className="partner-buttons">
              <button className="action-button" onClick={() => viewPartnerProfile(partner.partnerProfile.userId)}>
                <UserIcon className="button-icon" />
                Profile
              </button>
              <Link to="/my-partners" className="action-button">
                <ChatBubbleLeftEllipsisIcon className="button-icon" />
                Message
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Partners;
