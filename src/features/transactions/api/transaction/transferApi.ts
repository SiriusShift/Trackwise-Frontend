import { api } from "@/shared/services/api";

export const transferApi  = api.enhanceEndpoints({addTagTypes: ["Transfer", "Graph"]}).injectEndpoints({
    endpoints: (builder) => ({
        getTransfer: builder.query({
            query: (params) => ({
                url: "/transaction/transfer",
                method: "GET",
                params
            })
        }),
        postTransfer: builder.mutation({
            query: (body) => ({
                url: "/transaction/transfer",
                method: "POST",
                body
            }),
            invalidatesTags: ["Graph", "Transfer"]
        }),
        updateTransfer: builder.mutation({
            query: ({data, id}) => ({
                url: `/transaction/transfer/${id}`,
                method: "PATCH",
                body: data
            })
        }),
        deleteTransfer: builder.mutation({
            query: ({data, id}) => ({
                url: `/transaction/transfer/${id}`,
                method: "PATCH",
                body: data
            })
        }),
        getGraphTransfer: builder.query({
            query: (params) => ({
                url: "/transaction/transfer/graph",
                method: "GET",
                params
            })
        })
    })
})

export const {useGetTransferQuery, usePostTransferMutation, useDeleteTransferMutation, useUpdateTransferMutation, useGetGraphTransferQuery} = transferApi