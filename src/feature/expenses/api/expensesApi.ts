import { api } from "@/feature/api";

const expensesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getExpenses: builder.query({
            query: () => ({
                url: "/expenses/get",
                method: "GET",
                headers: { 
                    Accept: "application/json" 
                },
            }),
            transformResponse: (response: any) => response.data
        }),
        postExpense: builder.mutation({
            query: (payload) => ({
                url: "/expenses/create",
                method: "POST",
                headers: { 
                    Accept: "application/json" 
                },
                body: payload,
            }),
        }),
    }),
})

export const { useLazyGetExpensesQuery, usePostExpenseMutation } = expensesApi