import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from "../../axios"
import './profile.css';
import Testimonials from './Testimonials';
function Profile() {
  const location = useLocation();
  // const profile = location.state?.savedUser;
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('user-token');
        const response = await axios.get('/get-profile',{
          headers: {
            Authorization: `Bearer ${token}`
        }
        }); // Replace '/api/profile' with your backend endpoint
        console.log(response);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);
  return (
    
    <div className='profile-container'>
      <Link to={'/edit-profile'} className="edit-profile-link">Edit Profile</Link>
      {profile && (
        <div className="profile-showcase">
          <div className="avatar-container">
            {/* Display profile picture */}
            <img src={`http://localhost:9000/skillsync/uploads/${profile.filename}`} className="avatar" alt="avatar" />
          </div>
          <div className="profile-info">
            {/* Display username and about */}
            <h2 className="username">{profile.username || 'Your Name'}</h2>
            <p className="about">{profile.about || 'Add something about yourself'}</p>
            <div className="skills">
              <h3>Skills</h3>
              <ul>
                {/* Display skills */}
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))
                ) : (
                  <li>No skills added</li>
                )}
              </ul>
            </div>
            <div className="education">
              <h3>Highest level of Education</h3>
              {/* Display education level */}
              <p>{profile.educationLevel || 'Education level not provided'}</p>
            </div>
            <div className="social-links">
              <h3>Social Links</h3>
              <ul>
                {/* Display social links */}
                <li>LinkedIn: <a href={profile.linkedinURL}>{profile.linkedinURL ? profile.linkedinURL : 'LinkedIn not provided'}</a></li>
                <li>Github: <a href={profile.githubURL}>{profile.githubURL ? profile.githubURL : 'Github not provided'}</a></li>
                <li>Website: <a href={profile.websiteURL}>{profile.websiteURL ? profile.websiteURL : 'Website not provided'}</a></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <Testimonials/>
    </div>
  );
}

export default Profile;
