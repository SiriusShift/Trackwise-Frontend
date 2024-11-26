import {
  LayoutGrid,
  Activity,
  HandCoins,
  Landmark,
  Settings,
} from "lucide-react";

export const navigationData = [
  { name: "Dashboard", path: "/", icon: LayoutGrid },
  { name: "Cash Flow", path: "/funds", icon: Activity },
  { name: "Loan", path: "/loans", icon: HandCoins },
  { name: "Assets", path: "/savings", icon: Landmark },
  { name: "Settings", path: "/settings", icon: Settings },
];
