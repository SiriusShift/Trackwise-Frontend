import { api } from "@/feature/api";

const expensesApi = api.injectEndpoints({
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
    }),
  }),
});

export const { useGetExpensesQuery, usePostExpenseMutation } = expensesApi;
