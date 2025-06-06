// src/components/update/Update.jsx
import React, { useEffect, useState } from 'react';
import './update.css';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ArrowUpTrayIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

function Update() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('user-token');
    if (!token) return;

    axios
      .get('/get-updates', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        // Sort by createdAt descending (newest first)
      const sorted = response.data
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUpdates(sorted);
      })
      .catch((error) => {
        console.error('Error fetching updates:', error);
      });
  }, []);

  return (
    <section className="updates-section">
      <h2 className="updates-heading">Recent Posts</h2>
      <div className="updates-container">
        {updates.map((update) => {
          // Safely derive CSS class from update.type:
          const typeClass = update.type
            ? update.type.toLowerCase().replace(/\s+/g, '-')
            : 'unknown';

          // Capitalize for display
          const displayType = update.type
            ? update.type.charAt(0).toUpperCase() + update.type.slice(1)
            : 'Unknown';

          // Format the createdAt nicely:
          const formattedDate = update.createdAt
            ? new Date(update.createdAt).toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : '';

          return (
            <article
              className={`update-card type-${typeClass}`}
              key={update._id}
            >
              {/* 1) Bookmark button */}
              <button className="bookmark-btn" aria-label="Bookmark post">
                <BookmarkIcon className="bookmark-icon" />
              </button>

              {/* 2) Top gradient area: avatar + type tag + timestamp */}
              <div className="card-top">
                <img
                  src={`https://skillsync-backend-xiwx.onrender.com/skillsync/uploads/${update.filename}`}
                  alt={`${update.username}'s avatar`}
                  className="user-avatar"
                />
                <div className="tag-and-time">
                  <span className="post-tag">{displayType}</span>
                </div>
              </div>

              {/* 3) White “bottom” area: title, description, skills, footer */}
              <div className="card-content">
                <h3 className="post-heading">{update.title}</h3>
                <p className="post-description">{update.description}</p>

                {/* 4) Skill tags, if any */}
                {Array.isArray(update.skills) && update.skills.length > 0 && (
                  <div className="skill-tags">
                    {update.skills.map((skill, idx) => (
                      <span className="skill-tag" key={idx}>
                        #{skill}
                      </span>
                    ))}
                  </div>
                )}

                <footer className="post-footer">
                  <div className="post-actions">
                    <button className="action-btn">
                      <HeartIcon className="action-icon" />
                      <span className="action-count">{update.likes || 0}</span>
                    </button>
                    <button className="action-btn">
                      <ChatBubbleOvalLeftIcon className="action-icon" />
                      <span className="action-count">
                        {update.comments || 0}
                      </span>
                    </button>
                    <button className="action-btn">
                      <ArrowUpTrayIcon className="action-icon" />
                      <span className="action-count">{update.shares || 0}</span>
                    </button>
                  </div>
                  <hr />
                  <Link
                    to={`/update/${update._id}`}
                    state={{ data: update._id }}
                    className="view-details-link"
                  >
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
