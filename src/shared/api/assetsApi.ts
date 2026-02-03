import {api} from "../services/api";

export const assetsApi = api.enhanceEndpoints({ addTagTypes: ["Assets"] }).injectEndpoints({
    endpoints: (builder) => ({
        getAsset: builder.query<any, void>({
            query: (params) => ({
                url: "/asset/get",
                method: "GET",
                headers: { 
                    Accept: "application/json" 
                },
                params
            }),
            providesTags: ["Assets"],
        }),
    }),
});

export const { useGetAssetQuery, useLazyGetAssetQuery } = assetsApi