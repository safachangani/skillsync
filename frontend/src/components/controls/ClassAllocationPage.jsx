import React, { useEffect, useState } from 'react';
import ClassAllocation from '../forms/ClassAllocation';
import './c-allocation.css'
import { Link } from 'react-router-dom';
import axios from '../../axios';
function ClassAllocationPage() {
    const [announcements, setAnnouncements] = useState([]);
  
  useEffect(() => {
    // Fetch announcements when component mounts
    const fetchAnnouncements = async () => {
      try {
      const token = localStorage.getItem('user-token');

        const response = await axios.get('/get-announcement',{
            headers: {
                Authorization: `Bearer ${token}`
              }
        });
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();
  }, []); // Empty dependency array to run effect only once when component mounts

  return (
    <div className='container-'>
      <Link to={'/form-announcement'} className='edit-profile-link'>Make Announcement</Link>
      <h1 className="form-title">Allocate Class</h1>
    <div className="form-">
      {/* Render announcements */}
      {announcements.map((announcement) => (
        <div className="announcement" key={announcement.id}>
          <h2 className="announcement-topic">{announcement.topic}</h2>
          <p className="announcement-location">Location: {announcement.location}</p>
          <p className="announcement-date">Date: {announcement.date}</p>
          <p className="announcement-time">Time: {announcement.time}</p>
          {/* Add createdBy if needed */}
        </div>
      ))}
      <form className="allocation-form">
        {/* Allocation form */}
      </form>
    </div>
  </div>
);
}
  


export default ClassAllocationPage;
