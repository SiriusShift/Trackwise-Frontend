import { api } from "@/shared/services/api";

export const categoryApi = api
  .enhanceEndpoints({ addTagTypes: ["Category", "CategoryLimit"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postCategory: builder.mutation({
        query: (payload) => ({
          url: "/categories",
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: payload,
        }),
        invalidatesTags: ["Category"],
      }),
      getCategory: builder.query({
        query: (params) => ({
          url: "/categories",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          params,
        }),
        transformResponse: (response) => response.data,
      }),
      getCategoryLimit: builder.query({
        query: (params) => ({
          url: "/categories/limits",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          params,
        }),
        providesTags: ["CategoryLimit"],
        transformResponse: (response) => response.data,
      }),
      postCategoryLimit: builder.mutation({
        query: (payload) => ({
          url: "/categories/limits",
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: payload,
        }),
        invalidatesTags: ["CategoryLimit"],
      }),
      patchCategoryLimit: builder.mutation({
        query: ({ amount, id }) => ({
          url: `/categories/limits/${id}`,
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
          body: amount,
        }),
        invalidatesTags: ["CategoryLimit"],
      }),

      deleteCategoryLimit: builder.mutation({
        query: (id) => ({
          url: `/categories/limits/${id}`,
          method: "PUT",
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["CategoryLimit"],
      }),
    }),
  });

export const {
  usePostCategoryMutation,
  useGetCategoryQuery,
  usePatchCategoryLimitMutation,
  usePostCategoryLimitMutation,
  useGetCategoryLimitQuery,
  useDeleteCategoryLimitMutation,
} = categoryApi;
