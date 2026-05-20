import { api } from "@/shared/services/api";

export const incomeApi = api
  .enhanceEndpoints({ addTagTypes: ["Income", "Recurring"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postIncome: builder.mutation({
        query: (body) => ({
          url: "/transactions/income",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Income"],
      }),
      putIncome: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/income/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: ["Income"],
      }),
      getIncome: builder.query({
        query: (params) => ({
          url: "/transactions/income",
          method: "GET",
          params,
        }),
        providesTags: ["Income"],
      }),
      deleteIncome: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/income/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Income"],
      }),
      postRecurringIncome: builder.mutation({
        query: (body) => ({
          url: "/transactions/income/recurring",
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body,
        }),
      }),
      updateRecurringIncome: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/income/recurring/${id}`,
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
          url: "/transactions/income/recurring",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Recurring"],
      }),

      deleteRecurringIncome: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/income/recurring/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Income"],
      }),

      getGraphIncome: builder.query({
        query: (params) => ({
          params,
          url: "/transactions/income/graph",
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
          url: `/transactions/income/receive/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Income", "Recurring"],
      }),

      postAutoReceive: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/income/receive/auto/${id}`,
          method: "POST",
          body: data,
        }),
      }),

      cancelRecurringIncome: builder.mutation({
        query: (id) => ({
          url: `/transactions/income/recurring/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Income"],
      }),
    }),
  });

export const {
  useLazyGetIncomeQuery,
  usePutIncomeMutation,
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
  usePostReceiveMutation,
  useCancelRecurringIncomeMutation
} = incomeApi;
