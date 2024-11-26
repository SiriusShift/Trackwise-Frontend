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
                credentials: 'include',  // This ensures the cookie is included in the request
            }),
        }),
        getCategory: builder.query({
            query: () => ({
                url: "/category/get",
                method: "GET",
                headers: { 
                    Accept: "application/json" 
                },
                credentials: 'include',  // This ensures the cookie is included in the request
            }),
        }),
    }),
});

export const { usePostCategoryMutation, useGetCategoryQuery } = categoryApi;
