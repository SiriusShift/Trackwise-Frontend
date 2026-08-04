import SavingsPage from "@/features/accounts/pages/AccountPage";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import ResetPassword from "@/features/auth/pages/ResetPassword";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import SettingsLayout from "@/features/settings/SettingsLayout";
import AccountSettings from "@/features/settings/pages/AccountSettings";
import BackupSettings from "@/features/settings/pages/BackupSettings";
import CategorySettings from "@/features/settings/pages/CategorySettings";
import GeneralSettings from "@/features/settings/pages/GeneralSettings";
import NotificationSettings from "@/features/settings/pages/NotificationSettings";
import SecuritySettings from "@/features/settings/pages/SecuritySettings";
import ThemeSettings from "@/features/settings/pages/ThemeSettings";
import CalendarPage from "@/features/transactions/pages/CalendarPage";
import TransactionPage from "@/features/transactions/pages/TransactionPage";
import LoanPage from "@/pages/LoanPage";
import { createBrowserRouter } from "react-router-dom";
import SigninPage from "../features/auth/pages/SigninPage";
import SignupPage from "../features/auth/pages/SignupPage";
import PageNotFound from "../pages/PageNotFound";
import ProtectedRoutes from "./ProtectedRoutes";

export const router = createBrowserRouter([
  {
    path: "/sign-up",
    element: <SignupPage />,
  },
  {
    path: "*",
    element: <PageNotFound />,
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
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/transactions",
        children: [
          {
            index: true,
            element: <TransactionPage />,
          },
          {
            path: "schedules",
            element: <CalendarPage />,
          },
        ],
      },
      {
        path: "/accounts",
        element: <SavingsPage />,
      },
      {
        path: "/loans",
        element: <LoanPage />,
      },
      {
        path: "/settings",
        element: <SettingsLayout />,
        children: [
          {
            path: "/settings/general",
            element: <GeneralSettings />,
          },
          {
            path: "/settings/account",
            element: <AccountSettings />,
          },
          {
            path: "/settings/category",
            element: <CategorySettings />,
          },
          {
            path: "/settings/theme",
            element: <ThemeSettings />,
          },
          {
            path: "/settings/notifications",
            element: <NotificationSettings />,
          },
          {
            path: "/settings/security",
            element: <SecuritySettings />,
          },
          {
            path: "/settings/backup",
            element: <BackupSettings />,
          },
        ],
      },
    ],
  },
]);
