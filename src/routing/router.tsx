import AccountPage from "@/features/accounts/pages/AccountPage";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import SavingsPage from "@/features/savings/pages/SavingsPage";
import SettingsLayout from "@/features/settings/SettingsLayout";
import AccountSettings from "@/features/settings/pages/AccountSettings";
import CategorySettings from "@/features/settings/pages/CategorySettings";
import GeneralSettings from "@/features/settings/pages/GeneralSettings";
import NotificationSettings from "@/features/settings/pages/NotificationSettings";
import ThemeSettings from "@/features/settings/pages/ThemeSettings";
import CalendarPage from "@/features/transactions/pages/CalendarPage";
import TransactionPage from "@/features/transactions/pages/TransactionPage";
import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "../pages/PageNotFound";
import ProtectedRoutes from "./ProtectedRoutes";
import { publicRoutes } from "./publicRoutes";

export const router = createBrowserRouter([
  ...publicRoutes,
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/transactions",
        children: [
          {
            index: true,
            element: <TransactionPage />,
          },
        ],
      },
      {
        path: "calendar",
        element: <CalendarPage />,
      },
      {
        path: "/accounts",
        element: <AccountPage />,
      },
      {
        path: "savings",
        element: <SavingsPage />,
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
          // {
          //   path: "/settings/security",
          //   element: <SecuritySettings />,
          // },
          // {
          //   path: "/settings/backup",
          //   element: <BackupSettings />,
          // },
        ],
      },
    ],
  },
]);
