import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
  reducerPath: 'orderApi',
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
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrders: builder.mutation({
      query: (params) => ({
        url: '/order',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Order'],
    }),
    getOrderById: builder.mutation({
      query: (data) => ({
        url: '/order/getone',
        method: 'POST',
        body: data,
      }),
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/order/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOrder: builder.mutation({
      query: (data) => ({
        url: '/order/delete',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
    changeOrderStatus: builder.mutation({
      query: (data) => ({
        url: '/order/changestatus',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetOrdersMutation,
  useGetOrderByIdMutation,
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useChangeOrderStatusMutation,
} = orderApi;
