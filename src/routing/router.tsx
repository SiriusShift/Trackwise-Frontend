import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "../pages/PageNotFound";
import SignupPage from "../features/auth/pages/SignupPage";
import SigninPage from "../features/auth/pages/SigninPage";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import ProtectedRoutes from "./ProtectedRoutes";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import ResetPassword from "@/features/auth/pages/ResetPassword";
import TransactionPage from "@/features/transactions/pages/TransactionPage";
import LoanPage from "@/pages/LoanPage";
import SavingsPage from "@/pages/AccountPage";
import Settings from "@/pages/Settings";
import SettingsLayout from "@/features/settings/SettingsLayout";
import GeneralSettings from "@/features/settings/pages/GeneralSettings";
import AccountSettings from "@/features/settings/pages/AccountSettings";
import CategorySettings from "@/features/settings/pages/CategorySettings";
import ThemeSettings from "@/features/settings/pages/ThemeSettings";
import NotificationSettings from "@/features/settings/pages/NotificationSettings";
import SecuritySettings from "@/features/settings/pages/SecuritySettings";
import BackupSettings from "@/features/settings/pages/BackupSettings";

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
                element: <TransactionPage />
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
                element: <SettingsLayout />,
                children: [
                    {
                        path: "/settings/general",
                        element: <GeneralSettings />
                    },
                    {
                        path: "/settings/account",
                        element: <AccountSettings />
                    },
                    {
                        path: "/settings/category",
                        element: <CategorySettings/>
                    },
                    {
                        path: "/settings/theme",
                        element: <ThemeSettings />
                    },
                    {
                        path: "/settings/notifications",
                        element: <NotificationSettings />
                    },
                    {
                        path: "/settings/security",
                        element: <SecuritySettings />
                    },
                    {
                        path: "/settings/backup",
                        element: <BackupSettings />
                    }
                ]
            }
        ]
    }
]);