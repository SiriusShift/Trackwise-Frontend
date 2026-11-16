import { IRootState } from "@/app/store";
import { useGetRecurringQuery } from "@/features/transactions/api/transaction/recurringApi";
import { cn } from "@/lib/utils";
import { useGetCategoryLimitQuery } from "@/shared/api/categoryApi";
import CommonPieGraph from "@/shared/components/charts/CommonPieGraph";
import Tracker from "@/shared/components/Tracker/TrackerWidget";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { CategoryLimit, Schedule } from "@/shared/types";
import {
  formatCurrency,
  formatDateDisplay,
  formatMode,
} from "@/shared/utils/CustomFunctions";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  ChevronRight,
} from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Spending past this share of the budget turns the bar amber
const BUDGET_WARNING_RATIO = 0.85;
const LEGEND_LIMIT = 3;

interface GraphSlice {
  categoryName: string;
  total: number | string;
  color: string;
}

// The API may send totals pre-formatted ("1,234.50"), so strip separators
const toNumber = (value: unknown) =>
  Number(String(value ?? 0).replace(/,/g, "")) || 0;

const BudgetLine = ({ type, onOpen }: { type: string; onOpen: () => void }) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const active = useSelector((state: IRootState) => state.active.active);
  const { data, isLoading } = useGetCategoryLimitQuery(
    {
      startDate: moment(active?.from).toDate()?.toISOString(),
      endDate: moment(active?.to).toDate()?.toISOString(),
    },
    { skip: type !== "Expense" },
  );

  if (type !== "Expense") return null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2" aria-hidden>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-1.5 w-full" />
      </div>
    );
  }

  const limits: CategoryLimit[] = data ?? [];

  if (!limits.length) {
    return (
      <button
        type="button"
        onClick={onOpen}
        data-tour="budget"
        className="flex items-center justify-between gap-2 rounded-lg text-left text-sm font-medium text-primary outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      >
        Set a monthly budget
        <ChevronRight className="h-4 w-4" />
      </button>
    );
  }

  // Overall budget = every category limit added together
  const limit = limits.reduce((sum, item) => sum + toNumber(item.value), 0);
  const used = limits.reduce((sum, item) => sum + toNumber(item.total), 0);
  const left = limit - used;
  const ratio = limit > 0 ? used / limit : 0;
  const isOver = left < 0;
  const isClose = !isOver && ratio >= BUDGET_WARNING_RATIO;
  const percent = Math.round(ratio * 100);

  return (
    <button
      type="button"
      onClick={onOpen}
      data-tour="budget"
      className="flex flex-col gap-1.5 rounded-lg text-left outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex w-full items-center justify-between gap-2 text-sm">
        <span className="text-muted-foreground">Monthly budget</span>
        <span
          className={cn(
            "flex items-center gap-1 font-semibold tabular-nums",
            isOver && "text-destructive",
          )}
        >
          {isOver
            ? `${formatCurrency(Math.abs(left), currency)} over`
            : `${formatCurrency(left, currency)} left`}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </span>
      </span>
      <span
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Budget used"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(percent, 100)}
      >
        <span
          className={cn(
            "block h-full rounded-full",
            isOver ? "bg-destructive" : isClose ? "bg-warning" : "bg-primary",
          )}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </span>
      <span
        className={cn(
          "text-xs",
          isOver ? "font-medium text-destructive" : "text-muted-foreground",
        )}
      >
        {percent}% of {formatCurrency(limit, currency)} used
      </span>
    </button>
  );
};

