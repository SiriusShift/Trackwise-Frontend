import { api } from "../../api";

export const categoryApi = api.enhanceEndpoints({ addTagTypes: ["Category", "CategoryLimit"] }).injectEndpoints({
    endpoints: (builder) => ({
        postCategory: builder.mutation({
            query: (payload) => ({
                url: "/category/create",
                method: "POST",
                headers: { 
                    Accept: "application/json" 
                },
                body: payload,
            }),
            invalidatesTags: ["Category"],
        }),
        getCategory: builder.query({
            query: (params) => ({
                url: "/category/get",
                method: "GET",
                headers: { 
                    Accept: "application/json" 
                },
                params,
            }),
            transformResponse: (response) => response.data
        }),
        getCategoryLimit: builder.query({
            query: (params) => ({
                url: "/category/getAllExpenseCategoryLimit",
                method: "GET",
                headers: { 
                    Accept: "application/json" 
                },
                params,
            }),
            providesTags: ["CategoryLimit"],
            transformResponse: (response) => response.data
        }),
        postCategoryLimit: builder.mutation({
            query: (payload) => ({
                url: "/category/postLimit",
                method: "POST",
                headers: { 
                    Accept: "application/json" 
                },
                body: payload,
            }),
            invalidatesTags: ["CategoryLimit"], 
        }),
        patchCategoryLimit: builder.mutation({
            query: ({amount, id}) => ({
                url: `/category/patchLimit/${id}`,
                method: "PATCH",
                headers: { 
                    Accept: "application/json" 
                },
                body: amount
            }),
            invalidatesTags: ["CategoryLimit"],
        })
    }),
});

export const { usePostCategoryMutation, useGetCategoryQuery, usePatchCategoryLimitMutation, usePostCategoryLimitMutation, useGetCategoryLimitQuery } = categoryApi;
