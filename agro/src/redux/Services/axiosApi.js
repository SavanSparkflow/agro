// Axios Instance for API calls
import axios from "axios";
import toast from "react-hot-toast";

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

apiInstance.interceptors.response.use(
    (response) => {
        // If the backend returns IsSuccess: false but Status: 200 (common in some APIs)
        if (response.data && response.data.IsSuccess === false) {
            toast.error(response.data.Message || "Something went wrong");
        }
        return response;
    },
    (error) => {
        const message = error.response?.data?.Message || error.message || "An unexpected error occurred";
        toast.error(message);
        
        if (error.response?.status === 401) {
            // Handle unauthorized access (e.g., clear token and redirect to login)
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export const clearCache = (url) => {
    // Basic placeholder for cache clearing logic
    console.log(`Cache cleared for: ${url}`);
};
