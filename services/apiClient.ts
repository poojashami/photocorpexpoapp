import axios from 'axios';
import { Storage } from '../utils/storage';
import { Config } from '../constants/Config';

const apiClient = axios.create({
  baseURL: Config.API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the Bearer token and Company ID
apiClient.interceptors.request.use(
  async (config) => {
    const token = await Storage.getItem('userToken');
    const companyId = await Storage.getItem('companyId');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (companyId) {
      config.headers['X-Company-ID'] = companyId;
    }

    return config;
  },
  (error) => {
    console.error('API Client Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor for logging responses and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API No Response (Network Error):', error.message);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
