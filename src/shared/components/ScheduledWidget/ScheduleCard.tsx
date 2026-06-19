import * as Icons from "lucide-react";
import { memo, useMemo, useState } from "react";

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

import { commonTrackerProps } from "@/shared/types";
import { frequencies } from "@/shared/constants/dateConstants";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import moment from "moment";
import { Separator } from "../ui/separator";

// ─── Types ───────────────────────────────────────────────────────────────────

type ScheduleType = "Expense" | "Income" | "Transfer";

interface Schedule {
  type: ScheduleType;
  description: string;
  amount: number | string;
  category: { icon?: string; name: string };
  fromAsset?: { name: string };
  behaviour?: string;
  unit?: string;
  interval?: number | string;
  nextDueDate?: string | Date | number;
}

interface TrackerCardProps extends commonTrackerProps {
  schedule: Schedule;
  title: string;
  editDescription: string;
  onDelete: (schedule: Schedule) => void;
  onView?: (schedule: Schedule) => void;
  onSubmit?: () => void;
  type: string;
  count: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  ScheduleType,
  {
    container: string;
    text: string;
    badge: string;
    accent: string;
    icon: React.ElementType;
    prefix: string;
  }
> = {
  Expense: {
    container:
      "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800",
    text: "text-destructive",
    badge:
      "bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 border-0",
    accent: "bg-red-500",
    icon: Icons.ArrowUp,
    prefix: "−",
  },
  Income: {
    container:
      "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-600 dark:text-emerald-400",
    badge:
      "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-0",
    accent: "bg-emerald-500",
    icon: Icons.ArrowDown,
    prefix: "+",
  },
  Transfer: {
    container:
      "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800",
    text: "text-blue-600 dark:text-blue-400",
    badge:
      "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border-0",
    accent: "bg-blue-500",
    icon: Icons.ArrowRightLeft,
    prefix: "",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

const TrackerCard = memo(
  ({
    schedule,
    title,
    editDescription,
    onDelete,
    onView,
    type,
    onSubmit,
    count,
  }: TrackerCardProps) => {
    const [open, setOpen] = useState(false);

    const config = useMemo(
      () => TYPE_CONFIG[schedule.type as ScheduleType] ?? TYPE_CONFIG.Transfer,
      [schedule.type],
    );

    const { icon: TypeIcon, prefix, container, text, badge, accent } = config;

    const nextDue = useMemo(
      () =>
        schedule.nextDueDate
          ? moment(schedule.nextDueDate).format("MMM DD, YYYY")
          : "N/A",
      [schedule.nextDueDate],
    );

    const formattedAmount = useMemo(
      () =>
        Number(schedule.amount).toLocaleString("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      [schedule.amount],
    );

    const frequency = useMemo(
      () =>
        frequencies.find(
          (f) => f.unit === schedule.unit && f.interval === schedule.interval,
        ),
      [schedule.unit, schedule.interval],
    );

    const behaviour = useMemo(
      () =>
        schedule.behaviour?.charAt(0).toUpperCase() +
        schedule.behaviour?.slice(1).toLowerCase(),
      [schedule.behaviour],
    );

    return (
      <>
        <CarouselItem
          className={`${count > 1 ? "basis-[90%]" : "basis-[100%]"} 2xl:basis-1/2`}
        >
          <Card className="relative overflow-hidden bg-muted/30 transition-shadow hover:shadow-md h-[120px]">
            {/* ── Left accent bar ───────────────────────────────────── */}
            {/* <span
              className={cn("absolute inset-y-0 left-0 w-1", accent)}
              aria-hidden="true"
            /> */}

            {/* ── Actions menu ──────────────────────────────────────── */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  className="absolute top-2 right-2 h-7 w-7 shrink-0 p-0"
                  variant="ghost"
                  type="button"
                  aria-label="Card options"
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
                  <Icons.Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(schedule)}
                >
                  <Icons.Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onView?.(schedule)}
                  disabled={!onView}
                >
                  <Icons.Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ── Card body ─────────────────────────────────────────── */}
            {/*
              pr-9  reserves space for the absolutely-positioned ⋮ button.
              pl-5  offsets the left accent bar.
            */}
            <CardContent className="flex flex-col gap-2 p-3 pl-5 pr-9 justify-center h-full">
              {/* ── Row 1: type icon · text block · amount ─────────── */}
              <div className="flex items-center gap-2.5">
                {/* Type icon — fixed size, never shrinks */}
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                    container,
                    text,
                  )}
                  aria-hidden="true"
                >
                  <TypeIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-tight">
                    {schedule.description}
                  </p>

                  {/* Asset · Category — both truncate independently */}
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    {schedule.fromAsset?.name && (
                      <>
                        <span className="truncate" style={{ maxWidth: "5rem" }}>
                          {schedule.fromAsset.name}
                        </span>
                        <span aria-hidden="true" className="shrink-0">
                          ·
                        </span>
                      </>
                    )}
                    <span className="truncate">{schedule.category.name}</span>
                  </div>
                </div>

                {/*
                  Amount: shrink-0 + whitespace-nowrap ensures it
                  NEVER wraps or gets pushed off-screen on small cards.
                */}
                <p
                  className={cn(
                    "shrink-0 whitespace-nowrap tabular-nums text-sm font-semibold",
                    text,
                  )}
                  aria-label={`${schedule.type}: ₱${formattedAmount}`}
                >
                  {prefix}₱{formattedAmount}
                </p>
              </div>
              <Separator />

              {/* ── Row 2: badges (left) · next-due (right) ────────── */}
              <div className="flex items-center justify-between gap-2">
                {/*
                  Badges: overflow-hidden + flex-nowrap stops them stacking.
                  They'll clip if there's truly no room rather than wrap.
                */}
                <div className="flex min-w-0 shrink items-center gap-1 overflow-hidden">
                  {frequency?.name && (
                    <Badge
                      className={cn(
                        "shrink-0 text-xs font-semibold capitalize tracking-wide",
                      )}
                      variant={"outline"}
                    >
                      {frequency.name}
                    </Badge>
                  )}
                  {behaviour && (
                    <Badge
                      className={cn(
                        "shrink-0 text-xs font-semibold capitalize tracking-wide",
                      )}
                      variant={"outline"}
                    >
                      {behaviour}
                    </Badge>
                  )}
                </div>

                {/*
                  Date: shrink-0 + whitespace-nowrap keeps it on one line.
                */}
                <p className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
                  <Icons.CalendarClock
                    className="h-3 w-3 shrink-0"
                    aria-hidden="true"
                  />
                  {nextDue}
                </p>
              </div>
            </CardContent>
          </Card>
        </CarouselItem>

        {/* ── Edit dialog ───────────────────────────────────────────── */}
        <TrackerDialog
          title={`Edit ${title}`}
          description={editDescription}
          mode="edit"
          open={open}
          setOpen={setOpen}
          onSubmit={onSubmit}
          data={schedule}
          type={type}
        />
      </>
    );
  },
);

TrackerCard.displayName = "TrackerCard";

export default TrackerCard;
