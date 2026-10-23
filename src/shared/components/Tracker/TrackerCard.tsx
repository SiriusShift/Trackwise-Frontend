import * as Icons from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

import { IRootState } from "@/app/store";
import TrackerDialog from "@/shared/components/Tracker/TrackerDialog";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CarouselItem } from "../ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { CategoryLimit } from "@/shared/types";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { getLucideIcon } from "@/shared/utils/icons";

interface TrackerCardProps {
  item: CategoryLimit;
  onDelete: (item: CategoryLimit) => void;
  count: number;
}

// Usage at or above this ratio is flagged as "near limit"
const WARNING_THRESHOLD = 80;

// Colour treatment per budget health
const STATUS_TONES = {
  ok: { bar: "bg-primary", text: "text-muted-foreground" },
  warning: { bar: "bg-warning", text: "text-warning" },
  over: { bar: "bg-destructive", text: "text-destructive" },
};

const TrackerCard = ({ item, onDelete, count }: TrackerCardProps) => {
  const [open, setOpen] = useState(false);
  const currency = useSelector((state: IRootState) => state.settings.currency);

  const limit = item?.value ?? 0;
  const spent = Number(item?.total ?? 0);
  const usage = limit > 0 ? (spent / limit) * 100 : 0;
  const remaining = limit - spent;
  const isOverBudget = spent > limit;

  const tone =
    STATUS_TONES[
      isOverBudget ? "over" : usage >= WARNING_THRESHOLD ? "warning" : "ok"
    ];

  const Icon = getLucideIcon(item?.category?.icon ?? "BusFront");

  return (
    <>
      <CarouselItem
        className={cn(
          count > 1 ? "basis-[90%]" : "basis-full",
          "pl-4 2xl:basis-1/2",
        )}
      >
        <Card className="group flex h-28 flex-col justify-between rounded-lg bg-muted/20 p-4 shadow-none transition-colors hover:bg-muted/40">
          {/* Row 1: icon · name · spent/limit · menu */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70"
              aria-hidden="true"
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight">
                {item.category.name}
              </p>
              <p className="mt-1 text-xs capitalize leading-tight text-muted-foreground">
                {item.period}
              </p>
            </div>

            <div className="shrink-0 text-right leading-tight">
              <p className="text-[15px] font-semibold tabular-nums">
                {formatCurrency(spent, currency)}
              </p>
              <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                of {formatCurrency(limit, currency)}
              </p>
            </div>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  className="-mr-2 h-8 w-7 shrink-0 p-0 text-muted-foreground"
                  variant="ghost"
                  type="button"
                  aria-label="Budget options"
                >
                  <Icons.EllipsisVertical className="h-4 w-4" />
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
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(item)}
                >
                  <Icons.Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Row 2: progress bar · remaining */}
          <div className="flex items-center gap-3 border-t border-border/50 pt-3">
            <div
              className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.min(Math.round(usage), 100)}
              aria-label={`${item.category.name} budget used`}
            >
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500 ease-out",
                  tone.bar,
                )}
                style={{ width: `${Math.min(usage, 100)}%` }}
              />
            </div>
            <span
              className={cn(
                "shrink-0 text-xs font-medium tabular-nums",
                tone.text,
              )}
            >
              {isOverBudget
                ? `${formatCurrency(Math.abs(remaining), currency)} over`
                : `${formatCurrency(remaining, currency)} left`}
            </span>
          </div>
        </Card>
      </CarouselItem>

      <TrackerDialog
        title="Edit budget"
        description="Edit spending limit for this category"
        mode="edit"
        open={open}
        setOpen={setOpen}
        data={item}
      />
    </>
  );
};

export default TrackerCard;
