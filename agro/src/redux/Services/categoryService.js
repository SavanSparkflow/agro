import { apiInstance, clearCache } from './axiosApi';

export const categoryService = {
  getCategoryList: async (payload) => {
    const response = await apiInstance.post(`/api/category`, payload);
    return response.data;
  },

  getCategoryWOP: async (search = '') => {
    const response = await apiInstance.get(`/api/category?search=${search}`);
    return response.data;
  },

  createCategory: async (payload) => {
    const response = await apiInstance.post(`/api/category/create`, payload);
    clearCache("category");
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await apiInstance.post(`/api/category/getone`, { categoryid: id });
    clearCache("category");
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await apiInstance.post(`/api/category/delete`, { categoryid: id });
    clearCache("category");
    return response.data;
  },

  changeCategoryStatus: async (id) => {
    const response = await apiInstance.post(`/api/category/changestatus`, { categoryid: id });
    clearCache("category");
    return response.data;
  },
};
