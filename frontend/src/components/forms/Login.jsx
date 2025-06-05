import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../validation/UserValidation';
import axios from '../../axios';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import logo from '../../assets/logo-skillsync.png';
import './login.css';

export default function UserLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // ─── 1) Manual email/password login ──────────────────────────────────
  function loginSubmit(data) {
    axios
      .post('/user-login', data)
      .then((response) => {
        if (response.data.message === 'successfully logged in') {
          localStorage.setItem('user-token', response.data.accessToken);
          navigate('/home', { replace: true });
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage('Something went wrong. Please try again.');
      });
  }

  // ─── 2) Google login handler ────────────────────────────────────────
  function handleGoogleLogin(res) {
    const { credential } = res;
    axios
      .post('/google-login', { credential })
      .then((response) => {
        if (response.data.message === 'success') {
          localStorage.setItem('user-token', response.data.accessToken);
          navigate('/home', { replace: true });
        } else {
          setErrorMessage(response.data.message || 'Google login failed');
        }
      })
      .catch((err) => {
        console.error('Google login error:', err);
        setErrorMessage('Unable to log in with Google. Please try again.');
      });
  }

  return (
    <div className="container">
      {/* ─── LEFT PANEL: LOGIN FORM ─────────────────────────────────── */}
      <div className="left-panel">
        <div className="login-card">
          <img src={logo} alt="SkillSync Logo" className="login-logo" />
          <h2 className="title">Welcome Back to Skillsync</h2>
          <p className="subtitle">Connect • Learn • Grow</p>

          <form onSubmit={handleSubmit(loginSubmit)} className="form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('Email')}
                className={errors.Email ? 'input-error' : ''}
              />
              {errors.Email && <p className="field-error">{errors.Email.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('Password')}
                className={errors.Password ? 'input-error' : ''}
              />
              {errors.Password && <p className="field-error">{errors.Password.message}</p>}
            </div>

            <div className="links-row">
              <Link to="/forgot-password" className="link-secondary">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary">
              Sign In
            </button>
          </form>

          <div className="alt-login">
            <span className="divider-text">or continue with</span>
            <div className="google-button">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setErrorMessage('Google login failed')}
              />
            </div>
          </div>

          <p className="signup-text">
            Don’t have an account?{' '}
            <Link to="/signup" className="link-secondary">
              Sign Up
            </Link>
          </p>

          {errorMessage && <p className="error-text">{errorMessage}</p>}
        </div>
      </div>

      {/* ─── RIGHT PANEL: FEATURE HIGHLIGHTS ──────────────────────────── */}
      <div className="right-panel">
        <div className="hero-content">
          <h3 className="hero-heading">Why Skillsync?</h3>
          <ul className="features-list">
            <li>
              {/* You can swap in your own SVG icons; these are inline placeholders */}
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="feature-icon"
              >
                <path d="M12 20l9-8-9-8-9 8 9 8z" />
                <path d="M12 12l9-8-9-8-9 8 9 8z" opacity="0.3" />
              </svg>
              <span>Learn new skills</span>
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
                className="feature-icon"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 3" />
              </svg>
              <span>Share your knowledge</span>
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
                className="feature-icon"
              >
                <path d="M16 8a6 6 0 11-8 0 6 6 0 018 0z" />
                <path d="M2 20v-2a4 4 0 014-4h12a4 4 0 014 4v2" />
              </svg>
              <span>Grow your network</span>
            </li>
          </ul>
          <p className="hero-cta">Join 250,000+ pros today</p>
        </div>
      </div>
    </div>
);
}
