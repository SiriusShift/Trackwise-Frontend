import { api } from "@/shared/services/api";
import { useGetAssetQuery } from "@/shared/api/assetsApi";

export const expensesApi = api
  .enhanceEndpoints({ addTagTypes: ["Expenses"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getExpenses: builder.query({
        query: (params) => ({
          params,
          url: "/expense",
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
          url: "/expense",
          method: "POST",
          // headers: {
          //   "Content-type": "multipart/form-data",
          // },
          body,
        }),
        invalidatesTags: ["Expenses"],
      }),

      deleteExpense: builder.mutation({
        query: (id) => ({
          url: `/expense/${id}`,
          method: "PATCH",
          // headers: {
          //   Accept: "application/json",
          // },
        }),
        invalidatesTags: ["Expenses"],
      }),

      patchExpense: builder.mutation({
        query: ({ data, id }) => ({
          url: `/expense/${id}`,
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
          body: data,
        }),
        invalidatesTags: ["Expenses"],
      }),

      // postRecurringExpense: builder.mutation({
      //   query: (body) => ({
      //     url: "/transaction/createRecurring",
      //     method: "POST",
      //     headers: {
      //       Accept: "application/json",
      //     },
      //     body,
      //   }),
      //   invalidatesTags: ["RecurringExpense"],
      // }),

      // updateRecurringExpense: builder.mutation({
      //   query: ({data, id}) => ({
      //     url: `/transaction/updateRecurring/${id}`,
      //     method: "PATCH",
      //     headers: {
      //       Accept: "application/json",
      //     },
      //     body: data,
      //   }),
      //   invalidatesTags: ["RecurringExpense"],
      // }),

      getGraphExpense: builder.query({
        query: (params) => ({
          params,
          url: "/expense/graph",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (response: any) => response.data,
        providesTags: ["Expenses"],
      }),

      // getRecurringExpenses: builder.query({
      //   query: (params) => ({
      //     params,
      //     url: "/transaction/getRecurring",
      //     method: "GET",
      //     headers: {
      //       Accept: "application/json",
      //     },
      //   }),
      //   providesTags: ["RecurringExpense"],
      // }),

      // postRecurringPayment: builder.mutation({
      //   query: ({ body, id }) => ({
      //     url: `/transaction/postRecurringPayment/${id}`,
      //     method: "POST",
      //     headers: {
      //       Accept: "application/json",
      //     },
      //     body,
      //   }),
      //   invalidatesTags: ["RecurringExpense", "Expenses"],
      // }),
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
} = expensesApi;
