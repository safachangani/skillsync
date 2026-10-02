import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import './post-details.css';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
const PostDetails = () => {
  const [updateData, setUpdateData] = useState(null);
  const [myId, setMyId] = useState(null);
  const [isUserPost, setIsUserPost] = useState(false);
  const stateLocation = useLocation();
  const postId = stateLocation.state?.data;
  const [requestStatus, setRequestStatus] = useState('idle');
  const getButtonLabel = () => {
    const isOffer = updateData.type === 'offer';
    switch (requestStatus) {
      case 'pending':
        return isOffer ? 'Interest Sent' : 'Response Sent'
      case 'accepted':
        return "Connected";
      case 'declined':
        return 'request Declined'
      default:
        return isOffer ? "I'm Interested" : 'Offer to Help'
    }
  }
  useEffect(() => {
    const fetchUpdateData = async () => {
      try {
        const token = localStorage.getItem('user-token');
        const response = await axios.get(`/get-update/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedUpdateData = response.data.postReqOff;
        setUpdateData(fetchedUpdateData);
        // console.log(fetchUpdateData);

        const userResponse = await axios.get('/get-userId', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentUserId= userResponse.data.userId;
        setMyId(currentUserId);
        const ownPost = fetchedUpdateData.userId === currentUserId;
        setIsUserPost(ownPost)
        
        if (!ownPost) {
            const statusResponse = await axios.get(`/connections/status/${postId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            
          if (statusResponse.data.status !== 'none') {
            setRequestStatus(statusResponse.data.status);
          }

        }
      } catch (error) {
        console.error('Error fetching update data:', error);
      }
    };

    if (postId) fetchUpdateData();
  }, [postId]);

  const sendConnectionRequest = async () => {
    try {
      const token = localStorage.getItem('user-token');
      await axios.post('/connections/request',
        {
          recipientUserId: updateData.userId,
          postId: updateData._id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequestStatus('pending') // temporary, just to confirm it worked — we'll replace with something nicer later
    } catch (err) {
      if (err.response?.status === 400) {
        setRequestStatus('pending'); // "Request already sent."
      } else {
        console.error('Error sending connection request:', err);
      }
    }
  }
  if (!updateData) return <div className="loading">Loading post details...</div>;

  const {
    title,
    type,
    createdAt,
    username,
    category,
    location,
    description,
    skills,
    profileId
  } = updateData;
  // In your React component:
  const sendNotification = async () => {
    try {
      const payload = {
        postId: updateData._id,
        recipientUserId: updateData.userId,
        prefix: `Your ${updateData.type.charAt(0).toUpperCase() + updateData.type.slice(1)} “${updateData.title}” has been accepted by `
      };
      const token = localStorage.getItem('user-token');
      await axios.post('/send-notification', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="post-details-container">
      <div className="banner">
        <div className="banner-gradient" />
      </div>

      <div className="content-wrap">
        <h1 className="post-title">{title}</h1>
        {isUserPost && (
          <div className="your-post-label">This is your post</div>
        )}
        <div className="post-meta">
          <div className="meta-left">
            <span className={`tag-pill type-${type.toLowerCase()}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
            <span className="meta-info">
              <strong>By</strong>{' '}

              <Link to="/profile-visit" state={{ profileId: profileId }} className="meta-link">
                {username}
              </Link>
            </span>

          </div>
          <div className="meta-right">
            <span className="meta-info">
              <strong>Posted</strong> {new Date(createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="meta-info">
              <strong>Category</strong> {category}
            </span>
            <span className="meta-info">
              <strong>Location</strong> {location}
            </span>
          </div>
        </div>

        <div className="post-section">
          <h3>Description</h3>
          <p className="post-description">{description}</p>
        </div>

        {skills?.length > 0 && (
          <div className="post-section">
            <h3>Skills</h3>
            <div className="skills-tags">
              {skills.map((skill, index) => (
                <span className="skill-tag" key={index}>#{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* ─── Action Section ───────────────────────────────────────── */}
        <div className="action-section">
          {isUserPost ? (
            <>
              <button className="edit-btn">Edit Post</button>
            </>
          ) : (
            <button
              className={`accept-btn ${requestStatus !== 'idle' ? requestStatus : ''}`}
              onClick={sendConnectionRequest}
              disabled={requestStatus !== 'idle'}
            >
              {getButtonLabel()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
