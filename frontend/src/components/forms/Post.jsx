// src/components/post/Post.jsx
import React, { useState, useEffect } from 'react';
import './post.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../axios';
import { requestOfferSchema } from '../../validation/UserValidation';
import { useNavigate } from 'react-router-dom';

function Post({ onClose }) {
  const navigate = useNavigate();

  // Local state for dynamic skills
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
const [successMessage, setSuccessMessage] = useState('');

  // Local state for toggle ("request" or "offer"), default is "request"
  const [type, setType] = useState('request');

  // Initialize react-hook-form, with defaultValues including type
  const {register,handleSubmit,formState: { errors },setValue,reset} = useForm({
    resolver: yupResolver(requestOfferSchema),
    defaultValues: {
      title: '',
      type: 'request',
      category: '',
      description: ''
    }
  });

  // Ensure the RHF field "type" matches our local state on mount
  useEffect(() => {
    setValue('type', 'request');
  }, [setValue]);

  /*** Skill Handlers ***/
  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills((prev) => [...prev, trimmed]);
    setNewSkill('');
  };

  const handleRemoveSkill = (idxToRemove) => {
    setSkills((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  /*** Toggle Handler ***/
  const handleToggle = (selectedType) => {
    setType(selectedType);
    setValue('type', selectedType); // Update RHF field
  };

  /*** Form Submission ***/
  const onSubmit = async (data) => {
    console.log("checking this page",data);
    const token = localStorage.getItem('user-token');
    
    // Build payload including dynamic skills and createdAt
    const payload = {
      ...data,                    // { title, type, category, description }
      skills,                     // array of strings
      createdAt: new Date().toISOString()
    };

    try {
      const response = await axios.post('/post-request-offer', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Post response:', response.data);
       // Show success message
  setSuccessMessage('✅ Your post has been submitted!');
      reset();           // clear the form fields
      setSkills([]);     // clear skill badges
      setNewSkill('');   // reset skill input
      setType('request');
      setValue('type', 'request');
      setTimeout(()=>{
        onClose()
      },1500)
    } catch (error) {
      console.error('Error submitting post:', error);
     setSuccessMessage('❌ Failed to submit. Please try again.');
  setTimeout(() => setSuccessMessage(''), 2500);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
        <button type="button" className="close-btn" onClick={onClose}>×</button>
        <h1 className="form-title">Post a Request or Offer</h1>
        <p className="form-subtitle">
          Describe your request or offer to find the right collaborative partners
        </p>


 

        {/* ─── Title Field ──────────────────────────────────────────────────── */}
        <label htmlFor="title" className="form-label">Title <span className="required-marker">*</span></label>
        <input id="title" {...register('title')} type="text" placeholder="Looking for a React mentor"
          className={`form-input ${errors.title ? 'error-input' : ''}`}/>
        {errors.title && <p className="error-text">{errors.title.message}</p>}

        {/* ─── Type Toggle (Request / Offer) ───────────────────────────────── */}
        <label className="form-label">Type <span className="required-marker">*</span></label>
        <div className="toggle-buttons">
          <button type="button" className={`toggle-btn ${type === 'request' ? 'active' : ''}`}
            onClick={() => handleToggle('request')} >Request</button>
          <button type="button" className={`toggle-btn ${type === 'offer' ? 'active' : ''}`}
            onClick={() => handleToggle('offer')}> Offer</button>
        </div>
        {/* Hidden input to store "type" in form */}
        <input type="hidden" {...register('type')} />
        {errors.type && <p className="error-text">{errors.type.message}</p>}

        {/* ─── Category (Free‐Text) ──────────────────────────────────────────── */}
        <label htmlFor="category" className="form-label">
          Category <span className="required-marker">*</span>
        </label>
        <input
          id="category"
          {...register('category')}
          type="text"
          placeholder="e.g. Web Development, Data Analysis, Marketing"
          className={`form-input ${errors.category ? 'error-input' : ''}`}
        />
        {errors.category && <p className="error-text">{errors.category.message}</p>}

        {/* ─── Description Field ───────────────────────────────────────────── */}
        <label htmlFor="description" className="form-label">
          Description <span className="required-marker">*</span>
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows="4"
          placeholder="Seeking an experienced React developer to provide mentorship..."
          className={`form-input textarea ${errors.description ? 'error-input' : ''}`}
        />
        {errors.description && <p className="error-text">{errors.description.message}</p>}

        {/* ─── Dynamic Skills ― Add / Remove ───────────────────────────────── */}
        <label className="form-label">Skills</label>
        <div className="skill-tags-container">
          {/* Existing skill badges */}
          {skills.map((skill, idx) => (
            <span key={idx} className="skill-badge">
              {skill}
              <button
                type="button"
                className="remove-skill-btn"
                onClick={() => handleRemoveSkill(idx)}
              >
                ×
              </button>
            </span>
          ))}

          {/* Input for adding a new skill */}
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Type a skill and press Enter"
            className="add-skill-input"
          />
          <button
            type="button"
            className="add-skill-btn"
            onClick={handleAddSkill}
          >
            Add
          </button>
        </div>
        
       {successMessage && (
  <div className="form-success-message">
    {successMessage}
  </div>
)}
        {/* ─── Submit Button ───────────────────────────────────────────────── */}
        <button type="submit" className="submit-button">
          Post
        </button>
      </form>
    </div>
  );
}

export default Post;

