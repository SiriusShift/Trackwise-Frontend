import {
  Bell,
  Calendar,
  ChartNoAxesCombined,
  CreditCard,
  FolderCog,
  Goal,
  LayoutGrid,
  Palette,
  PiggyBank,
  Settings,
  Target,
  User,
} from "lucide-react";

export const navigationData = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  { name: "Transactions", path: "/transactions", icon: ChartNoAxesCombined },
  { name: "Accounts", path: "/accounts", icon: CreditCard },
  { name: "Calendar", path: "/calendar", icon: Calendar },
  { name: "Savings", path: "/savings", icon: Goal },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    sub: [
      { name: "General", path: "/settings/general", icon: Settings },
      { name: "Account", path: "/settings/account", icon: User },
      { name: "Category", path: "/settings/category", icon: FolderCog },
      { name: "Theme", path: "/settings/theme", icon: Palette },
      { name: "Notifications", path: "/settings/notifications", icon: Bell },
      // { name: "Security", path: "/settings/security", icon: ShieldCheck },
      // { name: "Backup", path: "/settings/backup", icon: CloudUpload },
      // { name: "Billing", path: "/settings/billing" }, // Optional
    ],
  },
];
