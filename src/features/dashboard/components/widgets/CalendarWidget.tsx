import { IRootState } from "@/app/store";
import { useGetSchedulesQuery } from "@/features/transactions/api/transaction/schedulesApi";
import { cn } from "@/lib/utils";
import ScheduleDialog from "@/shared/components/dialog/ScheduleDialog/ScheduleDialog";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ScheduledItem } from "@/shared/types";
import {
  findNextScheduled,
  formatCurrency,
} from "@/shared/utils/CustomFunctions";
import { getAmountPrefix, getScheduleSubtitle } from "@/shared/utils/schedule";
import * as Icons from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const getStatus = (date?: moment.MomentInput) => {
  const today = moment();
  const due = moment(date);
  if (due.isBefore(today, "day"))
    return {
      label: "Overdue",
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/40",
      dot: "bg-red-500",
      border: "border-red-200 dark:border-red-900",
    };
  if (due.isSame(today, "day"))
    return {
      label: "Due Today",
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      dot: "bg-amber-400",
      border: "border-amber-200 dark:border-amber-900",
    };
  if (due.diff(today, "day") <= 7)
    return {
      label: "Due Soon",
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/40",
      dot: "bg-orange-400",
      border: "border-orange-200 dark:border-orange-900",
    };
  return {
    label: "Upcoming",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    dot: "bg-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900",
  };
};

// Week strip: the active period padded out to whole weeks, starting on the
// user's week start day (moment's locale is synced to it in the store).
const buildStripDays = (from: string, to: string) => {
  const start = moment(from).startOf("week");
  const end = moment(to).endOf("week");
  const count = end.diff(start, "days") + 1;
  return Array.from({ length: count }, (_, i) => start.clone().add(i, "days"));
};

type ItemFilter = "all" | "pending" | "partial" | "overdue";

const FILTERS: { label: string; value: ItemFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Partial", value: "partial" },
  { label: "Overdue", value: "overdue" },
];

// Each item lands in exactly one bucket: overdue wins, then partially paid
// card bills, everything else is pending.
const getItemBucket = (item: ScheduledItem): Exclude<ItemFilter, "all"> => {
  if (moment(item.dueDate).isBefore(moment(), "day")) return "overdue";
  if (item.status === "PARTIAL") return "partial";
  return "pending";
};

