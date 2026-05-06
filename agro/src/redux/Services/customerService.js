import { apiInstance, clearCache } from './axiosApi';

export const customerService = {
  getCustomerList: async (payload) => {
    const response = await apiInstance.post(`/api/customer`, payload);
    return response.data;
  },

  getCustomerWOP: async (search = '') => {
    const response = await apiInstance.get(`/api/customer?search=${search}`);
    return response.data;
  },

  createCustomer: async (payload) => {
    const response = await apiInstance.post(`/api/customer/create`, payload);
    clearCache("customer");
    return response.data;
  },

  getCustomerById: async (id) => {
    const response = await apiInstance.post(`/api/customer/getone`, { customerid: id });
    clearCache("customer");
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await apiInstance.post(`/api/customer/delete`, { customerid: id });
    clearCache("customer");
    return response.data;
  },

  changeCustomerStatus: async (id) => {
    const response = await apiInstance.post(`/api/customer/changestatus`, { customerid: id });
    clearCache("customer");
    return response.data;
  },

  submitFeedback: async (payload) => {
    const response = await apiInstance.post(`/api/customer/feedback`, payload);
    return response.data;
  },
};
