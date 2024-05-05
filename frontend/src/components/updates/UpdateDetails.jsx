import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './user-details.css';
import axios from '../../axios';

function UpdateDetails() {
  const location = useLocation();
  const postId = location.state?.data; 
  const [updateData, setUpdateData] = useState(null);
  const [userId, setUserId] = useState('');
  const [isUserPost, setIsUserPost] = useState(false); // New state to track if it's the user's post

  useEffect(() => {
    console.log(postId);
    const fetchUpdateData = async () => {
      try {
        const token = localStorage.getItem('user-token');
        // Fetch update data based on postId
        const response = await axios.get(`/get-update/${postId}`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        setUpdateData(response.data.update);
        // Fetch user ID
        // const token = localStorage.getItem('user-token');
        const userResponse = await axios.get('/get-userId', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userId = userResponse.data.userId;
        setUserId(userId);
        setIsUserPost(userId === response.data.userId); // Check if it's the user's post
      } catch (error) {
        console.error('Error fetching update data:', error);
      }
    };
    if (postId) {
      fetchUpdateData();
    }
  }, [postId]);

  const sendNotification = async () => {
    try {
      const token = localStorage.getItem('user-token');
      // Send notification to the post owner
      const response = await axios.post('/send-notification', {
        postId: updateData._id,
        recipientUserId: updateData.userId, // Post owner's ID
        // senderUserId: userId, // ID of the user sending the notification
        message: 'Your post has been accepted.' // Notification message
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Notification sent:', response.data);
      // Optionally, handle success response
    } catch (error) {
      console.error('Error sending notification:', error);
      // Optionally, handle error
    }
  };

  return (
    <div className='update-details-container'>
      {updateData && (
        <div className='update-details'>
          {/* Conditionally render the message at the top */}
          {isUserPost && <div className="message">See your post</div>}
          <span className='tab'>{updateData?.tab}</span>
          <h2 className='heading'>{updateData?.heading}</h2>
          <div className='d-description'>{formatDescription(updateData?.description)}</div>
          {/* Conditionally render based on whether it's the user's post */}
          {!isUserPost && (
            <button onClick={sendNotification} className="view-details-link">Accept</button>
          )}
        </div>
      )}
    </div>
  );
}

function formatDescription(description) {
  // Split the description by newline characters and map each line to a <p> element
  return description?.split('\n').map((line, index) => (
    <p key={index}>{line}</p>
  ));
}

export default UpdateDetails;
