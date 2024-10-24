import { api } from "../../api";

interface SigninPayload {
    email: string;
    password: string;
    // You can add more fields here if needed
}

interface SigninResponse {
    message: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        username: string;
        lastName: string;
        phoneNumber: string;
        profileImage: string;
        role: string;
    };
}

const signInApi = api.injectEndpoints({
    endpoints: (builder) => ({
        postSignin: builder.mutation<SigninResponse, SigninPayload>({
            query: (payload) => ({
                url: "/sign-in",
                method: "POST",
                headers: { Accept: "application/json" },
                body: payload,
                credentials: 'include'
            }),
        }),
        postForgotPassword: builder.mutation({
            query: (payload) => ({
                url: "/aws-ses/forgot-password",
                method: "POST",
                headers: { Accept: "application/json" },
                body: payload
            })
        }),
        postResetPassword: builder.mutation({
            query: (payload) => ({
                url: "/reset-password",
                method: "POST",
                headers: { Accept: "application/json" },
                body: payload
            })
        }),
        getAuthStatus: builder.query({
            query: () => ({
                url: "/auth-status",
                method: "GET",
                headers: { Accept: "application/json" },
                credentials: 'include'
            }),
        })
    }),
});

export const { usePostSigninMutation, usePostForgotPasswordMutation, usePostResetPasswordMutation, useGetAuthStatusQuery } = signInApi;
