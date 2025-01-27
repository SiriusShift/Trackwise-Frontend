import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Plus } from "lucide-react";
import useScreenWidth from "@/hooks/useScreenWidth";
import { ChartContainer } from "../ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

const chartData = [
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
};

function CommonTracker({ title }: { title: string }) {
  const screenWidth = useScreenWidth(); // Get the current screen width
  const isMdOrAbove = screenWidth >= 768; // Tailwind's `md` breakpoint (768px)

  return (
    <div className="relative w-full">
      <h1 className="text-xl font-semibold mb-5">{title}</h1>
      <Carousel
        opts={{
          align: "start",
          watchDrag: isMdOrAbove ? false : true,
        }}
        className="relative w-full"
      >
        <CarouselContent className="h-full">
          {/* Add Limit Card */}
          <CarouselItem className="basis-full md:basis-1/2 xl:basis-1/3 2xl:basis-1/4">
            <Card className="h-full">
              <CardContent className="flex h-[100px] items-center p-9">
                <button className="rounded-full border-primary border-2 p-1">
                  <Plus size={30} />
                </button>
                <span className="ml-5">Set New Limit</span>
              </CardContent>
            </Card>
          </CarouselItem>

          {/* Dynamic Cards with Radial Chart */}
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-full md:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
            >
              <Card className="h-full">
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto w-[80px] h-[80px]" // Adjusted width and height to match `w-11`
                  >
                    <RadialBarChart
                      data={chartData}
                      startAngle={0}
                      endAngle={250}
                      innerRadius={20} // Smaller inner radius
                      outerRadius={15} // Smaller outer radius
                    >
                      <PolarGrid
                        gridType="circle"
                        radialLines={false}
                        stroke="none"
                        className="first:fill-muted last:fill-background"
                        polarRadius={[20, 15]} // Adjusted polar radius
                      />
                      <RadialBar
                        dataKey="visitors"
                        background
                        cornerRadius={10}
                      />
                      <PolarRadiusAxis
                        tick={false}
                        tickLine={false}
                        axisLine={false}
                      />
                    </RadialBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-10 hidden md:flex items-center justify-center bg-white shadow-lg w-10 h-10" />
        <CarouselNext className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 hidden md:flex items-center justify-center bg-white shadow-lg w-10 h-10" />
      </Carousel>
    </div>
  );
}

export default CommonTracker;
