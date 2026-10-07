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
    }),
  });

export const {
  useGetTransactionHistoryQuery,
  useGetStatisticsQuery,
  useArchiveTransactionMutation,
} = transactionApi;
