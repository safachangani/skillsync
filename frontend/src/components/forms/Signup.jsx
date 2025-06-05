import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '../../validation/UserValidation';
import axios from '../../axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-skillsync.png';
import './signup.css';

export default function Signup() {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const navigate = useNavigate();

  function userSignup(data) {
    axios
      .post('/user-signup', data)
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('An error occurred while signing up');
        }
      });
  }

  return (
    <div className="signup-container">
      {/* ─── LEFT PANEL: SIGNUP FORM ─────────────────────────────────── */}
      <div className="signup-left-panel">
        <div className="signup-card">
          <img src={logo} alt="SkillSync Logo" className="signup-logo" />
          <h2 className="signup-title">Create Your Account</h2>
          <p className="signup-subtitle">Exchange • Learn • Network</p>

          {errorMessage && <p className="signup-error-text">{errorMessage}</p>}

          <form onSubmit={handleSubmit(userSignup)} className="signup-form">
            <div className="signup-form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                {...register('Name')}
                className={errors.Name ? 'signup-input-error' : ''}
              />
              {errors.Name && (
                <p className="signup-field-error">{errors.Name.message}</p>
              )}
            </div>

            <div className="signup-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('Email')}
                className={errors.Email ? 'signup-input-error' : ''}
              />
              {errors.Email && (
                <p className="signup-field-error">{errors.Email.message}</p>
              )}
            </div>

            <div className="signup-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('Password')}
                className={errors.Password ? 'signup-input-error' : ''}
              />
              {errors.Password && (
                <p className="signup-field-error">{errors.Password.message}</p>
              )}
            </div>

            <button type="submit" className="signup-btn signup-btn-primary">
              Sign Up
            </button>
          </form>

          <p className="signup-redirect-text">
            Already have an account?{' '}
            <Link to="/" className="signup-link">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* ─── RIGHT PANEL: BRAND HERO ──────────────────────────────────── */}
      <div className="signup-right-panel">
        <div className="signup-hero-content">
          <h3 className="signup-hero-heading">Welcome to Skillsync</h3>
          <ul className="signup-features-list">
            <li>
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="signup-feature-icon"
              >
                <path d="M12 20l9-8-9-8-9 8 9 8z" />
                <path d="M12 12l9-8-9-8-9 8 9 8z" opacity="0.3" />
              </svg>
              <span>Learn New Skills</span>
            </li>
            <li>
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="signup-feature-icon"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 3" />
              </svg>
              <span>Share Your Knowledge</span>
            </li>
            <li>
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="signup-feature-icon"
              >
                <path d="M16 8a6 6 0 11-8 0 6 6 0 018 0z" />
                <path d="M2 20v-2a4 4 0 014-4h12a4 4 0 014 4v2" />
              </svg>
              <span>Build Your Network</span>
            </li>
          </ul>
          <p className="signup-hero-cta">Join 250,000+ professionals today</p>
        </div>
      </div>
    </div>
  );
}
