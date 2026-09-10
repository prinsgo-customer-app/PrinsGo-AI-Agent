import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'https://prinsgo-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 // 15s timeout
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error fetching token from SecureStore", error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        useAuthStore.getState().logout();
      } else if (error.response.status === 403) {
        console.error("Access forbidden: you do not have permission.");
      }
    } else if (error.request) {
      console.error("Network or timeout error.", error.request);
    } else {
      console.error("Error setting up the request", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
