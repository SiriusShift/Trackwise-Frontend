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
        invalidatesTags: ["History"]
      }),
    }),
  });

export const { useGetTransactionHistoryQuery, useUpdateTransactionHistoryMutation } = transactionApi;
