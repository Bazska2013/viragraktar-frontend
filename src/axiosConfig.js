// src/axiosConfig.js

import axios from 'axios';

const BASE_URL = "http://localhost:8000";

// Set Axios defaults
axios.defaults.baseURL = BASE_URL; // Set the base URL for all requests
axios.defaults.withCredentials = true; // Send cookies with all requests
axios.defaults.withXSRFToken = true; // Send XSRF-TOKEN with all requests

export default axios;