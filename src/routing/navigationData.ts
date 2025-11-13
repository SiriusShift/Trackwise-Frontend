import {
  LayoutGrid,
  ChartNoAxesCombined,
  HandCoins,
  Landmark,
  Settings,
  CreditCard,
  Settings2Icon,
  User,
  FolderCog,
  Palette,
  Bell,
  ShieldCheck,
  CloudUpload,
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
      { name: "General", path: "/settings/general", icon: Settings },
      { name: "Account", path: "/settings/account", icon: User },
      { name: "Category", path: "/settings/category", icon: FolderCog },
      { name: "Theme", path: "/settings/theme", icon: Palette },
      { name: "Notifications", path: "/settings/notifications", icon: Bell },
      { name: "Security", path: "/settings/security", icon: ShieldCheck },
      { name: "Backup", path: "/settings/backup", icon: CloudUpload },
      // { name: "Billing", path: "/settings/billing" }, // Optional
    ],
  },
];
