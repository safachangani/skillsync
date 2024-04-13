import React, { useEffect, useState } from 'react';
import './update.css';
import { Link } from 'react-router-dom';
import axios from '../../axios';

function Update() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem('user-token');

    if (token) {
      // If token is available, make axios request with token in the headers
      axios.get('/get-updates', {
        headers: {
          Authorization: `Bearer ${token}` // Attach the token in the Authorization header
        }
      })
        .then(response => {
          console.log(response.data);
          // Set the updates in state
          setUpdates(response.data);
        })
        .catch(error => {
          console.error('Error fetching email:', error);
        });
    }
  }, []);

  return (
    <div className='update'>
      {updates.map((update, index) => (
        <div className='update-details' key={index}>
          <span>{update.tab}</span>
          <h2>{update.heading}</h2>
          <p>{update.description}</p>
          {console.log(update)}
          <Link to={`/update/${update._id}`} state={{ data:update}} className="view-details-link">View Details</Link>
        </div>
      ))}

    </div>
  )
}

export default Update
