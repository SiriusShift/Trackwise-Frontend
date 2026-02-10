import { api } from "@/shared/services/api";

export const incomeApi = api
  .enhanceEndpoints({ addTagTypes: ["Income", "Recurring"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postIncome: builder.mutation({
        query: (body) => ({
          url: "/transaction/income",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Income"],
      }),
      updateIncome: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/income/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Income"],
      }),
      getIncome: builder.query({
        query: (params) => ({
          url: "/transaction/income",
          method: "GET",
          params,
        }),
        providesTags: ["Income"],
      }),
      deleteIncome: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/income/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Income"]
      }),
      postRecurringIncome: builder.mutation({
        query: (body) => ({
          url: "/transaction/income/recurring",
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body,
        }),
      }),
      updateRecurringIncome: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/income/recurring/${id}`,
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
          body: data,
        }),
        invalidatesTags: ["Recurring", "Income"],
      }),

      getRecurringIncome: builder.query({
        query: (params) => ({
          params,
          url: "/transaction/income/recurring",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Recurring"],
      }),

      deleteRecurringIncome: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/income/recurring/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Income"],
      }),

      getGraphIncome: builder.query({
        query: (params) => ({
          params,
          url: "/transaction/income/graph",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (response: any) => response.data,
        providesTags: ["Income"],
      }),

      postReceive: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/income/receive/${id}`,
          method: "PATCH",
          body: data,
        }),
      }),

      postAutoReceive: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/income/receive/auto/${id}`,
          method: "POST",
          body: data,
        }),
      }),
    }),
  });

export const {
  useLazyGetIncomeQuery,
  useUpdateIncomeMutation,
  usePostIncomeMutation,
  useDeleteIncomeMutation,
  useGetGraphIncomeQuery,
  useGetIncomeQuery,
  useLazyGetGraphIncomeQuery,
  useGetRecurringIncomeQuery,
  usePostRecurringIncomeMutation,
  useUpdateRecurringIncomeMutation,
  useDeleteRecurringIncomeMutation,
  usePostAutoReceiveMutation,
  usePostReceiveMutation
} = incomeApi;
