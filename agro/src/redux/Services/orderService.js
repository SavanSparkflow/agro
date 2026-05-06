import { apiInstance, clearCache } from './axiosApi';

export const orderService = {
  getOrderList: async (payload) => {
    const response = await apiInstance.post(`/api/order`, payload);
    return response.data;
  },

  createOrder: async (payload) => {
    const response = await apiInstance.post(`/api/order/create`, payload);
    clearCache("order");
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await apiInstance.post(`/api/order/getone`, { orderid: id });
    clearCache("order");
    return response.data;
  },

  deleteOrder: async (id) => {
    const response = await apiInstance.post(`/api/order/delete`, { orderid: id });
    clearCache("order");
    return response.data;
  },

  changeOrderStatus: async (id) => {
    const response = await apiInstance.post(`/api/order/changestatus`, { orderid: id });
    clearCache("order");
    return response.data;
  },
};
