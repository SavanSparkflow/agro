import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
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
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.mutation({
      query: (params) => ({
        url: '/category',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Category'],
    }),
    getCategoryById: builder.mutation({
      query: (data) => ({
        url: '/category/getone',
        method: 'POST',
        body: data,
      }),
    }),
    createOrUpdateCategory: builder.mutation({
      query: (data) => ({
        url: '/category/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (data) => ({
        url: '/category/delete',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    changeCategoryStatus: builder.mutation({
      query: (data) => ({
        url: '/category/changestatus',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    searchCategories: builder.query({
      query: (search) => `/category?search=${search}`,
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesMutation,
  useGetCategoryByIdMutation,
  useCreateOrUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useChangeCategoryStatusMutation,
  useSearchCategoriesQuery,
} = categoryApi;
