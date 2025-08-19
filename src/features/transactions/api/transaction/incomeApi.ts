import { api } from "@/shared/services/api";

export const incomeApi = api
  .enhanceEndpoints({ addTagTypes: ["Income", "Graph"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postIncome: builder.mutation({
        query: (body) => ({
          url: "/income",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Income", "Graph"],
      }),
      updateIncome: builder.mutation({
        query: ({ data, id }) => ({
          url: `/income/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Income", "Graph"],
      }),
      getIncome: builder.query({
        query: (params) => ({
          url: "/income",
          method: "GET",
          params,
        }),
        providesTags: ["Income"],
      }),
      deleteIncome: builder.mutation({
        query: (id) => ({
          url: `/income/${id}`,
          method: "PATCH",
        }),
      }),
      getGraphIncome: builder.query({
        query: (params) => ({
          params,
          url: "/income/graph",
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
  useLazyGetGraphIncomeQuery
} = incomeApi;
