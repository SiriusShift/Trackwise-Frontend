import { commonTrackerProps } from "@/shared/types";
import * as Icons from "lucide-react";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CarouselItem } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import TrackerDialog from "@/shared/components/tracker/TrackerDialog";

const TrackerCard = ({
  item,
  title,
  editDescription,
  onDelete,
  type,
  onSubmit,
  isLoading,
}: commonTrackerProps & {
  item: object;
}) => {
  const percentage = item?.value > 0 ? (item?.total / item?.value) * 100 : 0;
  const endAngle = 90 - (percentage / 100) * 360;
  const iconKey = (item?.category?.icon as keyof typeof Icons) || "BusFront";
  const Icon = Icons[iconKey];

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
              onSubmit={onSubmit}
              data={item}
              type={type}
            />
            <DropdownMenuItem>
              <Icons.Trash2 />
              Delete
            </DropdownMenuItem>
            {/* <DeleteDialog
              onDelete={() => onDelete(item)}
              description={`Are you sure you want to delete this ${title.toLowerCase()}? This action cannot be undone.`}
              title={`Delete ${title}`}
              isLoading={isLoading}
            /> */}
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

export default TrackerCard;
