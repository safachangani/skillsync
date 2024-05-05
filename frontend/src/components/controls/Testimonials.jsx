import React, { useEffect, useState } from 'react';
import './testimonials.css'; // Import your CSS file for styling
import axios from '../../axios';
const Testimonials = () => {
  
        const [comments, setComments] = useState([]);
      
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = localStorage.getItem('user-token');
                const response = await axios.get(`/get-comments`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                      }
                });
                setComments(response.data.comments);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        fetchComments();
    }, []);
    return (
        <div className="testimonials-container">
        <h1 className="testimonials-title">Testimonials</h1>
        <div className="testimonial">
          {comments.length > 0 ? (
            <div>
              {comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <p>{comment.content}</p>
                  <p>By: {comment.userName}</p>
                  <p>Date: {new Date(comment.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No comments yet</p>
          )}
        </div>
        {/* Add more testimonials here */}
      </div>
      
    );
};

export default Testimonials;
