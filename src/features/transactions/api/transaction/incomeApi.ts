import { api } from "@/shared/services/api";

export const incomeApi = api
  .enhanceEndpoints({ addTagTypes: ["Income", "Recurring", "Schedules"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postIncome: builder.mutation({
        query: (body) => ({
          url: "/transactions/income",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Income", "Schedules"],
      }),
      putIncome: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/income/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: ["Income", "Schedules"],
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
        invalidatesTags: ["Income", "Schedules"],
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
        invalidatesTags: ["Recurring", "Income", "Schedules"],
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
        invalidatesTags: ["Recurring", "Income", "Schedules"],
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
        invalidatesTags: ["Income", "Schedules"],
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

      cancelRecurringIncome: builder.mutation({
        query: (id) => ({
          url: `/transactions/income/recurring/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Income", "Schedules"],
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
  useCancelRecurringIncomeMutation
} = incomeApi;
