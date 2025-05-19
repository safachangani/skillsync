// Navbar.js
import React, { useEffect, useState } from 'react';
import './navbar.css';
import axios from '../../axios';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar({ handleSidebarToggle }) {
    const [name, setName] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [senderId, setSenderId] = useState('');
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('user-token');
        if (token) {
            setIsLoggedIn(true);
            axios.get('/get-email', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setName(response.data.Name);
                })
                .catch(error => {
                    console.error('Error fetching email:', error);
                });
        }
    }, []);

    const toggleNotifications = async () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            try {
                const token = localStorage.getItem('user-token');
                const response = await axios.get('/get-notifications', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const notificationsData = response.data;
                const updatedNotifications = notificationsData.notifications.map(notification => {
                    const showConnectButton = !notification.message.startsWith("You are now partners with");
                    return { ...notification, showConnectButton };
                });
                setNotifications(updatedNotifications);
                setSenderId(notificationsData.senderId);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        }
    };

    const handleConnect = async (notification) => {
        try {
            const token = localStorage.getItem('user-token');
            await axios.post('/send-message', {
                postId: notification.postId,
                senderUserId: notification.senderUserId,
                message: 'Let\'s become partners!'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await axios.post('/add-partner', {
                partnerId: notification.senderUserId,
                postId: notification.postId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error connecting:', error);
        }
    };

    const checkProfileData = async () => {
        try {
            const token = localStorage.getItem('user-token');
            const response = await axios.get('/check-profile-data', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.profileExists) {
                window.location.href = '/post-request-offer';
            } else {
                setShowProfilePopup(true);
            }
        } catch (error) {
            console.error('Error checking profile data:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user-token');
        setIsLoggedIn(false);
        setName('');
        window.location.href = '/login';
    };

    return (
        <div className="navigation">
            <div className="logo navbar-toggle" onClick={handleSidebarToggle}>
                <Link to={'/home'}><span>SKILLSYNC</span></Link>
            </div>
            <div className="navigation-icons">
                 <Link to={'/control-panel'} className='br-profile'>Dashboard</Link>
                 <Link to={'/my-partners'} className='br-profile'>Messages</Link>
                <Link to={'/browse-profiles'} className='br-profile'>Browse Profiles</Link>
                <Link className='post' onClick={checkProfileData}><button>Post a Request / Offer</button></Link>
                <a href="#" className="navigation-link">
                    <i className="far fa-envelope"></i>
                </a>
                <a href="#" className="navigation-link" onClick={toggleNotifications}>
                    <i className="far fa-bell"></i>
                    {showNotifications && (
                        <div className="notification-dropdown">
                            {notifications.map(notification => (
                                <div key={notification._id} className="notification-item">
                                    <div className="profile-icon"><AccountCircleIcon /></div>
                                    <div className="notification-message">{notification.message}</div>
                                    {notification.showConnectButton && (
                                        <button onClick={() => handleConnect(notification)}>Connect</button>
                                    )}
                                </div>
                            ))}
                            {notifications.length === 0 && <div>No notifications</div>}
                        </div>
                    )}
                </a>
                <div className="profile-dropdown-container">
                    <div className="navigation-link profile-icon" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                        <i className="far fa-user-circle"></i>
                        <span id='name'>{name}</span>
                    </div>
                    {showProfileDropdown && (
                        <div className="profile-dropdown">
                            {isLoggedIn ? (
                                <div onClick={handleLogout}>Logout</div>
                            ) : (
                                <Link to="/login">Login</Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {showProfilePopup && (
                <div className="profile-popup">
                    <div className="popup-message">
                        Please complete your profile before posting a request/offer
                        <button onClick={() => window.location.href = '/control-panel'}>Edit Profile</button>
                        <button onClick={() => setShowProfilePopup(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;
