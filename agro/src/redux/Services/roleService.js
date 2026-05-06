import { apiInstance, clearCache } from './axiosApi';

export const roleService = {
  getRoleList: async (payload) => {
    const response = await apiInstance.post(`/api/role`, payload);
    return response.data;
  },

  getRoleWOP: async (search = '') => {
    const response = await apiInstance.get(`/api/role?search=${search}`);
    return response.data;
  },

  createRole: async (payload) => {
    const response = await apiInstance.post(`/api/role/create`, payload);
    clearCache("role");
    return response.data;
  },

  getRoleById: async (id) => {
    const response = await apiInstance.post(`/api/role/getone`, { roleid: id });
    clearCache("role");
    return response.data;
  },

  deleteRole: async (id) => {
    const response = await apiInstance.post(`/api/role/delete`, { roleid: id });
    clearCache("role");
    return response.data;
  },

  changeRoleStatus: async (id) => {
    const response = await apiInstance.post(`/api/role/changestatus`, { roleid: id });
    clearCache("role");
    return response.data;
  },
};
