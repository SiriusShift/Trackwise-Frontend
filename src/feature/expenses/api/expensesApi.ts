import { api } from "@/feature/api";
import { get } from "http";

const expensesApi = api
  .enhanceEndpoints({ addTagTypes: ["Expenses", "RecurringExpense", "Assets"] })
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
        invalidatesTags: ["Expenses", "Assets"],
      }),

      deleteExpense: builder.mutation({
        query: (id) => ({
          url: `/expenses/deleteExpense/${id}`,
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Expenses", "Assets"],
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

      //ASSETS
      getAsset: builder.query({
        query: () => ({
          url: "/asset/get",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Assets"],
        transformResponse: (response: any) => response.data,
      }),
    }),
  });

export const {
  useGetExpensesQuery,
  useLazyGetRecurringExpensesQuery,
  useLazyGetExpensesQuery,
  usePostExpenseMutation,
  usePostRecurringExpenseMutation,
  useGetRecurringExpensesQuery,
  useGetAssetQuery,
  useLazyGetDetailedExpenseQuery,
  useDeleteExpenseMutation,
} = expensesApi;
