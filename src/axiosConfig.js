import axios from 'axios';

const BASE_URL = "http://localhost:8000";

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export default axios;