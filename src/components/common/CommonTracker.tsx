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
import TrackerDialog from "../dialog/expenses/TrackerDialog";
import { useGetCategoryLimitQuery } from "@/feature/category/api/categoryApi";
import moment from "moment";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { useSelector } from "react-redux";
import { DeleteDialog } from "../dialog/DeleteDialog";
import { commonTrackerProps } from "@/types";

function CommonTracker({ title, data, isLoading }: commonTrackerProps) {
  const width = useScreenWidth();
  const isMdOrAbove = width >= 768;

  const chartConfig = {
    innerRadius: 27,
    outerRadius: 20,
  };

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
                  title={`Add ${title}`}
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
            console.log(item);
            const percentage =
              item?.value > 0 ? (item?.total / item?.value) * 100 : 0;
            const endAngle = 90 - (percentage / 100) * 360; // Fix the angle calculation

            return (
              <CarouselItem
                key={index}
                className="basis-full md:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
              >
                <Card className="h-full relative">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="absolute top-2 w-5 right-2"
                        variant={"ghost"}
                        type="button"
                      >
                        <Icons.EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <TrackerDialog
                        title="Edit budget limit"
                        description="Adjust and update your budget limit to match your needs."
                        mode="edit"
                        data={item}
                      />
                      <DeleteDialog
                        // onDelete={onDelete}
                        description="Are you sure you want to delete this limit? This action cannot be undone"
                        title="Delete Recurring Expense"
                        isLoading={isLoading}
                      />
                      {/* <DropdownMenuItem
                      >
                        <Icons.Pencil /> Edit
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <CardContent className="flex h-[100px] items-center p-3">
                    <ChartContainer
                      config={chartConfig}
                      className="h-[100px] w-[100px]"
                    >
                      <RadialBarChart
                        width={100} // Ensure proper width
                        height={100} // Ensure proper height
                        innerRadius={chartConfig?.innerRadius}
                        outerRadius={chartConfig?.outerRadius}
                        startAngle={90} // Always start from top
                        endAngle={endAngle} // Dynamically computed
                        data={[{ value: percentage }]} // Ensure data has the expected key
                      >
                        <PolarGrid radialLines={false} stroke="none" />
                        <RadialBar
                          dataKey="value"
                          background
                          cornerRadius={10}
                          fill="hsl(var(--chart-1))"
                        />
                        <PolarRadiusAxis
                          tick={false}
                          tickLine={false}
                          axisLine={false}
                        >
                          <Label
                            content={({ viewBox }) => {
                              if (viewBox?.cx && viewBox?.cy) {
                                const LucideIcon =
                                  Icons[item.category.icon] ||
                                  Icons["busFront"];
                                return (
                                  <svg
                                    x={viewBox.cx - 12}
                                    y={viewBox.cy - 12}
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
                      <h1>{item.category.name}</h1>
                      <p>
                        ₱ {item.total.toFixed(2)} / {item.value.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation Buttons */}
        {((data?.length > 3 && width >= 1536) ||
          (data?.length > 2 && width >= 1280 && width < 1536) ||
          (data?.length > 1 && width >= 768 && width < 1280) ||
          (data?.length > 0 && width < 768)) && (
          <>
            <CarouselPrevious className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-10 hidden sm:flex items-center justify-center shadow-md w-10 h-10" />
            <CarouselNext className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 hidden sm:flex items-center justify-center shadow-md w-10 h-10" />
          </>
        )}
      </Carousel>
    </div>
  );
}

export default CommonTracker;
