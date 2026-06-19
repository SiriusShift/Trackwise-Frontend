import { api } from "@/shared/services/api";

export const expensesApi = api
  .enhanceEndpoints({ addTagTypes: ["Expenses", "Recurring"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getExpenses: builder.query({
        query: (params) => ({
          params,
          url: "/transactions/expense",
          method: "GET",
        }),
        // transformResponse: (response) => response.data,
        providesTags: () => ["Expenses"],
      }),
      postExpense: builder.mutation({
        query: (body) => ({
          url: "/transactions/expense",
          method: "POST",
          // headers: {
          //   "Content-type": "multipart/form-data",
          // },
          body,
        }),
        invalidatesTags: ["Expenses"],
      }),

      deleteExpense: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/expense/${id}`,
          method: "PATCH",
          body: data,
          // headers: {
          //   Accept: "application/json",
          // },
        }),
        invalidatesTags: ["Expenses"],
      }),

      putExpense: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/expense/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Expenses"],
      }),

      postRecurringExpense: builder.mutation({
        query: (body) => ({
          url: "/transactions/expense/recurring",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Recurring", "Expenses"],
      }),

      updateRecurringExpense: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/expense/recurring/${id}`,
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
          body: data,
        }),
        invalidatesTags: ["Recurring", "Expenses"],
      }),

      getRecurringExpenses: builder.query({
        query: (params) => ({
          params,
          url: "/transactions/expense/recurring",
          method: "GET",
        }),
        providesTags: ["Recurring"],
      }),

      cancelRecurringExpense: builder.mutation({
        query: (id) => ({
          url: `/transactions/expense/recurring/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Expenses"],
      }),

      postPayment: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/expense/pay/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Recurring", "Expenses"],
      }),

      getGraphExpense: builder.query({
        query: (params) => ({
          params,
          url: "/transactions/expense/graph",
          method: "GET",
        }),
        transformResponse: (response: any) => response.data,
        providesTags: ["Expenses"],
      }),

      postAutoPayment: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/expense/pay/auto/${id}`,
          method: "POST",
          body: data,
        }),
      }),

      getBills: builder.query({
        query: () => ({
          url: "/transactions/expense/bills",
          method: "GET",
        }),
        transformResponse: (response: any) => response.data,
        providesTags: ["Expenses"],
      }),
    }),
  });

export const {
  useGetExpensesQuery,
  useLazyGetExpensesQuery,
  usePostExpenseMutation,
  useGetGraphExpenseQuery,
  useLazyGetGraphExpenseQuery,
  useDeleteExpenseMutation,
  usePutExpenseMutation,
  useGetRecurringExpensesQuery,
  usePostRecurringExpenseMutation,
  useUpdateRecurringExpenseMutation,
  useCancelRecurringExpenseMutation,
  usePostPaymentMutation,
  usePostAutoPaymentMutation,
  useGetBillsQuery,
} = expensesApi;
