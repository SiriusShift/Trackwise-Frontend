import * as Icons from "lucide-react";
import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CarouselItem } from "../ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { IRootState } from "@/app/store";
import { TransactionDialog } from "@/features/transactions/components/dialogs/TransactionDialog";
import { cn } from "@/lib/utils";
import { frequencies } from "@/shared/constants/dateConstants";
import { Schedule, ScheduleType } from "@/shared/types";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { getLucideIcon } from "@/shared/utils/icons";
import moment from "moment";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScheduleCardProps {
  schedule: Schedule;
  onDelete?: (schedule: Schedule) => void;
  count: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

// Amount colour + sign per schedule type — mirrors TransactionItem
const TYPE_TONES: Record<ScheduleType, { text: string; prefix: string }> = {
  Expense: { text: "text-foreground", prefix: "−" },
  Income: { text: "text-success", prefix: "+" },
  Transfer: { text: "text-primary", prefix: "" },
};

// Days ahead at which an upcoming due date is highlighted
const DUE_SOON_DAYS = 3;

function getDueInfo(date?: string | Date | number) {
  if (!date) return { label: "No upcoming date", tone: "text-muted-foreground" };

  const days = moment(date).startOf("day").diff(moment().startOf("day"), "days");

  if (days < 0) return { label: `Overdue ${Math.abs(days)}d`, tone: "text-destructive" };
  if (days === 0) return { label: "Due today", tone: "text-warning" };
  if (days === 1) return { label: "Tomorrow", tone: "text-warning" };
  if (days <= DUE_SOON_DAYS) return { label: `In ${days} days`, tone: "text-warning" };
  return {
    label: moment(date).format("MMM D"),
    tone: "text-muted-foreground",
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

const ScheduleCard = memo(({ schedule, onDelete, count }: ScheduleCardProps) => {
  const [open, setOpen] = useState(false);
  const currency = useSelector((state: IRootState) => state.settings.currency);

  const tone = TYPE_TONES[schedule.type as ScheduleType] ?? TYPE_TONES.Transfer;
  const CategoryIcon = getLucideIcon(schedule.category?.icon);

  const due = useMemo(() => getDueInfo(schedule.nextDueDate), [schedule.nextDueDate]);

  const frequencyLabel = useMemo(() => {
    const preset = frequencies.find(
      (f) => f.unit === schedule.unit && f.interval === schedule.interval,
    );
    if (preset) return preset.name;
    const unit =
      schedule.interval === 1
        ? schedule.unit?.toLowerCase()
        : `${schedule.unit?.toLowerCase()}s`;
    return `Every ${schedule.interval} ${unit}`;
  }, [schedule.unit, schedule.interval]);

  const isAuto = schedule.behaviour === "AUTO_LOG";

  return (
    <>
      <CarouselItem
        className={`${count > 1 ? "basis-[90%]" : "basis-full"} pl-4 2xl:basis-1/2`}
      >
        <Card className="flex h-28 flex-col justify-between rounded-lg bg-muted/20 p-4 shadow-none transition-colors hover:bg-muted/40">
          {/* Row 1: icon · description · amount · menu */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70"
              aria-hidden="true"
            >
              <CategoryIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="truncate text-sm font-semibold leading-tight"
                title={schedule.description}
              >
                {schedule.description}
              </p>
              <p className="mt-1 truncate text-xs leading-tight text-muted-foreground">
                {schedule.category?.name}
              </p>
            </div>

            <p
              className={cn(
                "shrink-0 text-[15px] font-semibold tabular-nums",
                tone.text,
              )}
            >
              {tone.prefix}
              {formatCurrency(Number(schedule.amount ?? 0), currency)}
            </p>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  className="-mr-2 h-8 w-7 shrink-0 p-0 text-muted-foreground"
                  variant="ghost"
                  type="button"
                  aria-label="Schedule options"
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
                  onClick={() => onDelete?.(schedule)}
                  disabled={!onDelete}
                >
                  <Icons.Ban className="mr-2 h-4 w-4" />
                  Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Row 2: frequency · behaviour · next due */}
          <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-3 text-xs text-muted-foreground">
            <span className="flex min-w-0 items-center gap-1.5">
              <Icons.Repeat className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{frequencyLabel}</span>
              <span aria-hidden>·</span>
              <span className="shrink-0">{isAuto ? "Auto" : "Remind"}</span>
            </span>
            <span
              className={cn(
                "flex shrink-0 items-center gap-1 font-medium tabular-nums",
                due.tone,
              )}
            >
              <Icons.CalendarClock className="h-3.5 w-3.5" aria-hidden />
              {due.label}
            </span>
          </div>
        </Card>
      </CarouselItem>

      {/* ── Edit dialog ───────────────────────────────────────────── */}
      <TransactionDialog
        open={open}
        setOpen={setOpen}
        mode="edit"
        rowData={schedule}
      />
    </>
  );
});

ScheduleCard.displayName = "ScheduleCard";

export default ScheduleCard;
