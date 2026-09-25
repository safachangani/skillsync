import React, { useEffect, useState } from 'react';
import './edit-profile.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import axios from '../../axios';
import { UserIcon, AtSymbolIcon, DocumentTextIcon, MapPinIcon, CodeBracketIcon, LinkIcon, CameraIcon } from '@heroicons/react/24/outline';

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
  const [previewUrl, setPreviewUrl] = useState(null);

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(()=>{
    const token = localStorage.getItem('user-token');
    const fetchProfile =async()=>{
      try{

        const response= await axios.get('/get-profile',{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const profile = response.data
        console.log(profile)
        setFormData({
        fullName: profile.fullName || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        skills: profile.skills || [],
        linkedin: profile.linkedinURL || '',
        github: profile.githubURL || '',
        portfolio: profile.websiteURL || ''
        })
        if(profile.filename){
          setPreviewUrl(`${process.env.REACT_APP_API_URL}/skillsync/uploads/${profile.filename}`)
        }
      }catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  },[])
  const addSkill = () => {
    if (!newSkill.trim()) return;
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: newSkill.trim(), level: selectedSkillExp }]
    }));
    setNewSkill('');
    setSelectedSkillExp('Beginner');
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('user-token');
    const form = new FormData();
    form.append('fullName', formData.fullName || '');
    form.append('username', formData.username || '');
    form.append('bio', formData.bio || '');
    form.append('location', formData.location || '');
    form.append('linkedinURL', formData.linkedin || '');
    form.append('githubURL', formData.github || '');
    form.append('websiteURL', formData.portfolio || '');
    form.append('skills', JSON.stringify(formData.skills));
    if (selectedFile) form.append('avatar', selectedFile);

    try {
      const response = await axios.post('/edit-profile', form, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      navigate('/my-profile', { state: { savedUser: response.data.savedUser } });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="edit-profile-page">
        <div className="edit-profile-container">
          <div className="edit-header-text">
            <h2>Edit Your Profile</h2>
            <p>Update your details and let the community know more about you.</p>
          </div>

          <form onSubmit={handleSave}>
            {/* Gradient header card */}
            <div className="profile-hero-card">
              <div className="avatar-wrap">
                <img
                  className="avatar-preview"
                  src={previewUrl || 'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png'}
                  alt="Profile preview"
                />
                <label className="avatar-camera-btn">
                  <CameraIcon className="icon-sm" />
                  <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                </label>
              </div>
              <div className="hero-name-block">
                <span className="hero-name">{formData.fullName || 'Your Name'}</span>
                <span className="hero-username">@{formData.username || 'username'}</span>
              </div>
            </div>

            {/* Full Name */}
            <div className="field-card">
              <div className="field-header">
                <span className="field-icon icon-indigo"><UserIcon className="icon-sm" /></span>
                <div>
                  <label>Full Name</label>
                  <p className="field-help">Your real name helps others know who you are.</p>
                </div>
              </div>
              <input name="fullName" onChange={handleChange} value={formData.fullName} />
            </div>

            {/* Username */}
            <div className="field-card">
              <div className="field-header">
                <span className="field-icon icon-blue"><AtSymbolIcon className="icon-sm" /></span>
                <div>
                  <label>Username</label>
                  <p className="field-help">Your unique public handle.</p>
                </div>
              </div>
              <input name="username" onChange={handleChange} value={formData.username} />
            </div>

            {/* Bio */}
            <div className="field-card">
              <div className="field-header">
                <span className="field-icon icon-green"><DocumentTextIcon className="icon-sm" /></span>
                <div>
                  <label>Bio</label>
                  <p className="field-help">Tell the community about yourself and what you're looking for.</p>
                </div>
              </div>
              <textarea name="bio" maxLength={250} onChange={handleChange} value={formData.bio} />
              <span className="char-count">{formData.bio.length}/250</span>
            </div>

            {/* Location */}
            <div className="field-card">
              <div className="field-header">
                <span className="field-icon icon-orange"><MapPinIcon className="icon-sm" /></span>
                <div>
                  <label>Location</label>
                  <p className="field-help">Where are you based?</p>
                </div>
              </div>
              <input name="location" onChange={handleChange} value={formData.location} />
            </div>

            {/* Skills */}
            <div className="field-card">
              <div className="field-header">
                <span className="field-icon icon-indigo"><CodeBracketIcon className="icon-sm" /></span>
                <div>
                  <label>Skills</label>
                  <p className="field-help">Add the skills you have and your current level.</p>
                </div>
              </div>
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
                    <button type="button" className="remove-skill" onClick={() => removeSkill(i)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="field-card">
              <div className="field-header">
                <span className="field-icon icon-blue"><LinkIcon className="icon-sm" /></span>
                <div>
                  <label>Social Links</label>
                  <p className="field-help">Add links to your profiles (optional).</p>
                </div>
              </div>
              <input placeholder="LinkedIn URL" name="linkedin" value={formData.linkedin} onChange={handleChange} />
              <input placeholder="GitHub URL" name="github" value={formData.github} onChange={handleChange} />
              <input placeholder="Portfolio URL" name="portfolio" value={formData.portfolio} onChange={handleChange} />
            </div>

            <div className="btn-group">
              <button type="button" className="cancel-btn" onClick={() => navigate('/my-profile')}>Cancel</button>
              <button type="submit" className="save-btn">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;