import { apiInstance } from './axiosApi';

export const authService = {
  login: async (credentials) => {
    const response = await apiInstance.post('/auth/login', credentials);
    return response.data;
  },
  forgotPassword: async (data) => {
    const response = await apiInstance.post('/auth/forgotpassword', data);
    return response.data;
  },
  resetPassword: async (data) => {
    const response = await apiInstance.post('/auth/resetpassword', data);
    return response.data;
  },
  changePassword: async (data) => {
    const response = await apiInstance.post('/auth/changepassword', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await apiInstance.get('/auth/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await apiInstance.put('/auth/profile', data);
    return response.data;
  },
  getProfilePic: async () => {
    const response = await apiInstance.get('/auth/profilepic');
    return response.data;
  },
  logout: async () => {
    const response = await apiInstance.post('/auth/logout');
    return response.data;
  },
};
