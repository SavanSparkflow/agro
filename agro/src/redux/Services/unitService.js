import { apiInstance, clearCache } from './axiosApi';

export const unitService = {
  getUnitList: async (payload) => {
    const response = await apiInstance.post(`/api/unit`, payload);
    return response.data;
  },

  getUnitWOP: async (search = '') => {
    const response = await apiInstance.get(`/api/unit?search=${search}`);
    return response.data;
  },

  createUnit: async (payload) => {
    const response = await apiInstance.post(`/api/unit/create`, payload);
    clearCache("unit");
    return response.data;
  },

  getUnitById: async (id) => {
    const response = await apiInstance.post(`/api/unit/getone`, { unitid: id });
    clearCache("unit");
    return response.data;
  },

  deleteUnit: async (id) => {
    const response = await apiInstance.post(`/api/unit/delete`, { unitid: id });
    clearCache("unit");
    return response.data;
  },

  changeUnitStatus: async (id) => {
    const response = await apiInstance.post(`/api/unit/changestatus`, { unitid: id });
    clearCache("unit");
    return response.data;
  },
};
