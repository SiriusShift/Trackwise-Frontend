import {api} from "../../api";

export const assetsApi = api.enhanceEndpoints({ addTagTypes: ["Assets"] }).injectEndpoints({
    endpoints: (builder) => ({
        getAsset: builder.query({
            query: () => ({
                url: "/asset/get",
                method: "GET",
                headers: { 
                    Accept: "application/json" 
                },
            }),
            providesTags: ["Assets"],
        }),
    }),
});

export const { useGetAssetQuery, useLazyGetAssetQuery } = assetsApi