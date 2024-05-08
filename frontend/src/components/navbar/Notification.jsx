import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import './notification.css';

function NotificationDropdown({ handleSidebarToggle }) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Fetch notifications from the server
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('user-token');
                const response = await axios.get('/get-notifications',{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data);
                setNotifications(response.data.notifications); // Assuming response.data is an array of notifications
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="notification-dropdown">
            <div className="notification-header">
                <h3>Notifications</h3>
            </div>
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <p>No notifications</p>
                ) : (
                    notifications.map((notification, index) => (
                        <div key={index} className="notification-item">
                            {/* Display notification content */}
                            <p>{notification.message}</p>
                            {/* You can display other notification properties here */}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default NotificationDropdown;
