import React, { useEffect, useState } from 'react';
import './navbar.css';
import axios from '../../axios';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar({ handleSidebarToggle }) {
    const [name, setName] = useState('');
    const [notifications, setNotifications] = useState([]); // State to store notifications
    const [showNotifications, setShowNotifications] = useState(false); // State for showing notifications dropdown
    const [senderId, setSenderId] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('user-token');
        if (token) {
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

    // Function to toggle notifications dropdown
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
                console.log(response.data);
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
        console.log("hi");
        try {
            const token = localStorage.getItem('user-token');
            // Send a message to the sender
            await axios.post('/send-message', {
                postId:notification.postId,
                senderUserId:notification.senderUserId,
                message: 'Let\'s become partners!'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Store partner details in a new collection
            await axios.post('/add-partner', {
                partnerId: notification.senderUserId, // ID of the notification sender
                postId: notification.postId 
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );

            // Optionally, you can update UI or show a success message
        } catch (error) {
            console.error('Error connecting:', error);
            // Handle error
        }
    };


    return (
        <div className="navigation">
            <div className="logo navbar-toggle" onClick={() => handleSidebarToggle('profile')}>
                <span>SKILLSYNC</span>
            </div>

            <div className="navigation-icons">
                <Link to={'/browse-profiles'} className='br-profile'>Browse Profiles</Link>
                <Link className='post' to={'/post-request-offer'}><button> Post a Request / Offer</button></Link>
                <a href="#" className="navigation-link">
                    <i className="far fa-envelope"></i> {/* Message Icon */}
                </a>
                <a href="#" className="navigation-link" onClick={toggleNotifications}>
                    <i className="far fa-bell"></i> {/* Notification Icon */}
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
                <Link to={"/control-panel"} id='name-a' href="" className="navigation-link" onClick={() => handleSidebarToggle('profile')}>
                    <i className="far fa-user-circle"></i>
                    <span id='name'>{name}</span>
                </Link>
            </div>
        </div>
    );
}

export default Navbar;
