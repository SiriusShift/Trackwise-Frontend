import { IRootState } from "@/app/store";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";
import { ScheduledItem } from "@/shared/types";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { getScheduleColor } from "@/shared/utils/schedule";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import { type DateClickArg } from "@fullcalendar/interaction";
import * as LucideIcon from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyGetSchedulesQuery } from "../api/transaction/schedulesApi";
import {
  ScheduleEvent,
  UpcomingSchedulesSidebar,
} from "../components/SchedulesSidebar";
import { summarizeSchedules } from "../utils/calendarSummary";

type ScheduleFilter = "All" | "Expense" | "Income" | "Transfer" | "Credit";

const FILTERS: ScheduleFilter[] = [
  "All",
  "Expense",
  "Income",
  "Transfer",
  "Credit",
];

const matchesFilter = (item: ScheduledItem, filter: ScheduleFilter) => {
  if (filter === "All") return true;
  if (filter === "Credit") return item.source === "CREDIT_STATEMENT";
  return item.source === "RECURRING" && item.type === filter;
};

const CalendarPage = () => {
  const [monthRange, setMonthRange] = useState({ start: "", end: "" });
  const [title, setTitle] = useState("");
  const [viewMonth, setViewMonth] = useState(() => moment().startOf("month"));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filter, setFilter] = useState<ScheduleFilter>("All");
  const currency = useSelector((state: IRootState) => state.settings.currency);

  // Desktop renders event chips; mobile renders dots inside the day cells.
  // Events are not passed to FullCalendar on mobile, because its dayMaxEvents
  // can hide them on short cells and leave only the "+N" link.
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === "undefined"
      ? true
      : window.matchMedia("(min-width: 1024px)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(query.matches);
    onChange();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const calendarRef = useRef<FullCalendar>(null);
  const [trigger, { data, isFetching }] = useLazyGetSchedulesQuery();

  const navigateCalendar = (action: "prev" | "next" | "today") =>
    calendarRef.current?.getApi()?.[action]();

  useEffect(() => {
    if (!monthRange.start || !monthRange.end) return;
    trigger({ dateFrom: monthRange.start, dateTo: monthRange.end }, true);
  }, [monthRange.start, monthRange.end, trigger]);

  // Items for the current filter across the fetched range (grid padding included).
  const filteredItems = useMemo(
    () => data?.filter((item) => matchesFilter(item, filter)) ?? [],
    [data, filter],
  );

  const events: ScheduleEvent[] = useMemo(
    () =>
      filteredItems.map((item) => ({
        id: item.key,
        title: item.description,
        start: item.dueDate,
        allDay: true as const,
        extendedProps: { item },
      })),
    [filteredItems],
  );

  // Summary strip counts only the month being viewed, not the padding days.
  const monthItems = useMemo(
    () =>
      filteredItems.filter((item) =>
        moment(item.dueDate).isSame(viewMonth, "month"),
      ),
    [filteredItems, viewMonth],
  );

  const summary = useMemo(() => summarizeSchedules(monthItems), [monthItems]);

  // Per-day count, total and items for the day cells.
  const dayTotals = useMemo(() => {
    const map = new Map<
      string,
      { count: number; total: number; items: ScheduledItem[] }
    >();
    for (const item of filteredItems) {
      const key = moment(item.dueDate).format("YYYY-MM-DD");
      const entry = map.get(key) ?? { count: 0, total: 0, items: [] };
      entry.count += 1;
      entry.total += item.amount ?? 0;
      entry.items.push(item);
      map.set(key, entry);
    }
    return map;
  }, [filteredItems]);

  const today = moment();

  // Derived, not stored: sidebar shows only the selected day's items,
  // or everything in range when no day is selected.
  const displayedEvents = useMemo(() => {
    if (!selectedDate) return events;
    return events.filter((event) =>
      moment(event.start).isSame(selectedDate, "day"),
    );
  }, [events, selectedDate]);

  const handleDateClick = (info: DateClickArg) => {
    const clicked = moment(info.date).format("YYYY-MM-DD");
    // Clicking the already-selected date deselects it.
    setSelectedDate((prevDate) => (prevDate === clicked ? null : clicked));
  };

  const money = (value: number) => formatCurrency(value, currency, "symbol", 0);
  const net = summary.net;

  const stats = [
    {
      label: "Out this month",
      value: money(summary.outgoing),
      className: "",
    },
    {
      label: "In this month",
      value: money(summary.incoming),
      className: "text-emerald-600",
    },
    {
      label: "Net",
      value: `${net >= 0 ? "+" : "−"}${money(Math.abs(net))}`,
      className: net >= 0 ? "text-emerald-600" : "text-destructive",
    },
    {
      label: "Card bills due",
      value: money(summary.cardBills),
      className: "",
      sub: summary.projectedCount
        ? `${summary.projectedCount} projected`
        : undefined,
    },
  ];

  const selectedLabel = selectedDate
    ? moment(selectedDate).format("dddd, MMM D")
    : undefined;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)]">
      {/* Calendar */}
      <div className="flex flex-1 flex-col p-4 min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigateCalendar("prev")}>
              <LucideIcon.ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigateCalendar("today")}>
              Today
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => navigateCalendar("next")}
            >
              <LucideIcon.ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary strip */}
        <div className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-3">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p
                className={cn(
                  "mt-1 text-lg font-bold tabular-nums",
                  stat.className,
                )}
              >
                {stat.value}
              </p>
              {stat.sub && (
                <p className="text-[11px] text-muted-foreground">{stat.sub}</p>
              )}
            </Card>
          ))}
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((option) => (
              <Button
                key={option}
                size="sm"
                variant={filter === option ? "default" : "outline"}
                className="h-7 rounded-full px-3 text-xs"
                onClick={() => setFilter(option)}
              >
                {option}
              </Button>
            ))}
          </div>

          <div className="hidden flex-wrap items-center gap-3 text-xs text-muted-foreground lg:flex">
            <span className="inline-flex items-center gap-1.5">
              <i className="h-2.5 w-4 rounded-sm border-l-[3px] border-solid border-primary bg-primary/10" />
              Scheduled
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="h-2.5 w-4 rounded-sm border-l-[3px] border-dashed border-primary bg-primary/10 opacity-60" />
              Projected
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="h-1.5 w-1.5 rounded-full bg-destructive" />
              Overdue / failed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
              Due today
            </span>
          </div>
        </div>

        <div
          className="min-h-0 flex-1"
          style={
            {
              "--fc-event-bg-color": "transparent",
              "--fc-event-border-color": "transparent",
              "--fc-event-text-color": "inherit",
            } as React.CSSProperties
          }
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
            initialView={"dayGridMonth"}
            fixedWeekCount={false}
            showNonCurrentDates
            headerToolbar={false}
            expandRows
            height="100%"
            datesSet={(info) => {
              setTitle(info.view.title);
              setViewMonth(moment(info.view.currentStart).startOf("month"));
              setMonthRange({
                start: moment(info.start).startOf("day").toISOString(),
                end: moment(info.end)
                  .subtract(1, "day")
                  .endOf("day")
                  .toISOString(),
              });
              // Selection belonged to the previous month view.
              setSelectedDate(null);
            }}
            events={isDesktop ? events : []}
            dayCellClassNames={(arg) => {
              const isSelected =
                selectedDate && moment(arg.date).isSame(selectedDate, "day");
              return isSelected ? ["bg-primary/10"] : [];
            }}
            dayCellContent={(arg) => {
              const day = dayTotals.get(moment(arg.date).format("YYYY-MM-DD"));
              return (
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-start justify-between gap-1">
                    <span>{arg.dayNumberText}</span>
                    {day && isDesktop && (
                      <span className="mt-0.5 truncate text-[10px] font-semibold text-muted-foreground tabular-nums">
                        {day.count} · {money(day.total)}
                      </span>
                    )}
                  </div>
                  {day && !isDesktop && (
                    <div className="flex flex-wrap justify-center gap-0.5">
                      {day.items.slice(0, 4).map((item) => (
                        <i
                          key={item.key}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: getScheduleColor(item) }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            }}
            eventContent={(arg) => {
              const item = arg.event.extendedProps.item as ScheduledItem;
              const color = getScheduleColor(item);

              const dueDate = moment(arg.event.start);
              const isOverdue =
                !item.projected && dueDate.isBefore(today, "day");
              const isDueToday = dueDate.isSame(today, "day");

              return (
                <>
                  <div
                    className={cn(
                      "flex w-full items-center gap-1.5 truncate px-2 py-1 text-xs font-medium",
                      item.projected && "opacity-60",
                    )}
                    style={{
                      backgroundColor: `${color}26`,
                      borderLeft: `3px ${item.projected ? "dashed" : "solid"} ${color}`,
                      color,
                    }}
                  >
                    {(isOverdue || isDueToday || item.needsAttention) && (
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          isOverdue || item.needsAttention
                            ? "bg-destructive"
                            : "bg-yellow-500"
                        }`}
                      />
                    )}
                    {item.source === "CREDIT_STATEMENT" && (
                      <LucideIcon.CreditCard className="h-3 w-3 shrink-0" />
                    )}
                    {item.type === "Income" && (
                      <LucideIcon.ArrowDownLeft className="h-3 w-3 shrink-0" />
                    )}
                    {item.source === "RECURRING" && item.type === "Transfer" && (
                      <LucideIcon.ArrowLeftRight className="h-3 w-3 shrink-0" />
                    )}
                    <span className="truncate">{arg.event.title}</span>
                    {!!item.installments?.length && (
                      <span
                        className="ml-auto shrink-0 rounded-full bg-background/60 px-1.5 text-[10px] leading-4"
                        title={item.installments
                          .map(
                            (i) =>
                              `${i.description} ${i.installmentNo}/${i.termMonths}`,
                          )
                          .join(", ")}
                      >
                        {item.installments.length} inst.
                      </span>
                    )}
                  </div>
                </>
              );
            }}
            moreLinkContent={(arg) => (
              <div className="w-full truncate rounded px-2 py-1 text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80">
                +{arg.num} more
              </div>
            )}
            moreLinkClick="popover"
            dateClick={handleDateClick}
            dayMaxEvents={true}
          />
        </div>
      </div>

      {/* Sidebar */}
      <UpcomingSchedulesSidebar
        events={displayedEvents}
        isFetching={isFetching}
        heading={selectedLabel ?? "Scheduled"}
        subtitle={
          isFetching
            ? undefined
            : `${displayedEvents.length} item${displayedEvents.length === 1 ? "" : "s"}${selectedDate ? "" : ` in ${viewMonth.format("MMMM")}`}`
        }
        showDayHeaders={!selectedDate}
        onShowAll={selectedDate ? () => setSelectedDate(null) : undefined}
      />
    </div>
  );
};

export default CalendarPage;
