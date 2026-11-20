import {
  AccountPayload,
  AccountTemplate,
  ArchiveAccountPayload,
} from "@/features/accounts/types/account.types";
import { api } from "../services/api";

export const accountsApi = api
  .enhanceEndpoints({ addTagTypes: ["Assets", "Schedules", "Recurring"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAccounts: builder.query<AccountTemplate, AccountPayload | void>({
        query: (params) => ({
          url: "/assets",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          params: params ?? undefined,
        }),
        providesTags: ["Assets"],
      }),
      createAccount: builder.mutation({
        query: (body) => ({
          url: "/assets",
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body,
        }),
        invalidatesTags: ["Assets", "Schedules"],
      }),
      // Archives by default; { archived: false } unarchives.
      archiveAccount: builder.mutation<unknown, ArchiveAccountPayload>({
        query: ({ id, ...body }) => ({
          url: `/assets/${id}`,
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
          body,
        }),
        // Archiving pauses (and unarchiving resumes) its recurring items
        invalidatesTags: ["Assets", "Schedules", "Recurring"],
      }),
      updateAccount: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/assets/${id}`,
          method: "PUT",
          headers: {
            Accept: "application/json",
          },
          body,
        }),
        invalidatesTags: ["Assets", "Schedules"],
      }),
    }),
  });

export const {
  useGetAccountsQuery,
  useLazyGetAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useArchiveAccountMutation
} = accountsApi;
