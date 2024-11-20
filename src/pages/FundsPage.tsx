import React from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { navigationData } from "@/navigation/navigationData";
import { useLocation } from "react-router-dom";
import MonthPicker from "@/components/datePicker";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const WalletPage = () => {
  const location = useLocation();
  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname
  );
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div>
          <p className="text-xl">{currentPageName?.name}</p>
          <p className="text-gray-400">
            This is your overview of expenses and incomes for this month
          </p>
        </div>
        <div>
          <MonthPicker />
        </div>
      </div>
      <div>
        
      </div>
    </div>
  );
};

export default WalletPage;
