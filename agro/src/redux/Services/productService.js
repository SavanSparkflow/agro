import { apiInstance, clearCache } from './axiosApi';

export const productService = {
  getProductList: async (payload) => {
    const response = await apiInstance.post(`/api/product`, payload);
    return response.data;
  },

  getProductWOP: async (search = '') => {
    const response = await apiInstance.get(`/api/product?search=${search}`);
    return response.data;
  },

  createProduct: async (payload) => {
    const response = await apiInstance.post(`/api/product/create`, payload);
    clearCache("product");
    return response.data;
  },

  getProductById: async (id) => {
    const response = await apiInstance.post(`/api/product/getone`, { productid: id });
    clearCache("product");
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiInstance.post(`/api/product/delete`, { productid: id });
    clearCache("product");
    return response.data;
  },

  changeProductStatus: async (id) => {
    const response = await apiInstance.post(`/api/product/changestatus`, { productid: id });
    clearCache("product");
    return response.data;
  },

  uploadProductImage: async (formData) => {
    const response = await apiInstance.post(`/api/product/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
};
