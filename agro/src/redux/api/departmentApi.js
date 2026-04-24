import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const departmentApi = createApi({
  reducerPath: 'departmentApi',
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
  tagTypes: ['Department'],
  endpoints: (builder) => ({
    getDepartments: builder.mutation({
      query: (params) => ({
        url: '/department',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Department'],
    }),
    getDepartmentById: builder.mutation({
      query: (data) => ({
        url: '/department/getone',
        method: 'POST',
        body: data,
      }),
    }),
    createOrUpdateDepartment: builder.mutation({
      query: (data) => ({
        url: '/department/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Department'],
    }),
    deleteDepartment: builder.mutation({
      query: (data) => ({
        url: '/department/delete',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Department'],
    }),
    changeDepartmentStatus: builder.mutation({
      query: (data) => ({
        url: '/department/changestatus',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Department'],
    }),
    uploadIcon: builder.mutation({
      query: (data) => ({
        url: '/department/uploadicon',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetDepartmentsMutation,
  useGetDepartmentByIdMutation,
  useCreateOrUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useChangeDepartmentStatusMutation,
  useUploadIconMutation,
} = departmentApi;
