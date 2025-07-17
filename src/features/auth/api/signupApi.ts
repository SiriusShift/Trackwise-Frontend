import { api } from "../../../shared/services/api";

// Define the type for the payload that will be sent in the mutation
interface VerifyEmailPayload {
    email: Array<string>;
    username: string;
    // You can add more fields here if needed
}

// Define the type for the expected response
interface SignupResponse {
    success: boolean;
    message: string;
    data: {
        userId: string;
        email: string;
    };
}
interface VerifyResponse {
    success: boolean;
    message: string;
}

interface SignupPayload{
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    otp: string
}

const signUpApi = api.injectEndpoints({
    endpoints: (builder) => ({
        postVerify: builder.mutation<VerifyResponse, VerifyEmailPayload>({
            query: (payload) => ({
                url: "/aws-ses/email-code", // Endpoint URL
                method: "POST", // HTTP method
                headers: { Accept: "application/json" }, // Request headers
                body: payload, // The payload that will be sent
            }),
        }),
        postSignup: builder.mutation<SignupResponse, SignupPayload>({
            query: (payload) => ({
                url: "/sign-up",
                method: "POST",
                headers: { Accept: "application/json" },
                body: payload,
                credentials: 'include'
            }),
            // Ensure transformResponse returns the correct type
            // transformResponse: (response: SignupResponse) => {
            //     return response.data; // Return only the `data` field
            // },
        }),
    }),
    overrideExisting: false,
});

// Export the hook for the postVerify mutation
export const { usePostVerifyMutation, usePostSignupMutation } = signUpApi;