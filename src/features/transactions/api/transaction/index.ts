import { api } from "@/shared/services/api";

export const transactionApi = api
  .enhanceEndpoints({ addTagTypes: ["History", "Stats", "Schedules"] })
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
      // Account + category of the latest entry of a type, for prefilling the add form.
      getLastEntry: builder.query({
        query: (type: string) => ({
          url: "/transactions/last",
          method: "GET",
          params: { type: type.toLowerCase() },
        }),
        transformResponse: (response: any) => response.data,
      }),
      archiveTransaction: builder.mutation({
        query: ({ id, data }) => ({
          url: `/transactions/${id}`,
          method: "PATCH",
          params: data,
        }),
        invalidatesTags: ["Stats", "History", "Schedules"],
      }),
    }),
  });

export const {
  useGetTransactionHistoryQuery,
  useGetStatisticsQuery,
  useGetLastEntryQuery,
  useArchiveTransactionMutation,
} = transactionApi;
