import React, { useEffect, useState } from 'react';
import './update.css';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

const AVATAR_COLORS = ['#DCFCE7', '#FCE7F3', '#DBEAFE', '#FEF3C7', '#E0E7FF'];

function getInitials(name = '') {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function Update() {
  const [updates, setUpdates] = useState([]);
  const [LikedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('user-token');
    if (!token) return;
    axios
      .get('/get-updates', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        const sorted = response.data
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUpdates(sorted);
      })
      .catch((error) => console.error('Error fetching updates:', error));
  }, []);

  const handleLike = async (updateId) => {
    const token = localStorage.getItem('user-token');
    if (!token) return;
    const alreadyLiked = LikedPosts[updateId];
    setUpdates((prev) =>
      prev.map((u) =>
        u._id === updateId ? { ...u, likes: (u.likes || 0) + (alreadyLiked ? -1 : 1) } : u
      )
    );
    setLikedPosts((prev) => ({ ...prev, [updateId]: !alreadyLiked }));
    try {
      await axios.post(`/update/${updateId}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error liking Post:', error);
      setUpdates((prev) =>
        prev.map((u) =>
          u._id === updateId ? { ...u, likes: (u.likes || 0) + (alreadyLiked ? 1 : -1) } : u
        )
      );
      setLikedPosts((prev) => ({ ...prev, [updateId]: alreadyLiked }));
    }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const hrs = Math.floor(diffMs / 3600000);
    if (hrs < 1) return 'Just now';
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <section className="updates-section">
      <div className="updates-header-row">
        <h2 className="updates-heading">Recent Skill Exchanges</h2>
      </div>
      <div className="updates-container">
        {updates.map((update, idx) => {
          const typeClass = update.type ? update.type.toLowerCase().replace(/\s+/g, '-') : 'unknown';
          const displayType = update.type ? update.type.charAt(0).toUpperCase() + update.type.slice(1) : 'Unknown';
          const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

          return (
            <article className="update-card" key={update._id}>
              <div className="card-header">
                {update.filename ? (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/skillsync/uploads/${update.filename}`}
                    alt={`${update.username}'s avatar`}
                    className="user-avatar"
                  />
                ) : (
                  <div className="avatar-initials" style={{ background: avatarColor }}>
                    {getInitials(update.username)}
                  </div>
                )}
                <div className="header-text">
                  <span className="username-line">{update.username}</span>
                  <span className="time-line">{timeAgo(update.createdAt)}</span>
                </div>
                <button className="bookmark-btn" aria-label="Bookmark post">
                  <BookmarkIcon className="bookmark-icon" />
                </button>
              </div>

              <span className={`post-tag type-${typeClass}`}>{displayType}</span>

              <div className="card-content">
                <h3 className="post-heading">{update.title}</h3>
                <p className="post-description">{update.description}</p>

                {Array.isArray(update.skills) && update.skills.length > 0 && (
                  <div className="skill-tags">
                    {update.skills.map((skill, i) => (
                      <span className="skill-tag" key={i}>{skill}</span>
                    ))}
                  </div>
                )}

                <footer className="post-footer">
                  <div className="post-actions">
                    <button className="action-btn" onClick={() => handleLike(update._id)}>
                      <HeartIcon className="action-icon" />
                      <span className="action-count">{update.likes || 0}</span>
                    </button>
                    <button className="action-btn">
                      <ChatBubbleOvalLeftIcon className="action-icon" />
                      <span className="action-count">{update.comments || 0}</span>
                    </button>
                  </div>
                  <Link to={`/update/${update._id}`} state={{ data: update._id }} className="view-details-link">
                    View Details →
                  </Link>
                </footer>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Update;