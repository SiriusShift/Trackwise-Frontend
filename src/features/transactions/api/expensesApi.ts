import { api } from "@/shared/services/api";
import { useGetAssetQuery } from "@/shared/api/assetsApi";

export const expensesApi = api
  .enhanceEndpoints({ addTagTypes: ["Expenses"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getExpenses: builder.query({
        query: (params) => ({
          params,
          url: "/transaction/getExpense",
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
          url: "/transaction/createExpense",
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
          url: `/transaction/deleteExpense/${id}`,
          method: "PATCH",
          // headers: {
          //   Accept: "application/json",
          // },
        }),
        invalidatesTags: ["Expenses", "RecurringExpense"],
      }),

      patchExpense: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/updateExpense/${id}`,
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
          body: data,
        }),
        invalidatesTags: ["Expenses", "RecurringExpense"],
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

      getDetailedExpense: builder.query({
        query: (params) => ({
          params,
          url: "/transaction/getDetailedExpenses",
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
  useLazyGetRecurringExpensesQuery,
  useLazyGetExpensesQuery,
  usePostExpenseMutation,
  usePostRecurringExpenseMutation,
  useUpdateRecurringExpenseMutation,
  useGetRecurringExpensesQuery,
  useGetDetailedExpenseQuery,
  useDeleteExpenseMutation,
  usePostRecurringPaymentMutation,
  usePatchExpenseMutation,
  useGetFrequencyQuery,
} = expensesApi;
