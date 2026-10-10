import {
  AccountPayload,
  AccountTemplate,
} from "@/features/accounts/types/account.types";
import { api } from "../services/api";

export const accountsApi = api
  .enhanceEndpoints({ addTagTypes: ["Assets"] })
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
        invalidatesTags: ["Assets"],
      }),
      archiveAccount: builder.mutation({
        query: (id) => ({
          url: `/assets/${id}`,
          method: "PATCH",
                    headers: {
            Accept: "application/json",
          },
        })
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
        invalidatesTags: ["Assets"],
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
