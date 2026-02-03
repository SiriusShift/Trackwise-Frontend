import { api } from "@/shared/services/api";

export const transactionApi = api
  .enhanceEndpoints({ addTagTypes: ["History"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getTransactionHistory: builder.query({
        query: (params) => ({
          url: "/transaction/history",
          method: "GET",
          params,
        }),
        providesTags: ["History"],
      }),
      updateTransactionHistory: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/edit/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["History"],
      }),
      deleteTransactionHistory: builder.mutation({
        query: (id) => ({
          url: `/transaction/delete/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["History"],
      }),
      getStatistics: builder.query({
        query: (params) => ({
          url: `/transaction/statistics`,
          method: "GET",
          params
        }),
      }),
    }),
  });

export const {
  useGetTransactionHistoryQuery,
  useUpdateTransactionHistoryMutation,
  useDeleteTransactionHistoryMutation,
  useGetStatisticsQuery
} = transactionApi;
