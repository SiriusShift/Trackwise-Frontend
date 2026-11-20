import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Schedule, ScheduleType } from "@/shared/types";
import { formatCurrency, hexToRgba } from "@/shared/utils/CustomFunctions";
import { getLucideIcon } from "@/shared/utils/icons";
import {
  getDueInfo,
  getFrequencyLabel,
  getMonthlyEquivalent,
  getScheduleColor,
} from "@/shared/utils/schedule";
import {
  ArrowRight,
  Ban,
  Bell,
  CalendarClock,
  EllipsisVertical,
  Eye,
  Pause,
  Pencil,
  Play,
  Repeat,
  Zap,
} from "lucide-react";
import moment from "moment";
import { memo } from "react";
import { RECURRING_COLS } from "./recurringColumns";

// Amount colour + sign per type — mirrors ScheduleCard / TransactionItem
const TYPE_TONES: Record<ScheduleType, { text: string; prefix: string }> = {
  Expense: { text: "text-foreground", prefix: "−" },
  Income: { text: "text-success", prefix: "+" },
  Transfer: { text: "text-primary", prefix: "" },
};

// Tinted pill for due dates that need attention
const DUE_PILL: Record<string, string> = {
  "text-destructive": "bg-destructive/10",
  "text-warning": "bg-warning/10",
};

export const RecurringListHeader = ({ ended = false }: { ended?: boolean }) => (
  <div
    className={cn(
      RECURRING_COLS.row,
      "hidden border-b bg-muted/30 py-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground md:flex",
    )}
    aria-hidden
  >
    <span className={cn(RECURRING_COLS.icon, "shrink-0")} />
    <span className="min-w-0 flex-1">Schedule</span>
    <span className={RECURRING_COLS.frequency}>Frequency</span>
    <span className={RECURRING_COLS.due}>{ended ? "Ended" : "Next due"}</span>
    <span className={RECURRING_COLS.amount}>Amount</span>
    <span className={RECURRING_COLS.menu} />
  </div>
);

export interface RecurringRowActions {
  onView: (schedule: Schedule) => void;
  onEdit: (schedule: Schedule) => void;
  onTogglePause: (schedule: Schedule) => void;
  onCancel: (schedule: Schedule) => void;
}

interface RecurringRowProps extends RecurringRowActions {
  schedule: Schedule;
  baseCurrency: string;
}

const getRowStatus = (schedule: Schedule) =>
  schedule.isActive === false ? "ENDED" : (schedule.status ?? "ACTIVE");

