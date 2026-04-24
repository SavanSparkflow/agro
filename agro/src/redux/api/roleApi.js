import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const roleApi = createApi({
  reducerPath: 'roleApi',
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
  tagTypes: ['Role'],
  endpoints: (builder) => ({
    getRoles: builder.mutation({
      query: (params) => ({
        url: '/role',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Role'],
    }),
    getRoleById: builder.mutation({
      query: (data) => ({
        url: '/role/getone',
        method: 'POST',
        body: data,
      }),
    }),
    createOrUpdateRole: builder.mutation({
      query: (data) => ({
        url: '/role/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),
    deleteRole: builder.mutation({
      query: (data) => ({
        url: '/role/delete',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),
    changeRoleStatus: builder.mutation({
      query: (data) => ({
        url: '/role/changestatus',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),
    searchRoles: builder.query({
      query: (search) => `/role?search=${search}`,
      providesTags: ['Role'],
    }),
  }),
});

export const {
  useGetRolesMutation,
  useGetRoleByIdMutation,
  useCreateOrUpdateRoleMutation,
  useDeleteRoleMutation,
  useChangeRoleStatusMutation,
  useSearchRolesQuery,
} = roleApi;
