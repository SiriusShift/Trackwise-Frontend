import React from "react";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { navigationData } from "@/navigation/navigationData";
import { PuffLoader } from "react-spinners"; // Example spinner component
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingDown, TrendingUp } from "lucide-react";

const chartConfig = {
  width: "100%",
  height: 210,
  innerRadius: 55,
  outerRadius: 80,
  strokeWidth: 5,
  strokeColor: "hsl(var(--background))",
  dataKey: "total",
  nameKey: "categoryName",
  colors: [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-7))",
    "hsl(var(--chart-8))",
    "hsl(var(--chart-9))",
    "hsl(var(--chart-10))",
  ],
};

function CommonPieGraph({ categoryExpenses, date, total, trend }: any) {
  const [showChart, setShowChart] = React.useState(false);
  const location = useLocation();
  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname
  );

  // Delay chart rendering for smooth animation
  React.useEffect(() => {
    if (categoryExpenses) {
      const timer = setTimeout(() => setShowChart(true), 500); // Delay by 500ms
      return () => clearTimeout(timer);
    }
  }, [categoryExpenses]);

  return (
    <Card className="flex flex-col min-w-[300px]">
      {/* Card Header */}
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg xl:text-xl text-center">
          {currentPageName?.name} - Pie Chart
        </CardTitle>
        <CardDescription className="text-center">
          {moment(date).format("MMMM YYYY")}
        </CardDescription>
      </CardHeader>

      {/* Card Content */}
      <ChartContainer config={chartConfig}>
        <CardContent className="flex-1 content-center pb-0">
          {showChart ? (
            <ResponsiveContainer
              width={chartConfig.width}
              height={chartConfig.height}
            >
              <PieChart>
              <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />  
                <Pie
                  data={categoryExpenses}
                  dataKey={chartConfig.dataKey}
                  nameKey={chartConfig.nameKey}
                  innerRadius={chartConfig.innerRadius}
                  outerRadius={chartConfig.outerRadius}
                  strokeWidth={chartConfig.strokeWidth}
                  stroke={chartConfig.strokeColor}
                  isAnimationActive={true}
                >
                  {categoryExpenses.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        chartConfig.colors[index % chartConfig.colors.length]
                      }
                    />
                  ))}
                  <Label
                    position="center"
                    fontSize={16}
                    fontWeight="bold"
                    value={`₱${total?.toLocaleString()}`}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center min-h-52 items-center">
              {/* Spinner */}
              <PuffLoader size={80} color="hsl(var(--primary))" />
            </div>
          )}
        </CardContent>
      </ChartContainer>

      {/* Card Footer */}
      <CardFooter className="flex flex-col items-center text-center gap-2 text-sm">
        <div className="flex items-center justify-center gap-2 font-medium leading-none">
          {trend === "NaN" ? (
            <span>No data for trend calculation</span>
          ) : (
            <>
              <span className="truncate">
                Trending {trend > 0 ? "up" : "down"} this month by {trend}%
              </span>
              {trend > 0 ? (
                <TrendingUp
                  className={`h-4 w-4 ${
                    currentPageName?.name === "Expenses"
                      ? "text-destructive"
                      : "text-success"
                  }`}
                />
              ) : (
                <TrendingDown
                  className={`h-4 w-4 ${
                    currentPageName?.name === "Expenses"
                      ? "text-success"
                      : "text-destructive"
                  }`}
                />
              )}
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total {currentPageName?.name.toLocaleLowerCase()} for the
          month of {moment(date).format("MMMM")}
        </div>
      </CardFooter>
    </Card>
  );
}

export default CommonPieGraph;
