import moment from "moment";
import { useLocation } from "react-router-dom";
import { navigationData } from "@/routing/navigationData";
import { PuffLoader } from "react-spinners"; // Example spinner component
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { TrendingDown, TrendingUp } from "lucide-react";
import noChartData from "@/assets/images/file.png";
import { formatDateDisplay, formatMode } from "@/shared/utils/CustomFunctions";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";

const chartConfig = {
  width: 200,
  height: 210,
  innerRadius: 55,
  outerRadius: 80,
  strokeWidth: 5,
  strokeColor: "hsl(var(--card))",
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

function CommonPieGraph({ data, total, trend, type, graphLoading }: any) {
  const [showChart, setShowChart] = useState(false);

  const dateDisplay = formatDateDisplay();
  const modeDisplay = formatMode();

  console.log(trend, "trend")

  // Delay chart rendering for smooth animation
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => setShowChart(true), 200); // Delay by 500ms
      return () => clearTimeout(timer);
    }
  }, [data]);

  return (
    // return width > 1024 ? (
    <Card className="flex h-[375px] flex-col min-w-[250px] xl:w-[300px]">
      {/* Card Header */}
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg xl:text-xl text-center">
          {type} breakdown
        </CardTitle>
        <CardDescription className="text-center">
          {formatDateDisplay()}
        </CardDescription>
      </CardHeader>

      {/* Card Content */}
      <ChartContainer className="h-[225px] lg:h-auto" config={chartConfig}>
        <CardContent className="flex-1 justify-center flex content-center pb-0">
          {showChart && !graphLoading ? (
            <ResponsiveContainer
              width={data?.length > 0 ? chartConfig.width : 150}
              height={chartConfig.height}
              className={"flex justify-center items-center"}
            >
              {data?.length > 0 ? (
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        className="w-auto max-w-[150px] p-2 rounded-md shadow-md"
                        hideLabel
                      />
                    }
                  />
                  <Pie
                    data={data}
                    dataKey={chartConfig.dataKey}
                    nameKey={chartConfig.nameKey}
                    innerRadius={chartConfig.innerRadius}
                    outerRadius={chartConfig.outerRadius}
                    strokeWidth={chartConfig.strokeWidth}
                    stroke={chartConfig.strokeColor}
                    isAnimationActive={true}
                    startAngle={90} // Adjust this for your preferred starting position
                    endAngle={-270} // Ensure full 360° rotation
                  >
                    {data?.map((entry, index) => (
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
                      value={`₱${total}`}
                    />
                  </Pie>
                </PieChart>
              ) : (
                <img src={noChartData} width={50} />
              )}
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
        {graphLoading ? (
          <>
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
          </>
        ) : trend === "NaN" || Number(trend) === 0 ? (
          <span>No trend data available for this {modeDisplay}.</span>
        ) : (
          <div className="flex flex-col items-center text-center gap-2 text-sm">
            <div className="flex items-center justify-center gap-2 font-medium leading-none">
              <span className="truncate">
                {trend > 0
                  ? `Up by ${trend}% this ${modeDisplay}`
                  : `Down by ${trend}% this ${modeDisplay}`}
              </span>
              {trend > 0 ? (
                <TrendingUp
                  className={`h-4 w-4 ${
                    type === "Expense" ? "text-destructive" : "text-success"
                  }`}
                />
              ) : (
                <TrendingDown
                  className={`h-4 w-4 ${
                    type === "Expense" ? "text-success" : "text-destructive"
                  }`}
                />
              )}
            </div>
            <div className="leading-none text-muted-foreground">
              Total {type?.toLowerCase()} shown for this {modeDisplay}.
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default CommonPieGraph;
