import { api } from "@/shared/services/api";
import {
  CreditStatementDetail,
  RecurringScheduleDetail,
  ScheduledItem,
  ScheduleHistoryEntry,
  ScheduleSource,
  ScheduleType,
} from "@/shared/types";

export interface GetSchedulesParams {
  dateFrom?: string;
  dateTo?: string;
  type?: ScheduleType;
  source?: ScheduleSource;
  // Only items that need the user to pay/skip them
  actionable?: boolean;
}

export interface PaySchedulePayload {
  amount: number;
  date: string;
  account?: number;
  category?: number;
  description?: string;
}

// Paying or skipping changes balances, transaction lists and the schedule itself.
const AFTER_PAYMENT_TAGS = [
  "Schedules",
  "Recurring",
  "Expenses",
  "Income",
  "Transfer",
  "Assets",
  "History",
  "Stats",
] as const;

export const schedulesApi = api
  .enhanceEndpoints({ addTagTypes: [...AFTER_PAYMENT_TAGS] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSchedules: builder.query<ScheduledItem[], GetSchedulesParams>({
        query: (params) => ({
          url: "/transactions/schedules",
          method: "GET",
          params,
        }),
        transformResponse: (response: { data: ScheduledItem[] }) =>
          response.data,
        providesTags: ["Schedules"],
      }),

      getRecurringSchedule: builder.query<RecurringScheduleDetail, number>({
        query: (id) => ({
          url: `/transactions/schedules/recurring/${id}`,
          method: "GET",
        }),
        transformResponse: (response: { data: RecurringScheduleDetail }) =>
          response.data,
        providesTags: ["Schedules"],
      }),

      getRecurringScheduleHistory: builder.query<ScheduleHistoryEntry[], number>(
        {
          query: (id) => ({
            url: `/transactions/schedules/recurring/${id}/history`,
            method: "GET",
          }),
          transformResponse: (response: { data: ScheduleHistoryEntry[] }) =>
            response.data,
          providesTags: ["Schedules"],
        },
      ),

      payRecurringSchedule: builder.mutation<
        unknown,
        { id: number; data: PaySchedulePayload }
      >({
        query: ({ id, data }) => ({
          url: `/transactions/schedules/recurring/${id}/pay`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: [...AFTER_PAYMENT_TAGS],
      }),

      skipRecurringSchedule: builder.mutation<unknown, number>({
        query: (id) => ({
          url: `/transactions/schedules/recurring/${id}/skip`,
          method: "PATCH",
        }),
        invalidatesTags: [...AFTER_PAYMENT_TAGS],
      }),

      getCreditStatement: builder.query<CreditStatementDetail, number>({
        query: (id) => ({
          url: `/transactions/schedules/credit/${id}`,
          method: "GET",
        }),
        transformResponse: (response: { data: CreditStatementDetail }) =>
          response.data,
        providesTags: ["Schedules"],
      }),

      payCreditStatement: builder.mutation<
        unknown,
        { id: number; data: PaySchedulePayload }
      >({
        query: ({ id, data }) => ({
          url: `/transactions/schedules/credit/${id}/pay`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: [...AFTER_PAYMENT_TAGS],
      }),
    }),
  });

export const {
  useGetSchedulesQuery,
  useLazyGetSchedulesQuery,
  useGetRecurringScheduleQuery,
  useGetRecurringScheduleHistoryQuery,
  usePayRecurringScheduleMutation,
  useSkipRecurringScheduleMutation,
  useGetCreditStatementQuery,
  usePayCreditStatementMutation,
} = schedulesApi;
