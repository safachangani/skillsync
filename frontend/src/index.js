import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="183838131006-9jtm6uubsea0pksvofutc92j01n1ja6a.apps.googleusercontent.com">
  <App />
</GoogleOAuthProvider>
);


