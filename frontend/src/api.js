import axios from 'axios';

const API = axios.create({
    // Replace 'your-app-name' with your actual Render service name
    baseURL: 'https://task-maker-backend.onrender.com' 
});

export default API;

