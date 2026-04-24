import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const permissionApi = createApi({
  reducerPath: 'permissionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Permission'],
  endpoints: (builder) => ({
    getPermissions: builder.mutation({
      query: (params) => ({
        url: '/permissions',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Permission'],
    }),
    getPermissionById: builder.mutation({
      query: (data) => ({
        url: '/permission/getone',
        method: 'POST',
        body: data,
      }),
    }),
    createOrUpdatePermission: builder.mutation({
      query: (data) => ({
        url: '/permission/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Permission'],
    }),
  }),
});

export const {
  useGetPermissionsMutation,
  useGetPermissionByIdMutation,
  useCreateOrUpdatePermissionMutation,
} = permissionApi;
