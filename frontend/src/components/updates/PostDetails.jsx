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
        const fetchedUserId = userResponse.data.userId;
        setMyId(fetchedUserId);
        
        setIsUserPost(fetchedUpdateData.userId === fetchedUserId);
      } catch (error) {
        console.error('Error fetching update data:', error);
      }
    };

    if (postId) fetchUpdateData();
  }, [postId]);

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
            <button className="accept-btn " onClick={sendNotification}>Accept</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
