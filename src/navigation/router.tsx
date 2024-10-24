import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "../pages/PageNotFound";
import SignupPage from "../pages/SignupPage";
import SigninPage from "../pages/SigninPage";
import ForgotPassword from "@/pages/ForgotPassword";
import ProtectedRoutes from "./ProtectedRoutes";
import Dashboard from "../pages/Dashboard";
import ResetPassword from "@/pages/ResetPassword";
import WalletPage from "@/pages/WalletPage";
import LoanPage from "@/pages/LoanPage";
import SavingsPage from "@/pages/SavingsPage";
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
                path: "/wallet",
                element: <WalletPage />
            },
            {
                path: "/loan",
                element: <LoanPage />
            },
            {
                path: "/savings",
                element: <SavingsPage />
            },{
                path: "/settings",
                element: <Settings />
            }
        ]
    }
]);