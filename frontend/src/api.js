import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000' // We will change this to Render later!
});

export default API;