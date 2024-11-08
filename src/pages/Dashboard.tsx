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

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Loan Payment Progress Chart";

const chartData = [
  {
    loanType: "Car Loan",
    paidPercentage: 75,
    paidAmount: 15000,
    fill: "hsl(0, 0%, 61%)",
  },
  {
    loanType: "House Loan",
    paidPercentage: 50,
    paidAmount: 50000,
    fill: "hsl(0, 0%, 39%)",
  },
  {
    loanType: "Laptop Loan",
    paidPercentage: 40,
    paidAmount: 2000,
    fill: "hsl(0, 0%, 24%)",
  },
  {
    loanType: "Property Loan",
    paidPercentage: 30,
    paidAmount: 30000,
    fill: "hsl(0, 0%, 66%)",
  },
  {
    loanType: "Other Loans",
    paidPercentage: 20,
    paidAmount: 500,
    fill: "hsl(0, 0%, 67%)",
  },
];

const chartConfig = {
  paidPercentage: {
    label: "Paid Percentage",
  },
  car: {
    label: "Car Loan",
    color: "hsl(0, 0%, 61%)",
  },
  house: {
    label: "House Loan",
    color: "hsl(0, 0%, 39%)",
  },
  laptop: {
    label: "Laptop Loan",
    color: "hsl(0, 0%, 24%)",
  },
  property: {
    label: "Property Loan",
    color: "hsl(0, 0%, 66%)",
  },
  other: {
    label: "Other Loans",
    color: "hsl(0, 0%, 67%)",
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
    <div className="flex flex-col gap-5">
      {/* <div className="flex items-center justify-between">
        <h1 className="text-4xl lg:text-2xl font-bold">Dashboard</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[250px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span className="text-lg lg:text-base">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div> */}
      <div className="gap-5 grid  2xl:flex-row">
        <div className="flex w-full flex-col gap-5">
          <div className="grid grid-cols-4 md:grid-rows-1 lg:grid-rows-1 gap-5">
            <Card className="border p-5 flex flex-col justify-between rounded-lg col-span-2 md:col-span-2 xl:col-span-1 h-36 shadow-md">
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
            <div className="border rounded-lg col-span-2 md:col-span-2 xl:col-span-1 h-36 shadow-md"></div>
            <div className="border rounded-lg col-span-2 md:col-span-2 xl:col-span-1 h-36 shadow-md"></div>
            <div className="border rounded-lg col-span-2 md:col-span-2 xl:col-span-1 h-36 shadow-md"></div>
          </div>
          <div className="gap-5 grid-rows-1 grid grid-cols-3">
            <Card className="col-span-4  lg:col-span-3 border rounded-lg shadow-md">
              <div className="mx-6 mt-6">
                <h1 className="text-xl font-bold">Active Loans</h1>
                <CardDescription className="text-base">
                  Your next payment of ₱10,500 is scheduled for October 30, 2024
                </CardDescription>
              </div>
              <CardContent>
                <ChartContainer
                  className="h-[300px] mt-5 w-full"
                  config={chartConfig}
                >
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{
                      right: 16,
                    }}
                  >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                      dataKey="loanType"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                    />
                    <XAxis
                      dataKey="paidPercentage"
                      type="number"
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <ChartTooltip cursor={false} content={<CustomTooltip />} />
                    <Bar
                      dataKey="paidPercentage"
                      fill="var(--color-desktop)"
                      radius={4}
                    >
                      <LabelList
                        dataKey="paidPercentage"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                        formatter={(value) => `${value}%`}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex flex-row 2xl:flex-col gap-5">
          <div className="w-1/2 xl:min-w-[350px] rounded lg p-5 border shadow-md ">
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
          <div className="w-1/2 xl:min-w-[350px] rounded lg p-5 border shadow-md ">
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
                <div className="p-2 border rounded-md bg-white flex justify-center shadow-md">
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
    </div>
  );
};

export default Dashboard;
