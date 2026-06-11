import * as Icons from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

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

import { IRootState } from "@/app/store";
import { commonTrackerProps } from "@/shared/types";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { cn } from "@/lib/utils";
import { StackedBar } from "../charts/CommonBar";

interface TrackerCardProps extends commonTrackerProps {
  item: any;
  title: string;
  editDescription: string;
  onDelete: (item: any) => void;
  onSubmit?: () => void;
  type: string;
  count: number;
}

// Derive end angle from a 0–100 percentage for a top-starting radial chart
function percentageToEndAngle(percentage: number): number {
  return 90 - (percentage / 100) * 360;
}

const TrackerCard = ({
  item,
  title,
  editDescription,
  onDelete,
  type,
  onSubmit,
  count,
}: TrackerCardProps) => {
  const [open, setOpen] = useState(false);
  const mode = useSelector((state: IRootState) => state.active.mode);
  const width = useScreenWidth();

  const limit = item?.value;
  const percentage = limit > 0 ? (Number(item?.total) / limit) * 100 : 0;
  const isOverBudget = item?.total > limit;
  // const endAngle = percentageToEndAngle(percentage);

  const iconKey = (item?.category?.icon as keyof typeof Icons) ?? "BusFront";
  const Icon = Icons[iconKey] as React.ElementType;

  console.log(item)
  return (
    <>
      <CarouselItem
        className={`${count > 1 ? "basis-[90%]" : "basis-[100%]"} 2xl:basis-1/2`}
      >
        <Card className="relative bg-muted/30 h-24 flex">
          {/* Actions menu */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                className="absolute top-2 right-2 w-5"
                variant="ghost"
                type="button"
                aria-label="Card options"
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
                <Icons.Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(item)}>
                <Icons.Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
              {/* 
                NOTE: "View" was wired to onDelete in the original — 
                replace with the correct handler when ready.
              */}
              <DropdownMenuItem disabled>
                <Icons.Eye className="mr-2 h-4 w-4" /> View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Card body */}
          <CardContent className="flex flex-col gap-2.5 p-3 pl-5 pr-9 w-full">
            {/* <ChartContainer
              config={{ innerRadius: 27, outerRadius: 20 }}
              className="h-[65px] w-[65px] sm:h-[65px] sm:w-[65px] mr-2 shrink-0"
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
                    isOverBudget
                      ? "hsl(var(--destructive))"
                      : "hsl(var(--chart-1))"
                  }
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => (
                      <svg
                        x={(viewBox as any).cx - 12}
                        y={(viewBox as any).cy - 12}
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
            </ChartContainer> */}
            <div className="flex gap-2.5">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                )}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="font-medium text-sm truncate">
                  {item.category.name}
                </p>
                <p className="text-xs capitalize">{item.period} budget</p>
                <p
                  className={`text-xs ${isOverBudget ? "text-destructive" : "text-muted-foreground"}`}
                >
                  ₱{Number(item.total).toFixed(2)}{" "}
                  <span className="text-muted-foreground">
                    / {Number(limit).toFixed(2)}
                  </span>
                </p>
                {/* Over-budget indicator */}
                {/* {isOverBudget && (
                  <p className="text-xs text-destructive font-medium mt-0.5">
                    Over budget
                  </p>
                )} */}
              </div>
            </div>
            <StackedBar
              mode="progress"
              maxValue={item.value}
              segments={[
                { label: "Spent", value: item.total, color: "#f97316" },
              ]}
              formatValue={(v) => `₱${v.toLocaleString()}`}
            />{" "}
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