export default function CalendarWidget() {
  const [open, setOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<ScheduledItem | null>(null);
  const [filter, setFilter] = useState<ItemFilter>("all");

  const active = useSelector((state: IRootState) => state.active.active);
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const weekStartDay = useSelector(
    (state: IRootState) => state.settings.weekStartDay,
  );
  // Everything that needs the user (bills, income to confirm, transfers,
  // credit card statements) up to the end of the active period, incl. overdue.
  const { data, isLoading } = useGetSchedulesQuery({
    dateTo: active.to,
    actionable: true,
  });

  const stripDays = useMemo(
    () => buildStripDays(active.from, active.to),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active.from, active.to, weekStartDay],
  );

  // Open on the week containing today, or the period's first week if today is outside it.
  const todayInPeriod = moment().isBetween(active.from, active.to, "day", "[]");
  // Embla's startIndex is a snap index; with slidesToScroll: 7 each snap is one week.

  const [selectedDay, setSelectedDay] = useState(() =>
    todayInPeriod ? moment() : moment(active.from),
  );

  const startWeek = selectedDay
    ? Math.floor(moment(selectedDay).diff(stripDays[0], "days") / 7)
    : 0;

  // The feed only holds outstanding items (paid ones drop out), so an empty
  // day means "nothing left to do", not "nothing was ever due".
  const daySummary = useMemo(() => {
    const events =
      data?.filter((item) => moment(item.dueDate).isSame(selectedDay, "day")) ??
      [];
    let due = 0; // money going out: expenses, transfers, card bills
    let incoming = 0; // income waiting to be confirmed
    events.forEach((item) => {
      const amount = Number(item.amount ?? 0);
      if (item.type === "Income") incoming += amount;
      else due += amount;
    });
    return { count: events.length, due, incoming };
  }, [data, selectedDay]);

  // Items from days before today that are still open.
  const overdueCount = useMemo(
    () =>
      data?.filter((item) => moment(item.dueDate).isBefore(moment(), "day"))
        .length ?? 0,
    [data],
  );

  const isSelectedToday = selectedDay.isSame(moment(), "day");

  // The list under the strip: the selected day's items, plus anything still
  // open from earlier days when today is selected (matches "N overdue earlier").
  const dayItems = useMemo(
    () =>
      data?.filter((item) => {
        const due = moment(item.dueDate);
        return (
          due.isSame(selectedDay, "day") ||
          (isSelectedToday && due.isBefore(moment(), "day"))
        );
      }) ?? [],
    [data, selectedDay, isSelectedToday],
  );

  const filterCounts = useMemo(() => {
    const counts: Record<ItemFilter, number> = {
      all: dayItems.length,
      pending: 0,
      partial: 0,
      overdue: 0,
    };
    dayItems.forEach((item) => counts[getItemBucket(item)]++);
    return counts;
  }, [dayItems]);

  const nearestEvent = useMemo(
    () => findNextScheduled(selectedDay, data ?? []),
    [selectedDay, data],
  );

  const filteredItems =
    filter === "all"
      ? dayItems
      : dayItems.filter((item) => getItemBucket(item) === filter);
  const isSelectedFuture = selectedDay.isAfter(moment(), "day");

  useEffect(() => {
    const inPeriod = moment().isBetween(active.from, active.to, "day", "[]");
    setSelectedDay(inPeriod ? moment() : moment(active.from));
  }, [active.from, active.to]);

  // Distinct status dot colors per day (max 3), e.g. overdue / due soon / upcoming.
  const dotsByDay = useMemo(() => {
    const map: Record<string, string[]> = {};
    data?.forEach((item) => {
      const key = moment(item.dueDate).format("YYYY-MM-DD");
      const dot = getStatus(item.dueDate).dot;
      const dots = (map[key] ??= []);
      if (!dots.includes(dot) && dots.length < 3) dots.push(dot);
    });
    return map;
  }, [data]);

  const handleOpenBill = (bill: ScheduledItem) => {
    setSelectedBill(bill);
    setOpen(true);
  };

  const handleNextEvent = () => {
    setSelectedDay(moment(nearestEvent?.dueDate));
  };

  return (
    <>
      <Card
        className="relative overflow-hidden border border-border/60 bg-card
    p-4 sm:p-5 flex flex-col rounded-2xl shadow-xs col-span-full md:col-span-2 xl:col-span-1
    transition-shadow hover:shadow-md"
        data-tour="due"
      >
        {/* Header */}
        <CardHeader className="flex flex-row w-full justify-between p-0">
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-foreground flex flex-row gap-1 items-center">
            <span className="block text-sm font-semibold uppercase tracking-widest">
              Calendar
            </span>
          </CardTitle>
          <Link
            to="/calendar"
            className="text-xs font-medium text-primary hover:underline underline-offset-4 transition-opacity hover:opacity-80 shrink-0 -my-2 py-2 -mx-1 px-1"
          >
            See All →
          </Link>
        </CardHeader>

        {/* Body — centers content vertically when only 1 item */}
        <div className="flex-1 flex flex-col justify-start gap-2 mt-4">
          <Carousel
            // Remount when the period changes so Embla re-applies startIndex.
            key={`${active.from}-${active.to}`}
            className="w-full flex items-center gap-1"
            opts={{
              align: "start",
              slidesToScroll: 7,
              startIndex: startWeek,
            }}
          >
            <CarouselPrevious
              variant="ghost"
              className="static translate-y-0 shrink-0 h-8 w-6 hidden sm:inline-flex"
            >
              <Icons.ChevronLeft className="h-4 w-4" />
            </CarouselPrevious>
            <div className="flex-1 min-w-0">
              <CarouselContent className="-ml-1">
                {stripDays.map((day) => {
                  const key = day.format("YYYY-MM-DD");
                  const isToday = day.isSame(moment(), "day");
                  const isSelected = day.isSame(selectedDay, "day");
                  const dots = dotsByDay[key] ?? [];
                  const notInMonth =
                    day.isBefore(active.from) || day.isAfter(active.to);

                  return (
                    <CarouselItem key={key} className="pl-1 basis-[14.2857%]">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDay(day);
                          setFilter("all");
                        }}
                        disabled={notInMonth}
                        className={cn(
                          "w-full flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isSelected
                            ? "bg-foreground text-background"
                            : !notInMonth && "hover:bg-muted/60",
                          notInMonth ? "opacity-50" : "cursor-pointer",
                          isToday && !isSelected && "border-border",
                        )}
                      >
                        <span
                          className={cn(
                            "text-[10px] font-semibold uppercase sm:tracking-wider leading-none",
                            isSelected
                              ? "text-background/80"
                              : isToday
                                ? "text-primary"
                                : "text-muted-foreground",
                          )}
                        >
                          <span className="sm:hidden">
                            {day.format("dd").charAt(0)}
                          </span>
                          <span className="hidden sm:inline">
                            {day.format("ddd")}
                          </span>
                        </span>
                        <span className="text-base sm:text-lg font-bold leading-tight tabular-nums">
                          {day.format("D")}
                        </span>
                        <span className="flex h-1.5 items-center gap-0.5">
                          {dots.map((dot) => (
                            <span
                              key={dot}
                              className={cn("w-1.5 h-1.5 rounded-full", dot)}
                            />
                          ))}
                        </span>
                      </button>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </div>
            <CarouselNext
              variant="ghost"
              className="static translate-y-0 shrink-0 h-8 w-6 hidden sm:inline-flex"
            >
              <Icons.ChevronRight className="h-4 w-4" />
            </CarouselNext>
          </Carousel>
          <div className="flex-row flex justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {selectedDay.format("dddd, MMM D")}
                {isSelectedToday && " · Today"}
              </span>
              <span className="text-xs text-muted-foreground inline-flex gap-1 items-start">
                {isLoading ? (
                  "Loading…"
                ) : daySummary.count === 0 ? (
                  isSelectedFuture ? (
                    "Nothing scheduled"
                  ) : (
                    <span className="inline-flex items-center  gap-1 text-emerald-600">
                      <Icons.CheckCircle2 className="h-3 w-3" />
                      All clear
                    </span>
                  )
                ) : (
                  [
                    daySummary.due > 0 &&
                      `${formatCurrency(daySummary.due, currency, "symbol")} due`,
                    daySummary.incoming > 0 &&
                      `${formatCurrency(daySummary.incoming, currency, "symbol")} incoming`,
                  ]
                    .filter(Boolean)
                    .join(" · ")
                )}
                {isSelectedToday && overdueCount > 0 && (
                  <span className="inline-flex items-center gap-1">
                    ·
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {overdueCount} overdue earlier
                  </span>
                )}
              </span>
            </div>
            {dayItems.length > 0 && (
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value as ItemFilter)}
              >
                <SelectTrigger
                  className="w-32 shrink-0 text-xs h-8"
                  aria-label="Filter items"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {FILTERS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={
                          option.value !== "all" &&
                          filterCounts[option.value] === 0
                        }
                      >
                        {option.label} ({filterCounts[option.value]})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Items for the selected day */}
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))
          ) : dayItems?.length > 0 ? (
            <div className="space-y-2 max-h-34 overflow-y-auto -mx-1 px-1">
              {filteredItems.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No {filter} items for this day.
                </p>
              ) : (
                filteredItems.map((item) => {
                  const status = getStatus(item.dueDate);
                  const isEarlier = !moment(item.dueDate).isSame(
                    selectedDay,
                    "day",
                  );

                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => handleOpenBill(item)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg border-b border-border/50 last:border-b-0 hover:bg-muted/40 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    >
                      {/* <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-background border border-border/60">
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                      </div> */}

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {item.description}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {isEarlier && (
                            <span className="font-medium text-foreground/80">
                              {moment(item.dueDate).format("MMM D")} ·{" "}
                            </span>
                          )}
                          {getScheduleSubtitle(item)}
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <span className="text-sm font-bold tabular-nums">
                          {getAmountPrefix(item.type)}
                          {formatCurrency(item.amount, currency, "symbol")}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-border/60 text-muted-foreground">
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              status.dot,
                            )}
                          />
                          {item.status === "PARTIAL" ? "Partial" : status.label}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto flex flex-col h-full ">
              <div className="flex flex-1 flex-col justify-center items-center gap-1">
                <div className="p-2 bg-success/30 text-success rounded-full">
                  <Icons.Check />
                </div>
                <span className="text-xs font-bold">
                  Nothing due{" "}
                  {isSelectedToday
                    ? "today"
                    : `on ${moment(selectedDay).format("MMM DD")}`}
                </span>
              </div>
              {nearestEvent && (
                <button
                  type="button"
                  onClick={handleNextEvent}
                  className="w-full flex flex-row justify-between gap-3 border border-dashed items-center p-2 rounded-xl px-4 text-left hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-muted-foreground text-xs">
                      Next up ·{" "}
                      {moment(nearestEvent.dueDate).format("dddd, MMM D")}
                    </span>
                    <span className="text-sm truncate">
                      {nearestEvent.description}
                    </span>
                  </div>
                  <span className="font-bold text-sm tabular-nums inline-flex items-center shrink-0">
                    {formatCurrency(nearestEvent.amount, currency, "symbol")}
                    <Icons.ChevronRight className="h-4 w-4 text-muted-foreground ms-3" />
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </Card>
      <ScheduleDialog open={open} setOpen={setOpen} data={selectedBill} />
    </>
  );
}
