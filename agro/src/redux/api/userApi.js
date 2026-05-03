import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.mutation({
      query: (params) => ({
        url: '/users',
        method: 'POST',
        body: params,
      }),
      providesTags: ['User'],
    }),
    getUserById: builder.mutation({
      query: (data) => ({
        url: '/users/getone',
        method: 'POST',
        body: data,
      }),
    }),
    createOrUpdateUser: builder.mutation({
      query: (data) => ({
        url: '/users/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (data) => ({
        url: '/users/delete',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    changeUserStatus: builder.mutation({
      query: (data) => ({
        url: '/users/changestatus',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersMutation,
  useGetUserByIdMutation,
  useCreateOrUpdateUserMutation,
  useDeleteUserMutation,
  useChangeUserStatusMutation,
} = userApi;
