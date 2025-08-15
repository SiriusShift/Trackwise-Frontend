import { api } from "@/shared/services/api";

export const incomeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    postIncome: builder.mutation({
      query: (body) => ({
        url: "/income",
        method: "POST",
        body,
      }),
    }),
    updateIncome: builder.mutation({
      query: ({ body, id }) => ({
        url: `/income/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    getIncome: builder.query({
      query: (params) => ({
        url: "/income",
        method: "POST",
        params,
      }),
    }),
    deleteIncome: builder.mutation({
      query: (id) => ({
        url: `/income/${id}`,
        method: "PATCH",
      }),
    }),
  }),
});
