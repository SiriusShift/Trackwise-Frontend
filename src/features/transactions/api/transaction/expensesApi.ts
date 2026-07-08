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
        invalidatesTags: ["Recurring"],
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

      getGraphExpense: builder.query({
        query: (params) => ({
          params,
          url: "/transactions/expense/graph",
          method: "GET",
        }),
        transformResponse: (response: any) => response.data,
        providesTags: ["Expenses"],
      }),

      // postAutoPayment: builder.mutation({
      //   query: ({ data, id }) => ({
      //     url: `/transactions/expense/pay/auto/${id}`,
      //     method: "POST",
      //     body: data,
      //   }),
      // }),

      getBills: builder.query({
        query: (params) => ({
          url: "/transactions/expense/bills",
          method: "GET",
          params,
        }),
        transformResponse: (response: any) => response.data,
        providesTags: ["Recurring"],
      }),

      getBill: builder.query({
        query: (id) => ({
          url: `/transactions/expense/bills/${id}`,
          method: "GET",
        }),
        transformResponse: (response: any) => response.data,
        providesTags: ["Recurring"],
      }),

      getBillPayments: builder.query({
        query: (id) => ({
          url: `/transactions/expense/bills/${id}/history`,
          method: "GET",
        }),
        transformResponse: (response: any) => response.data,
        providesTags: ["Recurring"],
      }),

      postPayment: builder.mutation({
        query: ({ id, data }) => ({
          url: `/transactions/expense/bills/${id}/pay`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Recurring", "Expenses"],
      }),

      skipPayment: builder.mutation({
        query: (id) => ({
          url: `/transactions/expense/bills/${id}/skip`,
          method: "PATCH",
        }),
        invalidatesTags: ["Recurring", "Expenses"],
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
  // usePostAutoPaymentMutation,
  useGetBillsQuery,
  useLazyGetBillsQuery,
  useGetBillQuery,
  useLazyGetBillQuery,
  useGetBillPaymentsQuery,
  useLazyGetBillPaymentsQuery,
  useSkipPaymentMutation,
} = expensesApi;
