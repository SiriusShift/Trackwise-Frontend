import * as Icons from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

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

const TrackerCard = ({
  item,
  onDelete,
  type,
  onSubmit,
  count,
}: TrackerCardProps) => {
  const [open, setOpen] = useState(false);

  const limit = item?.value ?? 0;
  const spent = Number(item?.total ?? 0);
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isOverBudget = spent > limit;
  const remaining = limit - spent;

  const iconKey = (item?.category?.icon as keyof typeof Icons) ?? "BusFront";
  const Icon = Icons[iconKey] as React.ElementType;

  return (
    <>
      <CarouselItem
        className={cn(
          count > 1 ? "basis-[90%]" : "basis-[100%]",
          "2xl:basis-1/2",
        )}
      >
        <Card className="relative bg-muted/30 overflow-hidden h-[120px]">
          {/* Top accent line — destructive when over budget */}
          {/* <div
            className={cn(
              "absolute inset-x-0 top-0 h-[2px]",
              isOverBudget ? "bg-destructive" : "bg-primary/40",
            )}
          /> */}

          {/* Actions menu */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                className="absolute top-2.5 right-2 h-6 w-6 p-0"
                variant="ghost"
                type="button"
                aria-label="Card options"
              >
                <Icons.EllipsisVertical className="h-3.5 w-3.5" />
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
              <DropdownMenuItem disabled>
                <Icons.Eye className="mr-2 h-4 w-4" /> View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <CardContent className="flex flex-col gap-3 p-4 pr-9 pt-5">
            {/* Header row: icon + name/period + spent/limit */}
            <div className="flex items-center gap-3">
              {/* Category icon */}
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted",
                )}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Name + period */}
              <div className="flex flex-col min-w-0 flex-1">
                <p className="font-semibold text-sm leading-tight truncate">
                  {item.category.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize leading-tight mt-0.5">
                  {item.period} budget
                </p>
              </div>

              {/* Spent / limit + over-budget badge */}
              <div className="flex flex-col items-end shrink-0">
                <p
                  className={cn(
                    "text-sm font-semibold tabular-nums leading-tight",
                    isOverBudget ? "text-destructive" : "text-foreground",
                  )}
                >
                  ₱{spent.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums leading-tight">
                  / ₱
                  {limit.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Progress section */}
            <div className="flex flex-col gap-1.5">
              <StackedBar
                mode="progress"
                maxValue={item.value}
                segments={[
                  {
                    label: "Spent",
                    value: item.total,
                    color: isOverBudget
                      ? "hsl(var(--destructive))"
                      : "hsl(var(--primary))",
                  },
                ]}
                formatValue={(v) => `₱${v.toLocaleString()}`}
              />

              {/* Percentage + remaining label */}
              <div className="flex justify-between items-center">
                <span
                  className={cn(
                    "text-xs font-medium tabular-nums",
                    "text-muted-foreground",
                  )}
                >
                  {percentage.toFixed(0)}% used
                </span>
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    "text-muted-foreground",
                  )}
                >
                  {isOverBudget
                    ? `₱${Math.abs(remaining).toLocaleString("en-PH", { minimumFractionDigits: 2 })} over`
                    : `₱${remaining.toLocaleString("en-PH", { minimumFractionDigits: 2 })} left`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CarouselItem>

      <TrackerDialog
        title="Edit budget"
        description="Edit spending limit for this category"
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
