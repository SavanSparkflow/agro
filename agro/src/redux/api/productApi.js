import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
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
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.mutation({
      query: (params) => ({
        url: '/product',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.mutation({
      query: (data) => ({
        url: '/product/getone',
        method: 'POST',
        body: data,
      }),
    }),
    createOrUpdateProduct: builder.mutation({
      query: (data) => ({
        url: '/product/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (data) => ({
        url: '/product/delete',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    changeProductStatus: builder.mutation({
      query: (data) => ({
        url: '/product/changestatus',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: '/product/upload',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProductsMutation,
  useGetProductByIdMutation,
  useCreateOrUpdateProductMutation,
  useDeleteProductMutation,
  useChangeProductStatusMutation,
  useUploadProductImageMutation,
} = productApi;
