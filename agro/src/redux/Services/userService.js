import { apiInstance, clearCache } from './axiosApi';

export const userService = {
  getUserList: async (payload) => {
    const response = await apiInstance.post(`/api/users`, payload);
    return response.data;
  },

  getUserWOP: async (search = '') => {
    const response = await apiInstance.get(`/api/users?search=${search}`);
    return response.data;
  },

  createUser: async (payload) => {
    const response = await apiInstance.post(`/api/users/create`, payload);
    clearCache("users");
    return response.data;
  },

  getUserById: async (id) => {
    const response = await apiInstance.post(`/api/users/getone`, { userid: id });
    clearCache("users");
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiInstance.post(`/api/users/delete`, { userid: id });
    clearCache("users");
    return response.data;
  },

  changeUserStatus: async (id) => {
    const response = await apiInstance.post(`/api/users/changestatus`, { userid: id });
    clearCache("users");
    return response.data;
  },
};
