import React, { useEffect, useState } from 'react';
import './navbar.css'; 
import axios from '../../axios';
import { Link } from 'react-router-dom';
function Navbar({ handleSidebarToggle }) {
    const [name, setName] = useState('');

    useEffect(() => {
        // Get the token from localStorage
        const token = localStorage.getItem('user-token');
    
        if (token) {
            // If token is available, make axios request with token in the headers
            axios.get('/get-email', {
                headers: {
                    Authorization: `Bearer ${token}` // Attach the token in the Authorization header
                }
            })
            .then(response => {
                setName(response.data.Name);
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching email:', error);
            });
        }
    }, []); 

    return (
        <div className="navigation">
            <div className="logo navbar-toggle" onClick={handleSidebarToggle}>
                <span>SKILLSYNC</span> 
            </div>
        
            <div className="navigation-icons">
                <Link className='post' to={'/post-request-offer'}><button> Post a Request / Offer</button></Link>
                <a href="#" className="navigation-link">
                    <i className="far fa-envelope"></i> {/* Message Icon */}
                </a>
                <a href="#" className="navigation-link">
                    <i className="far fa-bell"></i> {/* Notification Icon */}
                </a>
                <a id='name-a' href="" className="navigation-link">
                    <i className="far fa-user-circle"></i>
                    <span id='name'>{name}</span>
                </a>
                {/* <a href="https://instagram.com/mimoudix" id="signout" className="navigation-link">
                    <i className="fas fa-sign-out-alt"></i>
                </a> */}
            </div>
        </div>
    );
}

export default Navbar;

