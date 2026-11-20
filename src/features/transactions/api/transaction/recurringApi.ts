import { api } from "@/shared/services/api";
import { RecurringStatus, Schedule, ScheduleType } from "@/shared/types";

export interface GetRecurringParams {
  type?: ScheduleType | string;
  status?: RecurringStatus | "ALL";
}

export const expensesApi = api
  .enhanceEndpoints({ addTagTypes: ["Recurring", "Schedules"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postRecurring: builder.mutation({
        query: (body) => ({
          url: "/transactions/recurring",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Recurring", "Schedules"],
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
        invalidatesTags: ["Recurring", "Schedules"],
      }),

      // A bare string is the type (kept for the widgets). `status` defaults to
      // ACTIVE on the server; pass "ALL" to get paused and ended ones too.
      getRecurring: builder.query<Schedule[], string | GetRecurringParams | void>(
        {
          query: (arg) => {
            const params: GetRecurringParams =
              typeof arg === "string" ? { type: arg } : (arg ?? {});
            return {
              url: "/transactions/recurring",
              method: "GET",
              params: Object.fromEntries(
                Object.entries(params).filter(([, value]) => value),
              ),
            };
          },
          transformResponse: (response: { data: Schedule[] }) => response.data,
          providesTags: ["Recurring"],
        },
      ),

      cancelRecurring: builder.mutation({
        query: (id) => ({
          url: `/transactions/recurring/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Recurring", "Schedules"],
      }),

      pauseRecurring: builder.mutation<unknown, number>({
        query: (id) => ({
          url: `/transactions/recurring/${id}/pause`,
          method: "PATCH",
        }),
        invalidatesTags: ["Recurring", "Schedules"],
      }),

      resumeRecurring: builder.mutation<unknown, number>({
        query: (id) => ({
          url: `/transactions/recurring/${id}/resume`,
          method: "PATCH",
        }),
        invalidatesTags: ["Recurring", "Schedules"],
      }),
    }),
  });

export const {
  useGetRecurringQuery,
  usePostRecurringMutation,
  useUpdateRecurringMutation,
  useCancelRecurringMutation,
  usePauseRecurringMutation,
  useResumeRecurringMutation,
} = expensesApi;
