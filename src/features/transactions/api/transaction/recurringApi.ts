import { api } from "@/shared/services/api";
import { Schedule } from "@/shared/types";

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
          method: "PUT",
          headers: {
            Accept: "application/json",
          },
          body: data,
        }),
        invalidatesTags: ["Recurring"],
      }),

      getRecurring: builder.query<Schedule[], string | void>({
        query: (type) => ({
          url: "/transactions/recurring",
          method: "GET",
          ...(type && { params: { type } }),
        }),
        transformResponse: (response: { data: Schedule[] }) => response.data,
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
