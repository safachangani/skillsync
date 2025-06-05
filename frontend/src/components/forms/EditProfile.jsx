import React, { useState } from 'react';
import './edit-profile.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import axios from '../../axios';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    bio: '',
    location: '',
    skills: [],
    linkedin: '',
    github: '',
    portfolio: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [selectedSkillExp, setSelectedSkillExp] = useState('Beginner');
  const [selectedFile, setSelectedFile] = useState(null);

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: newSkill.trim(), level: selectedSkillExp }]
    }));
    setNewSkill('');
    setSelectedSkillExp('Beginner');
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('user-token');
    const form = new FormData();

    form.append('fullName', formData.fullName);
    form.append('username', formData.username);
    form.append('bio', formData.bio);
    form.append('location', formData.location);
    form.append('linkedinURL', formData.linkedin);
    form.append('githubURL', formData.github);
    form.append('websiteURL', formData.portfolio);
    form.append('skills', JSON.stringify(formData.skills)); // important
    if (selectedFile) {
      form.append('avatar', selectedFile); // image file
    }

    try {
      const response = await axios.post('/edit-profile', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Profile updated successfully:', response.data.savedUser);
      navigate('/my-profile', { state: { savedUser: response.data.savedUser } });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="edit-profile-container">
        <h2>Edit Your Profile</h2>
        <form onSubmit={handleSave}>
          <label>Full Name</label>
          <input name="fullName" onChange={handleChange} value={formData.fullName} />

          <label>Username</label>
          <input name="username" onChange={handleChange} value={formData.username} />

          <label>Bio</label>
          <textarea name="bio" onChange={handleChange} value={formData.bio} />

          <label>Profile Picture</label>
          <input type="file" onChange={handleFileChange} />

          <label>Location</label>
          <input name="location" onChange={handleChange} value={formData.location} />

          <label>Select Skills</label>
          <div className="skill-input-group">
            <input
              type="text"
              placeholder="e.g., React, Figma"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <select value={selectedSkillExp} onChange={(e) => setSelectedSkillExp(e.target.value)}>
              {experienceLevels.map((level, i) => (
                <option key={i} value={level}>{level}</option>
              ))}
            </select>
            <button type="button" onClick={addSkill}>Add</button>
          </div>

          <div className="skills-list">
            {formData.skills.map((skill, i) => (
              <span key={i} className="skill-tag">
                {skill.name} <small>({skill.level})</small>
              </span>
            ))}
          </div>

          <label>Social Links</label>
          <input placeholder="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} />
          <input placeholder="GitHub" name="github" value={formData.github} onChange={handleChange} />
          <input placeholder="Portfolio" name="portfolio" value={formData.portfolio} onChange={handleChange} />

          <div className="btn-group">
            <button type="button" className="cancel-btn" onClick={() => navigate('/my-profile')}>Cancel</button>
            <button type="submit" className="save-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
