import { apiInstance } from './axiosApi';

export const authService = {
  login: async (credentials) => {
    const response = await apiInstance.post('/api/auth/login', credentials);
    return response.data;
  },
  forgotPassword: async (data) => {
    const response = await apiInstance.post('/api/auth/forgotpassword', data);
    return response.data;
  },
  resetPassword: async (data) => {
    const response = await apiInstance.post('/api/auth/resetpassword', data);
    return response.data;
  },
  changePassword: async (data) => {
    const response = await apiInstance.post('/api/auth/changepassword', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await apiInstance.get('/api/auth/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await apiInstance.put('/api/auth/profile', data);
    return response.data;
  },
  getProfilePic: async () => {
    const response = await apiInstance.get('/api/auth/profilepic');
    return response.data;
  },
  updateProfilePic: async (formData) => {
    const response = await apiInstance.post('/api/auth/profilepic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  logout: async () => {
    const response = await apiInstance.post('/api/auth/logout');
    return response.data;
  },
};
