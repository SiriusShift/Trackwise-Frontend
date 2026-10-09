import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { ScheduledItem } from "@/shared/types";
import { getScheduleColor } from "@/shared/utils/schedule";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import { type DateClickArg } from "@fullcalendar/interaction";
import * as LucideIcon from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLazyGetSchedulesQuery } from "../api/transaction/schedulesApi";
import {
  ScheduleEvent,
  UpcomingSchedulesSidebar,
} from "../components/SchedulesSidebar";

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filter, setFilter] = useState<ScheduleFilter>("All");

  const calendarRef = useRef<FullCalendar>(null);
  const [trigger, { data, isFetching }] = useLazyGetSchedulesQuery();

  const navigateCalendar = (action: "prev" | "next" | "today") =>
    calendarRef.current?.getApi()?.[action]();

  useEffect(() => {
    if (!monthRange.start || !monthRange.end) return;
    trigger({ dateFrom: monthRange.start, dateTo: monthRange.end }, true);
  }, [monthRange.start, monthRange.end, trigger]);

  const events: ScheduleEvent[] = useMemo(
    () =>
      data
        ?.filter((item) => matchesFilter(item, filter))
        .map((item) => ({
          id: item.key,
          title: item.description,
          start: item.dueDate,
          allDay: true as const,
          extendedProps: { item },
        })) ?? [],
    [data, filter],
  );

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

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)]">
      {/* Calendar */}
      <div className="flex flex-1 flex-col p-4 ">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold">{title}</h2>
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

        <div className="mb-3 flex flex-wrap gap-1.5">
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
            events={events}
            dayCellClassNames={(arg) => {
              const isSelected =
                selectedDate && moment(arg.date).isSame(selectedDate, "day");
              return isSelected ? ["bg-primary/10"] : [];
            }}
            eventContent={(arg) => {
              const item = arg.event.extendedProps.item as ScheduledItem;
              const color = getScheduleColor(item);

              const dueDate = moment(arg.event.start);
              const isOverdue =
                !item.projected && dueDate.isBefore(today, "day");
              const isDueToday = dueDate.isSame(today, "day");

              return (
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
                </div>
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
      />
    </div>
  );
};

export default CalendarPage;
