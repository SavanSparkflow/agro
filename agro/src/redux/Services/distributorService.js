import { apiInstance, clearCache } from './axiosApi';

export const distributorService = {
  getDistributorList: async (payload) => {
    const response = await apiInstance.post(`/api/distributor`, payload);
    return response.data;
  },

  getDistributorWOP: async (search = '') => {
    const response = await apiInstance.get(`/api/distributor?search=${search}`);
    return response.data;
  },

  createDistributor: async (payload) => {
    const response = await apiInstance.post(`/api/distributor/create`, payload);
    clearCache("distributor");
    return response.data;
  },

  getDistributorById: async (id) => {
    const response = await apiInstance.post(`/api/distributor/getone`, { distributorid: id });
    clearCache("distributor");
    return response.data;
  },

  deleteDistributor: async (id) => {
    const response = await apiInstance.post(`/api/distributor/delete`, { distributorid: id });
    clearCache("distributor");
    return response.data;
  },

  changeDistributorStatus: async (id) => {
    const response = await apiInstance.post(`/api/distributor/changestatus`, { distributorid: id });
    clearCache("distributor");
    return response.data;
  },
};
