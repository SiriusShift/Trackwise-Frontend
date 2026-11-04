import { api } from "@/shared/services/api";
import {
  GoalContributionsTemplate,
  GoalPayload,
  GoalTransferDirection,
  GoalTransferPayload,
  SavingsGoalTemplate,
  SavingsPayload,
  SavingsTemplate,
} from "../types/savings.types";

// Contributing or withdrawing is a transfer, so balances and transaction
// lists change along with the goal.
const AFTER_GOAL_TRANSFER_TAGS = [
  "Savings",
  "Transfer",
  "Assets",
  "History",
  "Stats",
  "CategoryLimit",
] as const;

export const savingsApi = api
  .enhanceEndpoints({ addTagTypes: [...AFTER_GOAL_TRANSFER_TAGS] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSavings: builder.query<SavingsTemplate, SavingsPayload>({
        query: (params) => ({
          url: "/savings-goals",
          method: "GET",
          params,
        }),
        providesTags: ["Savings"],
      }),
      // Latest transfers tagged with a goal, newest first
      getGoalContributions: builder.query<
        GoalContributionsTemplate,
        { id: number; limit?: number }
      >({
        query: ({ id, limit }) => ({
          url: `/savings-goals/${id}/contributions`,
          method: "GET",
          params: { limit },
        }),
        // Same tag as the list, so a new contribution refreshes both
        providesTags: ["Savings"],
      }),
      createGoal: builder.mutation<SavingsGoalTemplate, GoalPayload>({
        query: (data) => ({
          url: "/savings-goals",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Savings"],
      }),
      // Also archives (isActive: false) and restores (isActive: true)
      updateGoal: builder.mutation<
        SavingsGoalTemplate,
        { id: number; data: Partial<GoalPayload> & { isActive?: boolean } }
      >({
        query: ({ id, data }) => ({
          url: `/savings-goals/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Savings"],
      }),
      // Tagged transfers stay but lose their goal, so transfer lists refresh too
      deleteGoal: builder.mutation<unknown, number>({
        query: (id) => ({
          url: `/savings-goals/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Savings", "Transfer"],
      }),
      goalTransfer: builder.mutation<
        unknown,
        {
          id: number;
          direction: GoalTransferDirection;
          data: GoalTransferPayload;
        }
      >({
        query: ({ id, direction, data }) => ({
          url: `/savings-goals/${id}/${direction}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: [...AFTER_GOAL_TRANSFER_TAGS],
      }),
    }),
  });

export const {
  useGetSavingsQuery,
  useGetGoalContributionsQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useGoalTransferMutation,
} = savingsApi;
