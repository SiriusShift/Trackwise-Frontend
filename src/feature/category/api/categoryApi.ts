import { api } from "../../api";

const categoryApi = api.injectEndpoints({
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
    }),
});

export const { usePostCategoryMutation, useGetCategoryQuery } = categoryApi;
