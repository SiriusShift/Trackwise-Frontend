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
  Bus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Loan Payment Progress Chart";

const chartData = [
  { expenseType: "Baby", running: 45 },
  { expenseType: "Car", running: 50 },
  { expenseType: "Car", running: 50 },
  { expenseType: "Car", running: 23 },
  { expenseType: "Car", running: 60 },
  { expenseType: "Laptop", running: 60 },
];

const chartConfig = {
  running: {
    label: "Expense",
    color: "hsl(0, 0%, 0%)", // Black color
  },
} satisfies ChartConfig;
const Dashboard = () => {
  const [date, setDate] = React.useState<Date>();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { loanType, paidPercentage, paidAmount } = payload[0].payload;
      return (
        <div className="p-2 bg-white border border-gray-300 shadow-lg rounded-md">
          <p className="font-bold">{loanType}</p>
          <p>{`Paid Percentage: ${paidPercentage}%`}</p>
          <p>{`Paid Amount: ₱${paidAmount.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-col 2xl:flex-row gap-5">
        <div className="gap-5 flex w-4/5 flex-col 2xl:flex-row">
          <div className="flex w-full flex-col gap-5">
            <div className="grid grid-cols-3 md:grid-rows-1 lg:grid-rows-1 gap-5">
              <Card className="border p-5 flex flex-col justify-between rounded-lg xl:col-span-1 h-72 shadow-md">
                {/* <div className="flex justify-between">
                <div>
                  <h1 className="text-xl">Balance</h1>
                  <p className="text-sm text-gray-400">September 2024</p>
                </div>
                <div className="w-10 h-10 rounded-md flex justify-center items-center bg-gray-100">
                  <Banknote className="text-gray-500" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl text-gray-600 font-semibold">
                  ₱ 100,000
                </h2>
              </div> */}
              </Card>
              <Card className="border rounded-lg col-span-2 md:col-span-2 xl:col-span-1 h-36 shadow-md"></Card>
              <Card className="border rounded-lg col-span-2 md:col-span-2 xl:col-span-1 h-36 shadow-md"></Card>
            </div>
            <div className="gap-5 grid-rows-1 grid grid-cols-4">
              <div className="col-span-2">
                <Card className="p-0">
                  <CardContent>
                    <ChartContainer
                      className="h-[250px] w-full"
                      config={chartConfig}
                    >
                      <BarChart accessibilityLayer data={chartData}>
                        <XAxis
                          dataKey="expenseType"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => value}
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
                          fill="black" // Set bar color to black
                          radius={[0, 0, 4, 4]}
                          background={{ fill: "#eee" }}
                        >

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
            </div>
          </div>
        </div>
        <div className="flex flex-row w-[350px] 2xl:flex-col gap-5">
          <div className="rounded lg p-7 border shadow-md ">
            <div className="flex justify-between items-center">
              <h1 className="gap-3 text-xl font-semibold">
                Recent Transactions
              </h1>
              <h2>See All</h2>
            </div>
            <div className="flex mt-5 rounded-md justify-between">
              <div className="flex w-full">
                <div className="p-2 border rounded-md bg-white max-h-12 max-w-12 flex justify-center shadow-md">
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
                <div className="p-2 border rounded-md bg-white max-h-12 max-w-12 flex justify-center shadow-md">
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
                <div className="p-2 border rounded-md bg-white max-h-12 max-w-12 flex justify-center shadow-md">
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
                <div className="p-2 border rounded-md bg-white max-h-12 max-w-12 flex justify-center shadow-md">
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
          <div className="rounded lg p-7 border shadow-md ">
            <div className="flex justify-between items-center">
              <h1 className="gap-3 text-xl font-semibold">
                Recent Transactions
              </h1>
              <h2>See All</h2>
            </div>
            <div className="flex mt-5 rounded-md justify-between">
              <div className="flex w-full">
                <div className="p-2 border rounded-md bg-white max-h-12 max-w-12 flex justify-center shadow-md">
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
                <div className="p-2 border rounded-md bg-white max-h-12 max-w-12 flex justify-center shadow-md">
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
                <div className="p-2 border rounded-md bg-white max-h-12 max-w-12 flex justify-center shadow-md">
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
                <div className="p-2 border rounded-md bg-white max-h-12 max-w-12 flex justify-center shadow-md">
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
