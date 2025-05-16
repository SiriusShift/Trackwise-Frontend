import {
  LayoutGrid,
  ChartNoAxesCombined,
  HandCoins,
  Landmark,
  Settings,
} from "lucide-react";



export const navigationData = [
  { name: "Dashboard", path: "/", icon: LayoutGrid },
  { name: "Transactions", path: "/transactions", icon: ChartNoAxesCombined },
  { name: "Assets", path: "/savings", icon: Landmark },
  { name: "Loan", path: "/loans", icon: HandCoins },
  { name: "Settings", path: "/settings", icon: Settings },
];
