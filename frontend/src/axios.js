import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:9000/skillsync', // Replace with your API endpoint
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
    // You can add other headers here
  },
});

export default instance;
