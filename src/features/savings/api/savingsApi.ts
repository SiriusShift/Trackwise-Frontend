import { api } from "@/shared/services/api";
import { SavingsPayload, SavingsTemplate } from "../types/savings.types";

export const savingsApi = api.enhanceEndpoints({addTagTypes: ["Savings"]}).injectEndpoints({
    endpoints: (builder) => ({
        getSavings: builder.query<SavingsTemplate, SavingsPayload>({
            query: (params) => ({
                url: "/savings-goals",
                method: "GET",
                params
            }),
            providesTags: ["Savings"]
        })
    })
})

export const {useGetSavingsQuery} = savingsApi