// src/components/RequireNoAuth.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RequireNoAuth({ children }) {
  const token = localStorage.getItem('user-token');
  if (token) {
    // If a token exists, immediately redirect to /home (replace history)
    return <Navigate to="/home" replace />;
  }
  return children;
}
