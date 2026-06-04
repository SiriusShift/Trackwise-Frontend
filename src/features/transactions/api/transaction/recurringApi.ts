import { api } from "@/shared/services/api";
import { useGetAssetQuery } from "@/shared/api/assetsApi";

export const expensesApi = api
  .enhanceEndpoints({ addTagTypes: ["Recurring"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postRecurring: builder.mutation({
        query: (body) => ({
          url: "/transactions/recurring",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Recurring"],
      }),

      updateRecurring: builder.mutation({
        query: ({ data, id }) => ({
          url: `/transactions/recurring/${id}`,
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
          body: data,
        }),
        invalidatesTags: ["Recurring"],
      }),

      getRecurring: builder.query({
        query: (params) => ({
          params,
          url: "/transactions/recurring",
          method: "GET",
        }),
        transformResponse: (response) => response.data,
        providesTags: ["Recurring"],
      }),

      cancelRecurring: builder.mutation({
        query: (id) => ({
          url: `/transactions/recurring/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Recurring"],
      }),
    }),
  });

export const {
  useGetRecurringQuery,
  usePostRecurringMutation,
  useUpdateRecurringMutation,
  useCancelRecurringMutation,
} = expensesApi;
