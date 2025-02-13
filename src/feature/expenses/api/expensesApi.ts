import { api } from "@/feature/api";
import { useGetAssetQuery } from "@/feature/assets/api/assetsApi";

export const expensesApi = api
  .enhanceEndpoints({ addTagTypes: ["Expenses", "RecurringExpense"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getExpenses: builder.query({
        query: (params) => ({
          params,
          url: "/expenses/get",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        // transformResponse: (response) => response.data,
        providesTags: ["Expenses"],
      }),
      postExpense: builder.mutation({
        query: (body) => ({
          url: "/expenses/create",
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body,
        }),
        invalidatesTags: ["Expenses"],
      }),

      deleteExpense: builder.mutation({
        query: (id) => ({
          url: `/expenses/deleteExpense/${id}`,
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Expenses", "RecurringExpense"],
      }),

      patchExpense: builder.mutation({
        query: ({data, id}) => ({
          url: `/expenses/updateExpense/${id}`,
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
          body: data,
        }),
        invalidatesTags: ["Expenses", "RecurringExpense"],
      }),

      postRecurringExpense: builder.mutation({
        query: (body) => ({
          url: "/expenses/createRecurring",
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body,
        }),
        invalidatesTags: ["RecurringExpense"],
      }),

      getDetailedExpense: builder.query({
        query: (params) => ({
          params,
          url: "/expenses/getDetailedExpenses",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (response: any) => response.data,
        providesTags: ["Expenses"],
      }),

      getRecurringExpenses: builder.query({
        query: (params) => ({
          params,
          url: "/expenses/getRecurring",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["RecurringExpense"],
      }),

      getFrequency: builder.query({
        query: () => ({
          url: "/frequency/get",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (response: any) => response.data,
      }),

      postRecurringPayment : builder.mutation({
        query: ({body, id}) => ({
          url: `/expenses/postRecurringPayment/${id}`,
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body,
        }),
        invalidatesTags: ["RecurringExpense", "Expenses"],
      })
    }),
  });

export const {
  useGetExpensesQuery,
  useLazyGetRecurringExpensesQuery,
  useLazyGetExpensesQuery,
  usePostExpenseMutation,
  usePostRecurringExpenseMutation,
  useGetRecurringExpensesQuery,
  useGetDetailedExpenseQuery,
  useDeleteExpenseMutation,
  usePostRecurringPaymentMutation,
  usePatchExpenseMutation,
  useGetFrequencyQuery
} = expensesApi;
