import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import './notification.css'

function NotificationDropdown({ handleSidebarToggle }) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Fetch notifications from the server
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/notifications');
                setNotifications(response.data.notifications);
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
                <button onClick={handleSidebarToggle}>Close</button>
            </div>
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <p>No notifications</p>
                ) : (
                    notifications.map(notification => (
                        <div key={notification.id} className="notification-item">
                            {/* Display notification content */}
                            {notification.content}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default NotificationDropdown;
