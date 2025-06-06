import React, { useEffect, useState, useRef } from 'react';
import './navbar.css';
import axios from '../../axios';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo-skillsync.png';
import {
  ChatBubbleOvalLeftIcon,
  BellIcon,
  UserCircleIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

function Navbar({ openPostPopup }) {
  const [name, setName] = useState('');
   const [filename, setFilename] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  // Separate refs for each dropdown container:
  const profileRef = useRef();
  const notificationRef = useRef();

  // Toggle mobile sidebar
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // Fetch current user's name on mount
  useEffect(() => {
    const token = localStorage.getItem('user-token');
    if (token) {
      axios
        .get('/get-user-profile', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {setName(res.data.name)
          console.log(res.data);
          setFilename(res.data.filename)
          
        })
        .catch(err => console.error(err));
    }
  }, []);

  // Fetch notifications when dropdown opens
  const toggleNotifications = async (e) => {
    e.stopPropagation();
    setShowNotifications(prev => !prev);
    if (!showNotifications) {
      try {
        const token = localStorage.getItem('user-token');
        const res = await axios.get('/get-notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data.notifications);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Confirm “Connect” → call back-end /partners/accept
  const confirmConnect = async (notification) => {
    console.log("here iam",notification);
    
    try {
      const token = localStorage.getItem('user-token');
      const response = await axios.post(
        '/partners/accept',
        {
          postId: notification.postId,
          requesterId: notification.senderUserId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Replace the original “connect” request with an “accepted” notification
      setNotifications(prev =>
        prev
          .filter(n => n._id !== notification._id)
          .concat({
            _id: `accepted-${notification._id}`,
            postId: notification.postId,
            senderUserId: notification.senderUserId,
            senderUsername: notification.senderUsername,
            message: response.data.message, // e.g. “You are now partners with …”
            type: 'accepted',
            handled: false
          })
      );
    } catch (err) {
      console.error(err);
    }
    setConfirmationModal(null);
  };

  // Decline the request
  const handleDecline = async (notificationId) => {
    try {
      const token = localStorage.getItem('user-token');
      await axios.post(
        '/partners/decline',
        { notificationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (err) {
      console.error(err);
    }
  };

  // Attempt to post; if profile incomplete, show a small alert
  const checkProfileData = async () => {
    try {
      const token = localStorage.getItem('user-token');
      const res = await axios.get('/check-profile-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.profileExists) {
        openPostPopup();
      } else {
        alert('Please complete your profile first.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user-token');
    window.location.href = '/';
  };

  // Close dropdowns if clicking outside either ref
  useEffect(() => {
    const handleClickOutside = (e) => {
      // If click is outside both Profile and Notification dropdowns, close them
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="navigation">
        <div className="logo">
          <div className="menu-icon" onClick={toggleSidebar}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <Link to="/home">
            <img src={logo} alt="SkillSync" />
          </Link>
        </div>
        <div className='elements'>
        {/* ─── Move notification-wrapper out of navigation-icons ─── */}
        <div className="notification-wrapper" ref={notificationRef}>
          <button
            className="navigation-link"
            onClick={toggleNotifications}
            >
            <BellIcon className="nav-icon bell-icon" />
          </button>
          {showNotifications && (
            <div className="notification-dropdown" onClick={e => e.stopPropagation()}>
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n._id} className="notification-item">
                    <div className="profile-icon">
                      <UsersIcon className="nav-icon" />
                    </div>
                    <div className="notification-message">
                      {n.message}
                    </div>

                    {/* If already handled, show a label */}
                    {n.handled ? (
                      <div className="handled-label">
                        {n.type === 'accepted' ? '✅ Connected' : '❌ Declined'}
                      </div>
                    ) : (
                      // Only “connect” type has buttons
                      n.type === 'connect' ? (
                        <div className="btn-group">
                          <button
                            className="connect-btn"
                            onClick={() => setConfirmationModal(n)}
                          >
                            Connect
                          </button>
                          <button
                            className="decline-btn"
                            onClick={() => handleDecline(n._id)}
                          >
                            Decline
                          </button>
                        </div>
                      ) : null
                    )}
                  </div>
                ))
              ) : (
                <div className="no-notifications">No notifications</div>
              )}
            </div>
          )}
        </div>

        {/* ─── Desktop-only links & profile dropdown ─── */}
        <div className="navigation-icons">
          <Link to="/home" className="br-profile">
            Home
          </Link>

          <Link to="/my-partners" className="nav-link">
            <ChatBubbleOvalLeftIcon className="nav-icon" />
            <span className="link-text">Messages</span>
          </Link>

          <Link to="/browse-profiles" className="br-profile">
            Browse Profiles
          </Link>

          {/* Profile dropdown */}
          <div className="profile-dropdown-container" ref={profileRef}>
            <div
              className="navigation-link profile-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileDropdown(prev => !prev);
              }}
            >
              {filename ?
              (<img className="nav-icon"  src={`https://skillsync-backend-xiwx.onrender.com/skillsync/uploads/${filename}`} alt="" />

              ):(
                <UserCircleIcon className="nav-icon" />

              )}
              
             {console.log(name)}
              
              <span className="username">{name}</span>
            </div>
            {showProfileDropdown && (
              <div className="profile-dropdown" onClick={e => e.stopPropagation()}>
                <Link to="/my-profile" className="dropdown-item">
                  My Profile
                </Link>
                <Link to="/my-partners-list" className="dropdown-item">
                  My Partners
                </Link>
                <div onClick={handleLogout} className="dropdown-item logout">
                  Logout
                </div>
              </div>
            )}
          </div>

          <Link className="post" onClick={checkProfileData}>
            <button>Post</button>
          </Link>
        </div>
         </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="close-btn" onClick={toggleSidebar}>&times;</div>
        <Link to="/home" onClick={toggleSidebar}>Home</Link>
        <Link to="/my-partners" onClick={toggleSidebar}>Messages</Link>
        <Link to="/browse-profiles" onClick={toggleSidebar}>Browse Profiles</Link>
        <Link to="/my-profile" onClick={toggleSidebar}>My Profile</Link>
        <Link to="/my-partners-list" onClick={toggleSidebar}>My Partners</Link>
        <div onClick={handleLogout} className="logout-link">Logout</div>
      </div>
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      {/* Confirmation modal for “Connect” */}
      {confirmationModal && (
        <div
          className="confirmation-modal"
          onClick={() => setConfirmationModal(null)}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Confirm Connection</h3>
            <p>
              Do you want to connect with{' '}
              <strong>{confirmationModal.senderUsername}</strong>?
            </p>
            <div className="modal-buttons">
              <button onClick={() => setConfirmationModal(null)}>Cancel</button>
              <button onClick={() => confirmConnect(confirmationModal)}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
