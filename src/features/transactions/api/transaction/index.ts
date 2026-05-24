import { api } from "@/shared/services/api";

export const transactionApi = api
  .enhanceEndpoints({ addTagTypes: ["History", "Stats"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getTransactionHistory: builder.query({
        query: (params) => ({
          url: "/transactions/history",
          method: "GET",
          params,
        }),
        transformResponse: (response) => response.data,
        providesTags: ["History"],
      }),
      updateTransactionHistory: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/edit/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["History", "Stats"],
      }),
      deleteTransactionHistory: builder.mutation({
        query: (id) => ({
          url: `/transactions/delete/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["History", "Stats"],
      }),
      getStatistics: builder.query({
        query: (params) => ({
          url: `/transactions/statistics`,
          method: "GET",
          params,
        }),
        providesTags: ["Stats"],
      }),
      archiveTransaction: builder.mutation({
        query: ({ id, data }) => ({
          url: `/transactions/${id}`,
          method: "PATCH",
          params: data,
        }),
        invalidatesTags: ["Stats", "History"],
      }),
      dueTransactions: builder.query({
        query: () => ({
          url: "/transactions/due",
          method: "GET",
        }),
        transformResponse: (response: any) => response.data,
      }),
    }),
  });

export const {
  useGetTransactionHistoryQuery,
  useUpdateTransactionHistoryMutation,
  useDeleteTransactionHistoryMutation,
  useGetStatisticsQuery,
  useArchiveTransactionMutation,
  useDueTransactionsQuery
} = transactionApi;
