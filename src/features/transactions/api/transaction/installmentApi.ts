import { api } from "@/shared/services/api";

export const installmentApi = api.enhanceEndpoints({addTagTypes: ["Installment"]}).injectEndpoints({
    endpoints: (builder) => ({
        getInstallments: builder.query({
            query: (params) => ({
                url: "/transaction/getInstallment",
                method: "GET",
                params
            }),
            providesTags: ["Installment"]
        }),
        postInstallment: builder.mutation({
            query: (body) => ({
                url: "/transaction/createInstallment",
                method: "POST",
                body
            })
        }),
        patchInstallment: builder.mutation({
            query: (body) => ({
                url: "/transaction/updateInstallment",
                method: "POST",
                body
            })
        })
    })
})

export const {useGetInstallmentsQuery, useLazyGetInstallmentsQuery, usePostInstallmentMutation, usePatchInstallmentMutation} = installmentApi