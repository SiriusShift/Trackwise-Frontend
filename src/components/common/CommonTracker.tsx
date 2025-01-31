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
import * as Icons from "lucide-react";
import useScreenWidth from "@/hooks/useScreenWidth";
import { ChartContainer } from "../ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import TrackerDialog from "../dialog/TrackerDialog";
import { useGetCategoryLimitQuery } from "@/feature/category/api/categoryApi";

function CommonTracker({ title }: { title: string }) {
  const screenWidth = useScreenWidth(); // Get the current screen width
  const isMdOrAbove = screenWidth >= 768; // Tailwind's `md` breakpoint (768px)

  const { data, isLoading } = useGetCategoryLimitQuery(); // Fetch category data from API

  const chartConfig = {
    innerRadius: 27,
    outerRadius: 20,
  }

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
                <TrackerDialog
                  title="Add budget limit"
                  description="
                Set a monthly spending limit for your budget category. You'll be
                notified when you're approaching your limit."
                  mode="add"
                />
                <span className="ml-5">Set New Limit</span>
              </CardContent>
            </Card>
          </CarouselItem>

          {/* Dynamic Cards with Radial Chart */}
          {data?.map((item, index) => {
            const percentage = (item?.totalExpense / item?.limit) * 100;
            const endAngle = Math.round((percentage / 100) * 360); // Ensure it's a whole number
            console.log(percentage, endAngle);
            return (
              <CarouselItem
                key={index}
                className="basis-full md:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
              >
                <Card className="h-full">
                  <CardContent className="flex h-[100px] items-center p-3">
                    <ChartContainer config={chartConfig} className="h-[100px] w-[100px]">
                      <RadialBarChart
                        data={[{ value: percentage }]} // Pass percentage as value for chart
                        startAngle={90} // Start at the top
                        endAngle={endAngle - 90} // Set end angle dynamically
                        innerRadius={chartConfig?.innerRadius} // Inner radius of the radial chart
                        outerRadius={chartConfig?.outerRadius} // Outer radius of the radial chart
                      >
                        <PolarGrid
                          gridType="circle"
                          radialLines={false}
                          stroke="none"
                          className="first:fill-muted last:fill-background"
                          polarRadius={[25, 22]}
                        />
                        <RadialBar
                          dataKey="value"
                          background
                          cornerRadius={10}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                          <Label
                            content={({ viewBox }) => {
                              if (viewBox?.cx && viewBox?.cy) {
                                // Dynamically render icon based on item.icon
                                const LucideIcon = Icons[item.icon] || Icons["busFront"]; // Default to "Music" if not found
                                return (
                                  <svg
                                    x={viewBox.cx - 12} // Adjust for icon's size
                                    y={viewBox.cy - 12} // Adjust for icon's size
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="text-primary"
                                  >
                                    <LucideIcon />
                                  </svg>
                                );
                              }
                              return null;
                            }}
                          />
                        </PolarRadiusAxis>
                      </RadialBarChart>
                    </ChartContainer>
                    <div className="flex flex-col">
                      <h1>{item.name}</h1>
                      <p>$ {item.totalExpense} / {item.limit}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-10 hidden md:flex items-center justify-center shadow-md w-10 h-10" />
        <CarouselNext className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 hidden md:flex items-center justify-center shadow-md w-10 h-10" />
      </Carousel>
    </div>
  );
}

export default CommonTracker;
