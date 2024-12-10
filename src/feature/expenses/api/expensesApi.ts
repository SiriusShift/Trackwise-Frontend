import { api } from "@/feature/api";

const expensesApi = api.enhanceEndpoints({ addTagTypes: ["Expenses"] }).injectEndpoints({
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
      transformResponse: (response) => response.data,
      providesTags: ["Expenses"],
    }),
    postExpense: builder.mutation({
      query: (payload) => ({
        url: "/expenses/create",
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: payload,
      }),
      invalidatesTags: ["Expenses"],
    }),
  }),
});

export const { useGetExpensesQuery, usePostExpenseMutation } = expensesApi;
