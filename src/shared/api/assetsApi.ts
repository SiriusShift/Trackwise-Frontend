import {api} from "../services/api";

export const assetsApi = api.enhanceEndpoints({ addTagTypes: ["Assets"] }).injectEndpoints({
    endpoints: (builder) => ({
        getAsset: builder.query<any, void>({
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