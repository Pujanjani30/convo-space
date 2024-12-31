import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8000/api/v1'
  : import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Allows cookies to be sent with requests
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

// Interceptor for handling expired access token
api.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  async (error) => {
    const originalRequest = error.config;

    // Skip handling for the /auth/refresh-token endpoint
    if (originalRequest.url.includes('/auth/refresh-token')) {
      return Promise.reject(error);
    }

    // Check if the error is due to an expired access token (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      if (isRefreshing) {
        // Queue the request until the refresh is complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Attempt to refresh the access token
        await api.post('/auth/refresh-token');

        processQueue(); // Retry queued requests

        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        processQueue(refreshError); // Reject queued requests
        Cookies.remove('user'); // Clear the user cookie
        window.location.href = '/login'; // Redirect to login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;