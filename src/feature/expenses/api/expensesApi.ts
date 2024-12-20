import { api } from "@/feature/api";
import { get } from "http";

const expensesApi = api.enhanceEndpoints({ addTagTypes: ["Expenses", "RecurringExpense", "Assets"] }).injectEndpoints({
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
              Accept: "application/json" 
          },
      }),
      providesTags: ["Assets"],
      transformResponse: (response: any) => response.data
  }),
  }),
});

export const { useGetExpensesQuery, useLazyGetExpensesQuery, usePostExpenseMutation, usePostRecurringExpenseMutation, useGetRecurringExpensesQuery, useGetAssetQuery } = expensesApi;
