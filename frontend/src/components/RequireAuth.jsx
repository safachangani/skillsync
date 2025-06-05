// src/components/RequireAuth.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const token = localStorage.getItem('user-token');
  if (!token) {
    // If no token, redirect to / (your login page)
    return <Navigate to="/" replace />;
  }
  return children;
}
