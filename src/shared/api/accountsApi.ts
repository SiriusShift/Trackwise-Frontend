import { api } from "../services/api";

export const accountsApi = api
  .enhanceEndpoints({ addTagTypes: ["Assets"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAccounts: builder.query<any, void>({
        query: (params) => ({
          url: "/assets",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          params,
        }),
        providesTags: ["Assets"],
      }),
      createAccount: builder.mutation({
        query: (body) => ({
          url: "/assets",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          body,
        }),
      }),
      updateAccount: builder.mutation({
        query: (body) => ({
          url: "/assets",
          method: "PUT",
          headers: {
            Accept: "application/json",
          },
          body,
        }),
      }),
    }),
  });

export const {
  useGetAccountsQuery,
  useLazyGetAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
} = accountsApi;
