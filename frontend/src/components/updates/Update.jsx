import React, { useEffect, useState } from 'react';
import './update.css';
import { Link } from 'react-router-dom';
import axios from '../../axios';

function Update() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('user-token');

    if (token) {
      axios.get('/get-updates', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setUpdates(response.data);
        console.log(response,"hi");
      })
      .catch(error => {
        console.error('Error fetching updates:', error);
      });
    }
  }, []);

  return (
    <div className='update-container'>
      {updates.map((update, index) => (
        <div className='update-card' key={index}>
          <span className='tab'>{update.tab}</span>
          <div className='user-info'>
          <img src={`http://localhost:9000/skillsync/uploads/${update.filename}`} className="avatar-u" alt="avatar" />
            <span className='user-name'>{update.username}</span>
          </div>
          <h2 className='heading'>{update.heading}</h2>
          <p className='description'>{update.description}</p>
          <Link to={`/update/${update._id}`} state={{ data:update._id}} className="view-details-link">View Details</Link>
        </div>
      ))}
    </div>
  )
}

export default Update
