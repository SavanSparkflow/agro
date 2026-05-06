// Axios Instance for API calls
import axios from "axios";

export const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' }
});

apiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const clearCache = (url) => {
    // Basic placeholder for cache clearing logic
    console.log(`Cache cleared for: ${url}`);
};
