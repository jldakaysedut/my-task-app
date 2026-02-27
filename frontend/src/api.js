
import axios from 'axios';

const API = axios.create({

    baseURL: 'https://task-maker-backend.onrender.com'
});  

export default API;