import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { useEffect, useState } from "react";
import { Plane } from "lucide-react";
import * as Icons from "lucide-react";

import CalendarWidget from "@/components/page-components/dashboard/CalendarWidget";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { useTheme } from "@/shared/provider/ThemeProvider";
import { Progress } from "@/shared/components/ui/progress";
import { Link, useLocation } from "react-router-dom";
import { navigationData } from "@/routing/navigationData";
import MonthPicker from "@/shared/components/datePicker";
import OverviewWidget from "@/features/dashboard/components/widgets/OverviewWidget";
import LimitWidget from "@/features/dashboard/components/widgets/LimitWidget";
import TransactionHistory from "@/features/dashboard/components/widgets/TransactionHistory";
import ExpenseWidget from "../components/widgets/ExpenseWidget";
import IncomeWidget from "../components/widgets/IncomeWidget";
import { useGetAssetQuery } from "@/shared/api/assetsApi";
import PageHeader from "@/shared/components/PageHeader";
import { formatMode } from "@/shared/utils/CustomFunctions";
import { useSelector } from "react-redux";
import { IRootState } from "@/app/store";
import { useGetStatisticsQuery } from "@/features/transactions/api/transaction";
import DueCalendar from "../components/widgets/DueCalendar";
import SavingsPlan from "../components/widgets/SavingsWidget";
import LoanBalance from "../components/widgets/LoanWidget";
export const description = "Loan Payment Progress Chart";

const Dashboard = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const active = useSelector((state: IRootState) => state.active.active);
  const mode = useSelector((state: IRootState) => state.active.mode);

  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname,
  );

  const { data, isFetching } = useGetStatisticsQuery({
    startDate: active.from,
    endDate: active.to,
    mode: formatMode(mode),
  });

  // const totalVisitors = chartData1[0].bills + chartData1[0].food;

  return (
    <div className="space-y-5 p-5">
      <PageHeader
        pageName={currentPageName?.name}
        description={`Overview of Dashboard for this ${formatMode()}`}
      />
      <div className="flex flex-col 2xl:flex-row gap-5">
        <div className="gap-5 flex 2xl:w-full flex-col 2xl:flex-row">
          <div className="flex w-full flex-col gap-5">
            <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:grid-rows-1 lg:grid-rows-1 gap-5 ">
              <OverviewWidget data={data} isLoading={isFetching} />
              <ExpenseWidget data={data} isLoading={isFetching} />
              <IncomeWidget data={data} isLoading={isFetching} />
              <DueCalendar />
            </div>
            <div className="gap-5 space-y-5 sm:space-y-0 sm:grid-rows-2 md:grid-rows-2 xl:grid-rows-1 sm:grid grid-cols-4 xl:grid-cols-3">
              <LoanBalance />
              <SavingsPlan />
              <TransactionHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
