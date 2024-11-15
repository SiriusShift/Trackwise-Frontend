import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import React from "react";
import {
  Calendar as CalendarIcon,
  UtensilsCrossed,
  Banknote,
  Plane,
  Bus,
  Smartphone,
  ArrowUpFromLine,
  ArrowDownFromLine,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import CalendarWidget from "@/components/CalendarWidget";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTheme } from "@/components/theme-provider";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
export const description = "Loan Payment Progress Chart";

const chartData = [
  { expenseType: "Baby", running: 45 },
  { expenseType: "Car", running: 50 },
  { expenseType: "Car", running: 50 },
  { expenseType: "Car", running: 23 },
  { expenseType: "Car", running: 60 },
];

const chartConfig = {
  running: {
    label: "Expense",
    color: "hsl(var(--chart-1))", // Black color
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;
const Dashboard = () => {
  const [activeDay, setActiveDay] = React.useState();
  const { theme } = useTheme();

  return (
    <>
      <svg width="0" height="0">
        <defs>
          <pattern
            id="stripePattern"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect width="10" height="20" fill="hsl(var(--chart-1))" />
            <rect x="10" width="10" height="20" fill="hsl(var(--chart-2))" />
          </pattern>
        </defs>
      </svg>
      <div className="flex flex-col 2xl:flex-row gap-5">
        <div className="gap-5 flex 2xl:w-4/5 flex-col 2xl:flex-row">
          <div className="flex w-full flex-col gap-5">
            <div className="grid grid-cols-4 xl:grid-cols-3 md:grid-rows-1 lg:grid-rows-1 gap-5">
              <Card className="border p-5 flex flex-col rounded-lg col-span-full md:col-span-2 xl:col-span-1 h-60 ">
                <CardHeader className="flex p-0 flex-row justify-between">
                  <CardTitle className="text-xl">Overview</CardTitle>
                  <CardDescription className="text-sm text-gray-400">
                    September 2024
                  </CardDescription>
                </CardHeader>
                <hr className="my-2 mb-4" />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400">Balance</p>
                    <h1 className="text-3xl">₱10,732.52</h1>
                  </div>
                  <div className="w-12 h-12 rounded-md flex justify-center items-center border-2 border-gray-100 ">
                    <Banknote />
                  </div>
                </div>
                <div className="flex gap-1 mt-5">
                  <p>Compare to last month</p>
                  <p className="text-green-500">+6.52%</p>
                </div>
                <p className="text-gray-400">September 01 - September 30</p>
              </Card>
              <Card className="border p-5 flex flex-col rounded-lg col-span-full md:col-span-2 xl:col-span-1 h-60 ">
                <CardHeader className="flex p-0 flex-row justify-between">
                  <CardTitle className="text-xl">Calendar</CardTitle>
                  <CardDescription className="text-sm text-gray-400">
                    September 2024
                  </CardDescription>
                </CardHeader>
                <hr className="my-2 mb-4"/>
                <div className="space-y-3">
                <div className="flex gap-2 justify-around">
                  <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-md flex  justify-center items-center bg-gray-100">
                      <ArrowUpFromLine className="text-black"/>
                    </div>
                    <div>
                      <p>Income</p>
                      <p className="text-green-500">+6.52%</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-md flex  justify-center items-center bg-gray-100">
                      <ArrowDownFromLine className="text-black"/>
                    </div>
                    <div>
                      <p>Expense</p>
                      <p className="text-red-500">+6.52%</p>
                    </div>
                  </div>
                </div>
                <CalendarWidget colorTheme={theme} handleClick={setActiveDay}/>
                </div>

              </Card>
              <Card className="border rounded-lg col-span-full md:col-span-4 xl:col-span-1 h-60 "></Card>
            </div>
            <div className="gap-5 grid-rows-2 md:grid-rows-1 grid grid-cols-4">
              <div className="col-span-full md:col-span-2">
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
                          background={{ fill: "#eee", radius: [4, 4, 8, 8] }}
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
              <div className="col-span-full md:col-span-2">
                <Card className="p-0 gap-5 h-full flex flex-col justify-between">
                  <CardHeader className="px-7 pb-0 space-y-0">
                    <div className="flex justify-between">
                      <CardTitle className="text-xl">Savings Plan</CardTitle>
                      <Link to="/savings">See All</Link>
                    </div>
                    <CardDescription className="text-lg mb-5">
                      Three active savings plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-7 h-[230px]">
                    <div className="grid grid-cols-2">
                      <div className="col-span-2 grid gap-5 grid-cols-2">
                        <div>
                          <Progress className="w-full rounded-sm" value={75} />
                        </div>
                        <div>
                          <Progress className="w-full rounded-sm" value={43} />
                        </div>
                      </div>
                      <div className="col-span-1 mt-3">
                        <div className="border-l-2 border-dashed">
                          <div className="p-3 space-y-3">
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
                      <div className="col-span-1 mt-3">
                        <div className="border-l-2 border-dashed">
                          <div className="p-3 space-y-3">
                            <div className="w-12 flex justify-center items-center h-12 rounded-md bg-gray-100">
                              <Smartphone className="text-black" />
                            </div>
                            <div>
                              <h1 className="text-lg font-bold">Smartphone</h1>
                              <p>₱ 13,392.00 / 20,500.00</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <div className="2xl:flex space-y-5 md:space-y-0 sm:grid-rows-1 sm:grid-cols-2 md:grid 2xl:w-[400px] 2xl:flex-col gap-5">
          <div className="rounded col-span-full md:col-span-1 lg p-7 border  ">
            <div className="flex justify-between items-center">
              <h1 className="gap-3 text-xl font-semibold">Upcoming payments</h1>
              <Link to={"/wallet"}>See All</Link>
            </div>
            {/* <hr className="w-full mt-3"/> */}
            <div className="flex mt-5 rounded-md flex-col gap-5 justify-between">
              <div className="flex w-full">
                <div className="p-2 border rounded-md bg-white w-14 flex flex-col items-center ">
                  <p className="text-black text-sm">Nov</p>
                  <p className="text-black text-sm">13</p>
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
                <div className="p-2 border rounded-md bg-white w-14 flex flex-col items-center ">
                  <p className="text-black text-sm">Sep</p>
                  <p className="text-black text-sm">15</p>
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
          </div>
          <div className="rounded h-full col-span-full md:col-span-1 p-7 border">
            <div className="flex justify-between items-center">
              <h1 className="gap-3 text-xl font-semibold">
                Recent Transactions
              </h1>
              <Link to={"/wallet"}>See All</Link>
            </div>
            <div className="flex mt-5 rounded-md justify-between">
              <div className="flex w-full">
                <div className="p-2 border rounded-md bg-white w-14 flex justify-center ">
                  <UtensilsCrossed
                    className="text-black"
                    width={25}
                    height={25}
                  />
                </div>
                <div className="ml-3 w-full">
                  <div className="flex justify-between">
                    <div>
                      <h1 className="font-medium">Mcdonalds</h1>
                    </div>
                    <div>
                      <h1 className="font-medium">₱1,000,000</h1>
                    </div>
                  </div>
                  <p className="text-gray-400">Sep 18, 2024 - 10:24 AM</p>
                </div>
              </div>
              {/* <div>
                <h1 className="font-medium">₱1,000,000</h1>
              </div> */}
            </div>
            <div className="flex mt-5 rounded-md justify-between">
              <div className="flex w-full">
                <div className="p-2 border rounded-md bg-white w-14 flex justify-center ">
                  <UtensilsCrossed
                    className="text-black"
                    width={25}
                    height={25}
                  />
                </div>
                <div className="ml-3 w-full">
                  <div className="flex justify-between">
                    <div>
                      <h1 className="font-medium">Mcdonalds</h1>
                    </div>
                    <div>
                      <h1 className="font-medium">₱1,000,000</h1>
                    </div>
                  </div>
                  <p className="text-gray-400">Sep 18, 2024 - 10:24 AM</p>
                </div>
              </div>
              {/* <div>
                <h1 className="font-medium">₱1,000,000</h1>
              </div> */}
            </div>
            <div className="flex mt-5 rounded-md justify-between">
              <div className="flex w-full">
                <div className="p-2 border rounded-md bg-white w-14 flex justify-center ">
                  <UtensilsCrossed
                    className="text-black"
                    width={25}
                    height={25}
                  />
                </div>
                <div className="ml-3 w-full">
                  <div className="flex justify-between">
                    <div>
                      <h1 className="font-medium">Mcdonalds</h1>
                    </div>
                    <div>
                      <h1 className="font-medium">₱1,000,000</h1>
                    </div>
                  </div>
                  <p className="text-gray-400">Sep 18, 2024 - 10:24 AM</p>
                </div>
              </div>
              {/* <div>
                <h1 className="font-medium">₱1,000,000</h1>
              </div> */}
            </div>
            <div className="flex mt-5 rounded-md justify-between">
              <div className="flex w-full">
                <div className="p-2 border rounded-md bg-white w-14 flex justify-center ">
                  <UtensilsCrossed
                    className="text-black"
                    width={25}
                    height={25}
                  />
                </div>
                <div className="ml-3 w-full">
                  <div className="flex justify-between">
                    <div>
                      <h1 className="font-medium">Mcdonalds</h1>
                    </div>
                    <div>
                      <h1 className="font-medium">₱1,000,000</h1>
                    </div>
                  </div>
                  <p className="text-gray-400">Sep 18, 2024 - 10:24 AM</p>
                </div>
              </div>
              {/* <div>
                <h1 className="font-medium">₱1,000,000</h1>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
