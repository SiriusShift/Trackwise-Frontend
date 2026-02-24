import { api } from "@/shared/services/api";

export const transferApi = api
  .enhanceEndpoints({ addTagTypes: ["Transfer", "Graph", "Recurring"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getTransfer: builder.query({
        query: (params) => ({
          url: "/transaction/transfer",
          method: "GET",
          params,
        }),
      }),
      postTransfer: builder.mutation({
        query: (body) => ({
          url: "/transaction/transfer",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Graph", "Transfer"],
      }),
      updateTransfer: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/transfer/${id}`,
          method: "PATCH",
          body: data,
        }),
      }),
      deleteTransfer: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/transfer/${id}`,
          method: "PATCH",
          body: data,
        }),
      }),

      postTransferMoney: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/income/transfer/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Transfer", "Recurring"],
      }),

      postRecurringTransfer: builder.mutation({
        query: (body) => ({
          url: "/transaction/transfer/recurring",
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body,
        }),
        invalidatesTags: ["Recurring", "Transfer", "Graph"],
      }),
      updateRecurringTransfer: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/transfer/recurring/${id}`,
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
          body: data,
        }),
        invalidatesTags: ["Recurring", "Transfer", "Graph"],
      }),

      getRecurringTransfer: builder.query({
        query: (params) => ({
          params,
          url: "/transaction/transfer/recurring",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Transfer"],
      }),

      deleteRecurringTransfer: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/transfer/recurring/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Transfer"],
      }),
      getGraphTransfer: builder.query({
        query: (params) => ({
          url: "/transaction/transfer/graph",
          method: "GET",
          params,
        }),
        transformResponse: (response) => response.data
      }),
    }),
  });

export const {
  useGetTransferQuery,
  usePostTransferMutation,
  useDeleteTransferMutation,
  useUpdateTransferMutation,
  useGetRecurringTransferQuery,
  useUpdateRecurringTransferMutation,
  useDeleteRecurringTransferMutation,
  usePostRecurringTransferMutation,
  useGetGraphTransferQuery,
  usePostTransferMoneyMutation
} = transferApi;
