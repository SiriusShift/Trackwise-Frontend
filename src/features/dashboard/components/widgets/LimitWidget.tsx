import Widget from "@/features/dashboard/components/widgets/Widget";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import React from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

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

const chartData1 = [
  { name: "Food", food: 30 }, // 30% of the total
  { name: "Bills", bills: 70 }, // 70% of the total
];

const LimitWidget = () => {
  const totalVisitors = chartData1[0].bills + chartData1[0].food;

  return (
    <Widget title="Expense Breakdown">
      <ChartContainer
        config={chartConfig1}
        className="mx-auto aspect-square z-0 w-full max-w-[250px]"
      >
        <RadialBarChart
          data={chartData1}
          endAngle={180}
          innerRadius={90}
          outerRadius={140}
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 16}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {totalVisitors.toLocaleString()}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 4}
                        className="fill-muted-foreground"
                      >
                        Food
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          {/* <RadialBar
                        dataKey="food"
                        stackId="a"
                        cornerRadius={5}
                        fill="var(--color-food)"
                        className="stroke-transparent stroke-2"
                      /> */}
          <RadialBar
            dataKey="food"
            fill="var(--color-bills)"
            stackId="a"
            // background={{ fill: "var(--color-secondary)" }}
            cornerRadius={5}
            className="stroke-transparent stroke-2"
          />
        </RadialBarChart>
      </ChartContainer>
    </Widget>
  );
};

export default LimitWidget;
