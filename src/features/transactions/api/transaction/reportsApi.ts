import { api } from "@/shared/services/api";

export const reportsApi = api
  .enhanceEndpoints({
    addTagTypes: ["Reports"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // reportsApi.js
      getTransactionStatement: builder.query({
        query: ({ assetId, from, to, format }) => ({
          url: "/reports/statement",
          params: { assetId, from, to, format },
          responseHandler: (response) =>
            format === "pdf" || format === "json"
              ? response.json()
              : response.blob(), // csv/excel come back as blobs
        }),
      }),
    }),
  });

export const {
  useGetTransactionStatementQuery,
  useLazyGetTransactionStatementQuery,
} = reportsApi;
