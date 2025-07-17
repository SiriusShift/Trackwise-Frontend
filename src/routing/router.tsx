import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "../pages/PageNotFound";
import SignupPage from "../features/auth/pages/SignupPage";
import SigninPage from "../features/auth/pages/SigninPage";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import ProtectedRoutes from "./ProtectedRoutes";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import ResetPassword from "@/features/auth/pages/ResetPassword";
import Expense from "@/pages/TransactionPage";
import LoanPage from "@/pages/LoanPage";
import SavingsPage from "@/pages/AccountPage";
import Settings from "@/pages/Settings";

export const router = createBrowserRouter([
    {
        path: "/sign-up",
        element: <SignupPage />,
    },
    {
        path: "*",
        element: <PageNotFound />
    },
    {
        path: "/sign-in",
        element: <SigninPage />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />
    },
    {
        path: "/reset-password",
        element: <ResetPassword />
    },
    {
        path: "/",
        element: <ProtectedRoutes />,
        children: [
            {
                path: "/",
                element: <Dashboard />
            },
            {
                path: "/transactions",
                element: <Expense />
            },
            {
                path: "/accounts",
                element: <SavingsPage />
            },
            {
                path: "/loans",
                element: <LoanPage />
            },
            {
                path: "/settings",
                element: <Settings />
            }
        ]
    }
]);