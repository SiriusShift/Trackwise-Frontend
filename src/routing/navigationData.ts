import {
  LayoutGrid,
  ChartNoAxesCombined,
  HandCoins,
  Landmark,
  Settings,
  CreditCard,
} from "lucide-react";

export const navigationData = [
  { name: "Dashboard", path: "/", icon: LayoutGrid },
  { name: "Transactions", path: "/transactions", icon: ChartNoAxesCombined },
  { name: "Accounts", path: "/accounts", icon: CreditCard },
  { name: "Loan", path: "/loans", icon: HandCoins },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    sub: [
      { name: "General", path: "/settings" },
      { name: "Account", path: "/settings/account" },
      { name: "Category", path: "/settings/category" },
      { name: "Theme", path: "/settings/theme" },
      { name: "Notifications", path: "/settings/notifications" },
      { name: "Security", path: "/settings/security" },
      { name: "Backup", path: "/settings/backup" },
      // { name: "Billing", path: "/settings/billing" }, // Optional
    ],
  },
];
