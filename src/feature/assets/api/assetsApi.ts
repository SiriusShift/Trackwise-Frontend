import {api} from "../../api";

const assetsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAsset: builder.query({
            query: () => ({
                url: "/asset/get",
                method: "GET",
                headers: { 
                    Accept: "application/json" 
                },
            }),
            transformResponse: (response: any) => response.data
        }),
    }),
});

export const { useGetAssetQuery } = assetsApi