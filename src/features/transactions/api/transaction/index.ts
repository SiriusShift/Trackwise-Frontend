import { api } from "@/shared/services/api";

export const transactionApi = api
  .enhanceEndpoints({ addTagTypes: ["History"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getTransactionHistory: builder.query({
        query: () => ({
          url: "/transaction/history",
          method: "GET",
        }),
        providesTags: ["History"],
      }),
    }),
  });

export const { useGetTransactionHistoryQuery } = transactionApi;