const RecurringRow = memo(
  ({
    schedule,
    baseCurrency,
    onView,
    onEdit,
    onTogglePause,
    onCancel,
  }: RecurringRowProps) => {
    const status = getRowStatus(schedule);
    const isEnded = status === "ENDED";
    const isPaused = status === "PAUSED";

    const tone = TYPE_TONES[schedule.type] ?? TYPE_TONES.Transfer;
    const Icon = getLucideIcon(schedule.category?.icon);
    const color = getScheduleColor({
      type: schedule.type,
      source: "RECURRING",
      category: schedule.category,
    });
    const currency = schedule.fromAsset?.currency ?? baseCurrency;

    const amount = Number(schedule.amount ?? 0);
    const monthly = getMonthlyEquivalent(schedule);
    // Only worth showing when it differs from the amount itself
    const showMonthly = monthly > 0 && Math.abs(monthly - amount) > 0.005;

    const frequency = getFrequencyLabel(
      Number(schedule.interval),
      schedule.unit,
      schedule.daysOfMonth,
    );

    const due = isEnded
      ? {
          label: `Ended ${moment(schedule.endedAt ?? schedule.endDate ?? schedule.nextDueDate).format("MMM D, YYYY")}`,
          tone: "text-muted-foreground",
        }
      : isPaused
        ? { label: "Paused", tone: "text-muted-foreground" }
        : getDueInfo(schedule.nextDueDate);

    const accounts =
      schedule.type === "Transfer" ? (
        <>
          {schedule.fromAsset?.name ?? "—"}
          <ArrowRight className="mx-0.5 inline h-3 w-3 align-[-2px]" aria-label="to" />
          {schedule.toAsset?.name ?? "—"}
        </>
      ) : (
        (schedule.fromAsset?.name ?? "No account")
      );

    return (
      <li
        className={cn(
          RECURRING_COLS.row,
          "group py-3 outline-none transition-colors",
          !isEnded &&
            "cursor-pointer hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
          (isPaused || isEnded) && "opacity-70",
        )}
        onClick={() => !isEnded && onView(schedule)}
        onKeyDown={(e) => {
          if (!isEnded && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onView(schedule);
          }
        }}
        tabIndex={isEnded ? -1 : 0}
        aria-label={`${schedule.description}, ${frequency}`}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: hexToRgba(color, 0.12), color }}
          aria-hidden
        >
          <Icon className="h-5 w-5" />
        </span>

        {/* name · category · account */}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <p
              className="truncate text-sm font-semibold leading-tight"
              title={schedule.description}
            >
              {schedule.description}
            </p>
            {isPaused && (
              <Badge variant="secondary" className="shrink-0 px-1.5 py-0 text-[10px]">
                Paused
              </Badge>
            )}
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {schedule.category?.name}
            <span aria-hidden> · </span>
            {accounts}
          </p>
          {/* Phones: frequency + due under the name */}
          <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground md:hidden">
            <Repeat className="h-3 w-3 shrink-0" aria-hidden />
            <span className="truncate">{frequency}</span>
            <span aria-hidden>·</span>
            <span className={cn("shrink-0 font-medium", due.tone)}>{due.label}</span>
          </p>
        </div>

        {/* frequency · behaviour (md+) */}
        <div
          className={cn(
            RECURRING_COLS.frequency,
            "min-w-0 flex-col gap-1 text-xs text-muted-foreground",
          )}
        >
          <span className="flex items-center gap-1.5 truncate text-foreground/80">
            <Repeat className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">{frequency}</span>
          </span>
          <span className="flex items-center gap-1.5">
            {schedule.behaviour === "AUTO_LOG" ? (
              <>
                <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Logs automatically
              </>
            ) : (
              <>
                <Bell className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Reminds you
              </>
            )}
          </span>
        </div>

        {/* next due (md+) */}
        <div className={RECURRING_COLS.due}>
          <span
            className={cn(
              "inline-flex max-w-full items-center gap-1.5 rounded-md text-xs font-medium tabular-nums",
              due.tone,
              DUE_PILL[due.tone] && cn("px-2 py-1", DUE_PILL[due.tone]),
            )}
          >
            <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">{due.label}</span>
          </span>
        </div>

        {/* amount */}
        <div className={cn(RECURRING_COLS.amount, "flex flex-col items-end")}>
          <span className={cn("text-sm font-semibold tabular-nums sm:text-[15px]", tone.text)}>
            {tone.prefix}
            {formatCurrency(amount, currency)}
          </span>
          {showMonthly && (
            <span className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
              ≈ {formatCurrency(monthly, currency, "symbol", 0)}/mo
            </span>
          )}
        </div>

        {isEnded ? (
          // Keeps ended rows' columns aligned with rows that have a menu
          <span className={cn(RECURRING_COLS.menu, "h-8")} aria-hidden />
        ) : (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="-mr-2 h-8 w-8 shrink-0 p-0 text-muted-foreground"
                aria-label={`Options for ${schedule.description}`}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onSelect={() => onView(schedule)}>
                <Eye className="mr-2 h-4 w-4" />
                Details & history
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEdit(schedule)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onTogglePause(schedule)}>
                {isPaused ? (
                  <Play className="mr-2 h-4 w-4" />
                ) : (
                  <Pause className="mr-2 h-4 w-4" />
                )}
                {isPaused ? "Resume" : "Pause"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => onCancel(schedule)}
              >
                <Ban className="mr-2 h-4 w-4" />
                Stop schedule
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </li>
    );
  },
);

RecurringRow.displayName = "RecurringRow";

export default RecurringRow;
