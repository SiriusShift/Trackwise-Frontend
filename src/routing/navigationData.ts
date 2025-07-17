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
  { name: "Settings", path: "/settings", icon: Settings },
];