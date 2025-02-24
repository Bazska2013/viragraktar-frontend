import axios from 'axios';

const BASE_URL = "http://localhost:8000";

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
})

export default axios;