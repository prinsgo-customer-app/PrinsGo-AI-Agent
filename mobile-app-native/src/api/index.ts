import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://prinsgo-backend.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token for request interceptor', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // You can handle 401 unauthorized errors globally here
    if (error.response?.status === 401) {
       console.log('401 Unauthorized - Need to logout user or refresh token');
       // In a full implementation we would dispatch a logout action
       // But to avoid circular dependencies we can just emit an event or clear token
       await AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);
