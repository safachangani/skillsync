import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://skillsync-backend-xiwx.onrender.com/skillsync', // Replace with your API endpoint
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
    // You can add other headers here
  },
});

export default instance;