const UpcomingRow = ({ type }: { type: string }) => {
  const navigate = useNavigate();
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const { data, isLoading } = useGetRecurringQuery(type);

  const { activeCount, dueSoon } = useMemo(() => {
    const schedules: Schedule[] = data ?? [];
    const weekEnd = moment().add(7, "days").endOf("day");
    const due = schedules
      .filter(
        (schedule) =>
          schedule.nextDueDate &&
          moment(schedule.nextDueDate).isSameOrBefore(weekEnd),
      )
      .sort(
        (a, b) =>
          moment(a.nextDueDate).valueOf() - moment(b.nextDueDate).valueOf(),
      );
    return { activeCount: schedules.length, dueSoon: due };
  }, [data]);

  if (isLoading) return <Skeleton className="h-14 w-full rounded-2xl" />;
  if (!activeCount) return null;

  const next = dueSoon[0];

  return (
    <button
      type="button"
      onClick={() => navigate("/calendar")}
      data-tour="schedule"
      className="flex w-full items-center gap-3 rounded-2xl border bg-card px-3 py-2.5 text-left outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary"
      >
        <CalendarClock className="h-4.5 w-4.5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-semibold">
          {dueSoon.length
            ? `${dueSoon.length} upcoming this week`
            : `${activeCount} active ${activeCount === 1 ? "schedule" : "schedules"}`}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {next
            ? `Next: ${next.description} · ${moment(next.nextDueDate).format("ddd, MMM D")} · ${formatCurrency(toNumber(next.amount), currency)}`
            : "Nothing due in the next 7 days"}
        </span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
};

// Phone-only block above the list: period total, category split, budget, and
// what is due soon. Replaces the pie chart, tracker and schedule widgets that
// used to sit below the list.
const MobileSummary = ({
  type,
  graphData,
  graphLoading,
  showBreakdown,
}: {
  type: string;
  graphData?: {
    total?: number | string;
    trend?: number | string;
    data?: GraphSlice[];
  } | null;
  graphLoading: boolean;
  // Transfers and archived rows have no breakdown
  showBreakdown: boolean;
}) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const period = formatDateDisplay();
  const modeLabel = formatMode();
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);

  const slices = useMemo(
    () =>
      (graphData?.data ?? [])
        .map((slice) => ({ ...slice, value: toNumber(slice.total) }))
        .filter((slice) => slice.value > 0)
        .sort((a, b) => b.value - a.value),
    [graphData?.data],
  );
  const sliceTotal = slices.reduce((sum, slice) => sum + slice.value, 0);

  const trend = Number(graphData?.trend);
  const hasTrend = Number.isFinite(trend) && trend !== 0;
  // More spending is bad news; more income is good news
  const trendIsGood = type === "Expense" ? trend < 0 : trend > 0;
  const TrendIcon = trend > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="flex flex-col gap-3">
      {showBreakdown && (
        <section
          aria-label={`${type} summary`}
          data-tour="graph"
          className="flex flex-col gap-3 rounded-2xl border bg-card p-4"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-muted-foreground">
              {type === "Income" ? "Earned" : "Spent"} · {period}
            </span>
            {graphLoading ? (
              <Skeleton className="h-8 w-40" />
            ) : (
              <div className="flex flex-wrap items-baseline gap-x-2.5">
                <span className="text-[28px] font-bold leading-tight tabular-nums">
                  {formatCurrency(toNumber(graphData?.total), currency)}
                </span>
                {hasTrend && (
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-semibold",
                      trendIsGood ? "text-success" : "text-destructive",
                    )}
                  >
                    <TrendIcon className="h-3 w-3" aria-hidden />
                    {Math.abs(trend)}% vs last {modeLabel}
                  </span>
                )}
              </div>
            )}
          </div>

          {!graphLoading && slices.length > 0 && (
            <>
              <div
                className="flex h-2 gap-0.5 overflow-hidden rounded"
                role="img"
                aria-label={`${type} by category: ${slices
                  .map(
                    (slice) =>
                      `${slice.categoryName} ${Math.round((slice.value / sliceTotal) * 100)}%`,
                  )
                  .join(", ")}`}
              >
                {slices.map((slice) => (
                  <span
                    key={slice.categoryName}
                    className="h-full"
                    style={{
                      width: `${(slice.value / sliceTotal) * 100}%`,
                      backgroundColor: slice.color,
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {slices.slice(0, LEGEND_LIMIT).map((slice) => (
                  <span
                    key={slice.categoryName}
                    className="flex min-w-0 items-center gap-1.5"
                  >
                    <span
                      aria-hidden
                      className="h-2 w-2 shrink-0 rounded-sm"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="truncate">
                      {slice.categoryName}{" "}
                      {Math.round((slice.value / sliceTotal) * 100)}%
                    </span>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setBreakdownOpen(true)}
                  className="ml-auto flex shrink-0 items-center font-semibold text-primary outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Breakdown
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          )}

          {type === "Expense" && (
            <>
              <div className="h-px bg-border" />
              <BudgetLine type={type} onOpen={() => setBudgetOpen(true)} />
            </>
          )}
        </section>
      )}

      <UpcomingRow type={type} />

      <Drawer open={breakdownOpen} onOpenChange={setBreakdownOpen}>
        <DrawerContent>
          <DrawerHeader className="sr-only">
            <DrawerTitle>{type} breakdown</DrawerTitle>
            <DrawerDescription>{period}</DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[80dvh] overflow-y-auto p-4 pb-8">
            <CommonPieGraph
              total={graphData?.total}
              trend={graphData?.trend}
              type={type}
              graphLoading={graphLoading}
              data={graphData?.data}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={budgetOpen} onOpenChange={setBudgetOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Budget</DrawerTitle>
            <DrawerDescription>Category limits for {period}</DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[75dvh] overflow-y-auto p-4 pb-8">
            <Tracker />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileSummary;
