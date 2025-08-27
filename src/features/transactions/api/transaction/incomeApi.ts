import { api } from "@/shared/services/api";

export const incomeApi = api
  .enhanceEndpoints({ addTagTypes: ["Income", "Graph"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postIncome: builder.mutation({
        query: (body) => ({
          url: "/transaction/income",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Income", "Graph"],
      }),
      updateIncome: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transaction/income/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Income", "Graph"],
      }),
      getIncome: builder.query({
        query: (params) => ({
          url: "/transaction/income",
          method: "GET",
          params,
        }),
        providesTags: ["Income"],
      }),
      deleteIncome: builder.mutation({
        query: ({data, id}) => ({
          url: `/transaction/income/${id}`,
          method: "PATCH",
          body: data,
        }),
      }),
      getGraphIncome: builder.query({
        query: (params) => ({
          params,
          url: "/transaction/income/graph",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (response: any) => response.data,
        providesTags: ["Graph"],
      }),
    }),
  });

export const {
  useLazyGetIncomeQuery,
  useUpdateIncomeMutation,
  usePostIncomeMutation,
  useDeleteIncomeMutation,
  useGetGraphIncomeQuery,
  useGetIncomeQuery,
  useLazyGetGraphIncomeQuery
} = incomeApi;
