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
export const description = "Loan Payment Progress Chart";

const chartData = [
  { expenseType: "Baby", running: 45 },
  { expenseType: "Car", running: 50 },
  { expenseType: "Car", running: 50 },
  { expenseType: "Car", running: 23 },
  { expenseType: "Car", running: 60 },
];

const chartData1 = [
  { name: "Food", food: 30 }, // 30% of the total
  { name: "Bills", bills: 70 }, // 70% of the total
];

const chartConfig1 = {
  bills: {
    label: "Bills",
    color: "hsl(var(--chart-1))",
  },
  food: {
    label: "Food",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const chartConfig = {
  running: {
    label: "Expense",
    color: "hsl(var(--chart-1))", // Black color
  },
  label: {
    color: "hsl(var(--background))",
  },
  background: {
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig;
/**
 * @description Dashboard page
 * @returns A React component that displays the dashboard
 * @example
 * <Dashboard />
 */
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
            <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:grid-rows-1 lg:grid-rows-1 gap-5">
              <OverviewWidget data={data} isLoading={isFetching} />
              <ExpenseWidget data={data} isLoading={isFetching} />
              <IncomeWidget data={data} isLoading={isFetching} />
              <Card className="rounded-lg col-span-2 lg:col-span-full 2xl:col-span-1 p-5 border">
                <div className="flex justify-between items-center">
                  <h1 className="gap-3 text-xl font-semibold">Payment Due</h1>
                  <Link to={"/funds"}>See All</Link>
                </div>
                <hr className="w-full mt-3" />
                <div className="flex mt-3 rounded-md flex-col gap-5 justify-between">
                  <div className="flex w-full">
                    <div className="p-2 border rounded-md w-14 flex flex-col items-center ">
                      <p className="text-foreground text-sm">Nov</p>
                      <p className="text-foreground text-sm">13</p>
                    </div>
                    <div className="ml-3 w-full flex flex-col justify-center">
                      <div className="flex justify-between">
                        <div>
                          <h1 className="font-medium">Electric</h1>
                        </div>
                        <div>
                          <h1 className="font-medium">₱ 3,540.21</h1>
                        </div>
                      </div>
                      <p className="text-gray-400">Monthly expense</p>
                    </div>
                  </div>
                  <div className="flex w-full">
                    <div className="p-2 border rounded-md  w-14 flex flex-col items-center ">
                      <p className="text-foreground text-sm">Sep</p>
                      <p className="text-foreground text-sm">15</p>
                    </div>
                    <div className="ml-3 w-full flex flex-col justify-center">
                      <div className="flex justify-between">
                        <div>
                          <h1 className="font-medium">Water</h1>
                        </div>
                        <div>
                          <h1 className="font-medium">₱ 1,000.00</h1>
                        </div>
                      </div>
                      <p className="text-gray-400">Monthly expense</p>
                    </div>
                  </div>
                </div>
              </Card>
              {/* <CalendarWidget
                // activeDay={activeDay}
                colorTheme={theme}
                // handleClick={setActiveDay}
              /> */}
            </div>
            <div className="gap-5 space-y-5 sm:space-y-0 sm:grid-rows-2 md:grid-rows-2 xl:grid-rows-1 sm:grid grid-cols-4 xl:grid-cols-3">
              <div className="col-span-full md:col-span-2 lg:col-span-2 xl:col-span-1">
                <Card className="p-0 gap-5 h-full flex flex-col justify-between">
                  <CardHeader className="px-7 pb-0 space-y-0">
                    <div className="flex justify-between">
                      <CardTitle className="text-xl">Loan Balance</CardTitle>
                      <Link to="/loans">See All</Link>
                    </div>
                    <CardDescription className="text-lg mb-5">
                      ₱10,732,012.52 / ₱50,023,012.20
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-3">
                    <ChartContainer
                      className="h-52 2xl:h-[230px] w-full"
                      config={chartConfig}
                    >
                      <BarChart accessibilityLayer data={chartData}>
                        <XAxis
                          dataKey="expenseType"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <YAxis
                          domain={[0, 100]} // Y-axis range from 0 to 100
                          axisLine={false} // Remove the axis line
                          tick={false} // Hide the ticks
                          width={0}
                        />
                        {/* Set Y-axis range from 0 to 100 */}
                        <Bar
                          dataKey="running"
                          stackId="a"
                          className="border-0"
                          fill="var(--color-running)" // Set bar color to black
                          radius={[4, 4, 8, 8]}
                          background={{
                            fill: "var(--color-background)",
                            radius: [4, 4, 8, 8],
                          }}
                        >
                          <LabelList
                            dataKey="running"
                            position="insideBottom"
                            offset={10}
                            className="fill-[--color-label]"
                            formatter={(value) => `${value}%`}
                          />
                          {/* <LabelList
                            dataKey="expenseType"
                            position="insideBottom"
                            className="fill-[--color-label]"
                            offset={15}
                          /> */}
                        </Bar>
                        <ChartTooltip
                          content={<ChartTooltipContent indicator="line" />}
                          cursor={false}
                          defaultIndex={1}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
              <div className="col-span-full md:col-span-2 lg:col-span-2  xl:col-span-1">
                <Card className="p-0 gap-5 h-full flex flex-col">
                  <CardHeader className="px-7 pb-0 space-y-0">
                    <div className="flex justify-between">
                      <CardTitle className="text-xl">Savings Plan</CardTitle>
                      <Link to="/savings" className="z-1">
                        See All
                      </Link>
                    </div>
                    <CardDescription className="text-lg mb-5">
                      Three active savings plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-7">
                    <div className="grid gap-5 grid-rows-2 sm:grid-rows-1 grid-cols-2">
                      <div className="col-span-2 mt-3 space-y-4">
                        <Progress className="w-full rounded-sm" value={75} />
                        <div className="border-l-2 border-dashed">
                          <div className="p-3 space-x-3 sm:space-x-0 sm:space-y-3 flex items-start sm:block">
                            <div className="w-12 flex justify-center items-center h-12 rounded-md bg-gray-100">
                              <Plane className="text-black" />
                            </div>
                            <div>
                              <h1 className="text-lg font-bold">Travel</h1>
                              <p>₱ 5,392.00 / 35,200.00</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <TransactionHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
