import axios from 'axios';


const BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8000/api/v1'
  : '';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

export default api;