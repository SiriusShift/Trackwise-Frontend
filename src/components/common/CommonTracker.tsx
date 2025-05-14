import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
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
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DeleteDialog } from "../dialog/DeleteDialog";
import TrackerDialog from "../dialog/expenses/TrackerDialog";
import { commonTrackerProps } from "@/types";

// Separated component for Add Card
const AddCard = ({
  title,
  addDescription,
}: {
  title: string;
  addDescription: string;
}) => (
  <CarouselItem className="basis-full md:basis-1/2 xl:basis-1/3 2xl:basis-1/4">
    <Card className="h-full">
      <CardContent className="flex h-[100px] items-center p-9">
        <TrackerDialog
          title={`Add ${title}`}
          description={addDescription}
          mode="add"
        />
        <span className="ml-5">Set New Limit</span>
      </CardContent>
    </Card>
  </CarouselItem>
);

const TrackerCard = ({
  item,
  title,
  editDescription,
  onDelete,
  isLoading,
}: any) => {
  const percentage = item?.value > 0 ? (item?.total / item?.value) * 100 : 0;
  const endAngle = 90 - (percentage / 100) * 360;
  const Icon = Icons[item.category.icon] || Icons["BusFront"];

  return (
    <CarouselItem className="basis-full md:basis-1/2 xl:basis-1/3 2xl:basis-1/4">
      <Card className="h-full relative">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              className="absolute top-2 w-5 right-2"
              variant="ghost"
              type="button"
            >
              <Icons.EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <TrackerDialog
              title={`Edit ${title}`}
              description={editDescription}
              mode="edit"
              data={item}
            />
            <DeleteDialog
              onDelete={() => onDelete?.(item)}
              description={`Are you sure you want to delete this ${title.toLowerCase()}? This action cannot be undone.`}
              title={`Delete ${title}`}
              isLoading={isLoading}
            />
          </DropdownMenuContent>
        </DropdownMenu>
        <CardContent className="flex h-[100px] items-center p-3">
          <ChartContainer
            config={{ innerRadius: 27, outerRadius: 20 }}
            className="h-[100px] w-[100px]"
          >
            <RadialBarChart
              width={100}
              height={100}
              innerRadius={27}
              outerRadius={20}
              startAngle={90}
              endAngle={endAngle}
              data={[{ value: percentage }]}
            >
              <PolarGrid radialLines={false} stroke="none" />
              <RadialBar
                dataKey="value"
                background
                cornerRadius={10}
                fill="hsl(var(--chart-1))"
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => (
                    <svg
                      x={viewBox.cx - 12}
                      y={viewBox.cy - 12}
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-primary"
                    >
                      <Icon />
                    </svg>
                  )}
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
};

function CommonTracker({
  title,
  data,
  editDescription,
  addDescription,
  isLoading,
  onSubmit,
  onDelete,
}: commonTrackerProps & {
  onDelete?: (item: any) => void;
  showAddCard?: boolean;
}) {
  const width = useScreenWidth();

  const shouldShowNav =
    (data?.length > 3 && width >= 1536) ||
    (data?.length > 2 && width >= 1280 && width < 1536) ||
    (data?.length > 1 && width >= 768 && width < 1280) ||
    (data?.length > 0 && width < 768);

  return (
    <div className="relative w-full">
      <h1 className="text-xl font-semibold mb-5">{title}</h1>
      <Carousel
        opts={{
          align: "start",
          watchDrag: width < 768,
        }}
        className="relative w-full"
      >
        <CarouselContent className="h-full">
          <AddCard addDescription={addDescription} title={title} />
          {data?.map((item, index) => (
            <TrackerCard
              key={index}
              item={item}
              title={title}
              isLoading={isLoading}
              onDelete={onDelete}
              editDescription={editDescription}
            />
          ))}
        </CarouselContent>

        {shouldShowNav && (
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
