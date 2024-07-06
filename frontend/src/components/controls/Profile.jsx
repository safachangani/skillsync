import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from '../../axios';
import './profile.css';
import Testimonials from './Testimonials';

function Profile() {
    const location = useLocation();
    const [profile, setProfile] = useState(null);
    const defaultImage = 'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png'; // Replace with your default image path

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('user-token');
                const response = await axios.get('/get-profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    // Function to handle image loading errors
    const handleImageError = (event) => {
        event.target.src = defaultImage; // Set default image if loading fails
    };

    return (
        <div className='profile-container'>
            <Link to='/edit-profile' className='edit-profile-link'>Edit Profile</Link>
            {profile && (
                <div className='profile-showcase'>
                    <div className='avatar-container'>
                        <img 
                            src={profile.filename ? `http://localhost:9000/skillsync/uploads/${profile.filename}` : defaultImage} 
                            className='avatar' 
                            alt='avatar' 
                            onError={handleImageError} // Handle image loading errors
                        />
                    </div>
                    <div className='profile-info'>
                        <h2 className='username'>{profile.username || 'Your Name'}</h2>
                        <p className='about'>{profile.about || 'Add something about yourself'}</p>
                        <div className='skills'>
                            <h3>Skills</h3>
                            <ul id='skills-list'>
                                {profile.skills && profile.skills.length > 0 ? (
                                    profile.skills.map((skill, index) => (
                                        <li key={index}>{skill}</li>
                                    ))
                                ) : (
                                    <li>No skills added</li>
                                )}
                            </ul>
                        </div>
                        <div className='education'>
                            <h3>Highest level of Education</h3>
                            <p>{profile.educationLevel || 'Education level not provided'}</p>
                        </div>
                        <div className='social-links'>
                            <h3>Social Links</h3>
                            <ul>
                                <li>LinkedIn: <a href={profile.linkedinURL}>{profile.linkedinURL ? profile.linkedinURL : 'LinkedIn not provided'}</a></li>
                                <li>Github: <a href={profile.githubURL}>{profile.githubURL ? profile.githubURL : 'Github not provided'}</a></li>
                                <li>Website: <a href={profile.websiteURL}>{profile.websiteURL ? profile.websiteURL : 'Website not provided'}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            <Testimonials />
        </div>
    );
}

export default Profile;
