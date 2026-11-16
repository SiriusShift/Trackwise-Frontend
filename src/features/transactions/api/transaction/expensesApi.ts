import { api } from "@/shared/services/api";

export const expensesApi = api
  .enhanceEndpoints({
    addTagTypes: [
      "Expenses",
      "Recurring",
      "Schedules",
      "Assets",
      "History",
      "Stats",
    ],
  })
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
        invalidatesTags: ["Expenses", "Schedules"],
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
        invalidatesTags: ["Expenses", "Schedules"],
      }),

      putExpense: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/expense/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: ["Expenses", "Schedules"],
      }),

      // Confirms a pending card purchase with what the bank posted. It can
      // move the purchase onto a statement, so balances and bills refresh too.
      postPendingExpense: builder.mutation<
        unknown,
        { id: number; data: { postedDate: string; amount?: number } }
      >({
        query: ({ id, data }) => ({
          url: `/transactions/expense/${id}/post`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Expenses", "Schedules", "Assets", "History", "Stats"],
      }),

      postRecurringExpense: builder.mutation({
        query: (body) => ({
          url: "/transactions/expense/recurring",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Recurring", "Expenses", "Schedules"],
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
        invalidatesTags: ["Recurring", "Schedules"],
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
        invalidatesTags: ["Expenses", "Schedules"],
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
  usePostPendingExpenseMutation,
  useGetRecurringExpensesQuery,
  usePostRecurringExpenseMutation,
  useUpdateRecurringExpenseMutation,
  useCancelRecurringExpenseMutation,
} = expensesApi;
