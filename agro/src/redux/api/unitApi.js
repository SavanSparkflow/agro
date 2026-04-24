import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const unitApi = createApi({
  reducerPath: 'unitApi',
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
  tagTypes: ['Unit'],
  endpoints: (builder) => ({
    getUnits: builder.mutation({
      query: (params) => ({
        url: '/unit',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Unit'],
    }),
    getUnitById: builder.mutation({
      query: (data) => ({
        url: '/unit/getone',
        method: 'POST',
        body: data,
      }),
    }),
    createOrUpdateUnit: builder.mutation({
      query: (data) => ({
        url: '/unit/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Unit'],
    }),
    deleteUnit: builder.mutation({
      query: (data) => ({
        url: '/unit/delete',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Unit'],
    }),
    changeUnitStatus: builder.mutation({
      query: (data) => ({
        url: '/unit/changestatus',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Unit'],
    }),
    searchUnits: builder.query({
      query: (search) => `/unit?search=${search}`,
      providesTags: ['Unit'],
    }),
  }),
});

export const {
  useGetUnitsMutation,
  useGetUnitByIdMutation,
  useCreateOrUpdateUnitMutation,
  useDeleteUnitMutation,
  useChangeUnitStatusMutation,
  useSearchUnitsQuery,
} = unitApi;
