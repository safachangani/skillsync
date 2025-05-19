import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:9000/skillsync',
  //https://skillsync-backend-xiwx.onrender.com/skillsync
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
    // You can add other headers here
  },
});

export default instance;
