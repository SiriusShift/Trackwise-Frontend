import { api } from "@/shared/services/api";
import { CreditStatementOption } from "@/shared/types";

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
      getMoneyFlow: builder.query({
        query: ({ from, to, format }) => ({
          url: "/reports/money-flow",
          params: { from, to, format },
          responseHandler: (response) =>
            format === "json" ? response.json() : response.blob(),
        }),
      }),
      getCreditStatementList: builder.query<CreditStatementOption[], number>({
        query: (assetId) => ({
          url: "/reports/credit-statements",
          params: { assetId },
        }),
        transformResponse: (response: { data: CreditStatementOption[] }) =>
          response.data,
      }),
      getCreditCardStatement: builder.query({
        query: ({ statementId, format }) => ({
          url: "/reports/credit-statement",
          params: { statementId, format },
          responseHandler: (response) =>
            format === "json" ? response.json() : response.blob(),
        }),
      }),
    }),
  });

export const {
  useGetTransactionStatementQuery,
  useLazyGetTransactionStatementQuery,
  useGetMoneyFlowQuery,
  useLazyGetMoneyFlowQuery,
  useGetCreditStatementListQuery,
  useLazyGetCreditCardStatementQuery,
} = reportsApi;
