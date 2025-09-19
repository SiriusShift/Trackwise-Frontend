import { api } from "@/shared/services/api";
import { useGetAssetQuery } from "@/shared/api/assetsApi";

export const expensesApi = api
  .enhanceEndpoints({ addTagTypes: ["Expenses", "Recurring"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getExpenses: builder.query({
        query: (params) => ({
          params,
          url: "/transaction/expense",
          method: "GET",
        }),
        // transformResponse: (response) => response.data,
        providesTags: () => ["Expenses"],
      }),
      postExpense: builder.mutation({
        query: (body) => ({
          url: "/transaction/expense",
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
          url: `/transaction/expense/${id}`,
          method: "PATCH",
          body: data,
          // headers: {
          //   Accept: "application/json",
          // },
        }),
        invalidatesTags: ["Expenses"],
      }),

      patchExpense: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/expense/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Expenses"],
      }),

      postRecurringExpense: builder.mutation({
        query: (body) => ({
          url: "/transaction/expense/recurring",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Recurring", "Expenses"],
      }),

      updateRecurringExpense: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/expense/recurring/${id}`,
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
          url: "/transaction/expense/recurring",
          method: "GET",
        }),
        providesTags: ["Recurring"],
      }),

      deleteRecurringExpense: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/expense/recurring/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Expenses"],
      }),

      patchPayment: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/expense/pay/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Recurring", "Expenses"],
      }),

      getGraphExpense: builder.query({
        query: (params) => ({
          params,
          url: "/transaction/expense/graph",
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
  usePatchExpenseMutation,
  useGetRecurringExpensesQuery,
  usePostRecurringExpenseMutation,
  useUpdateRecurringExpenseMutation,
  useDeleteRecurringExpenseMutation,
  usePatchPaymentMutation
} = expensesApi;
