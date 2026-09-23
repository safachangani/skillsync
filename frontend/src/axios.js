import axios from 'axios';

const instance = axios.create({
  // baseURL: 'https://skillsync-backend-xiwx.onrender.com/skillsync',
  baseURL: `${process.env.REACT_APP_API_URL}/skillsync`,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
    // You can add other headers here
  },
});

export default instance;
