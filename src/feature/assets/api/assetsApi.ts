import {api} from "../../api";

const assetsApi = api.enhanceEndpoints({ addTagTypes: ["Assets"] }).injectEndpoints({
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
            transformResponse: (response: any) => response.data
        }),
    }),
});

export const { useGetAssetQuery } = assetsApi