import SigninPage from "@/features/auth/pages/SigninPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import LandingPage from "@/features/landing/pages/LandingPage";
import type { RouteObject } from "react-router-dom";
// ...other public page imports
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import ResetPassword from "@/features/auth/pages/ResetPassword";
import PrivacyPolicyPage from "@/features/legal/pages/PrivacyPolicyPage";
import TermsPage from "@/features/legal/pages/TermsPage";
import DefaultBranding from "./DefaultBranding";

export const publicRoutes: RouteObject[] = [
  {
    element: <DefaultBranding />,
    children: [
      {
        path: "/sign-up",
        element: <SignupPage />,
      },
      {
        path: "/sign-in",
        element: <SigninPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "/terms",
        element: <TermsPage />,
      },
      {
        path: "/",
        element: <LandingPage />,
      },
    ],
  },
];

export const prerenderPaths = [
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/privacy",
  "/terms",
];
