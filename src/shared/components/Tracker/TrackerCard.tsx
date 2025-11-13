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
import TrackerDialog from "@/shared/components/Tracker/TrackerDialog";
import { useSelector } from "react-redux";
import { IRootState } from "@/app/store";
import { useState } from "react";

const TrackerCard = ({
  item,
  title,
  editDescription,
  onDelete,
  type,
  onSubmit,
  isLoading,
  key,
}: commonTrackerProps & {
  item: object;
  title: string;
  editDescription: string;
  onDelete: () => void;
  onSubmit: () => void;
  type: string;
  isLoading: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const mode = useSelector((state: IRootState) => state.active.mode);
  const limit = mode === "monthly" ? item?.value : item?.value * 12;
  console.log(limit);
  const percentage = limit > 0 ? (Number(item?.total) / limit) * 100 : 0;
  const endAngle = 90 - (percentage / 100) * 360;
  const iconKey = (item?.category?.icon as keyof typeof Icons) || "BusFront";
  const Icon = Icons[iconKey];

  return (
    <>
      <CarouselItem
        key={key}
        className="basis-[80%] md:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
      >
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
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setOpen(true);
                }}
              >
                <Icons.Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(item)}>
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
                  fill={
                    item?.total > limit
                      ? "hsl(var(--destructive))"
                      : "hsl(var(--chart-1))"
                  }
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
                ₱ {Number(item.total)?.toFixed(2)} / {Number(limit)?.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </CarouselItem>
      <TrackerDialog
        title={`Edit ${title}`}
        description={editDescription}
        mode="edit"
        open={open}
        setOpen={setOpen}
        onSubmit={onSubmit}
        data={item}
        type={type}
      />
    </>
  );
};

export default TrackerCard;
