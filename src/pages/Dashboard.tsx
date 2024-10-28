import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

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
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A mixed bar chart";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
  },
  safari: {
    label: "Safari",
  },
  firefox: {
    label: "Firefox",
  },
  edge: {
    label: "Edge",
  },
  other: {
    label: "Other",
  },
} satisfies ChartConfig;
const Dashboard = () => {
  const [date, setDate] = React.useState<Date>()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
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
            <CalendarIcon />
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
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
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
      </div>
      <div className="grid grid-cols-4 gap-5">
        <div className="border rounded-lg h-32 border-gray-100 shadow-md"></div>
        <div className="border rounded-lg h-32 border-gray-100 shadow-md"></div>
        <div className="border rounded-lg h-32 border-gray-100 shadow-md"></div>
        <div className="border rounded-lg h-32 border-gray-100 shadow-md"></div>
      </div>
      <div className="gap-5 grid grid-cols-3">
        <Card className="col-span-2 border rounded-lg border-gray-100 shadow-md ">
          <div className="mx-6 mt-6">
            <h1 className="text-xl font-bold">Loans</h1>
            <CardDescription>
              Your next payment of ₱10,500 is scheduled for October 30, 2024
            </CardDescription>
          </div>
          <CardContent>
            <ChartContainer
              className="mt-5 w-full h-[250px]"
              config={chartConfig}
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  left: 0,
                }}
              >
                <YAxis
                  dataKey="browser"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    chartConfig[value as keyof typeof chartConfig]?.label
                  }
                />
                <XAxis dataKey="visitors" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="visitors" layout="vertical" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <div className="border rounded-lg col-auto border-gray-100 shadow-md"></div>
      </div>
    </div>
  );
};

export default Dashboard;
