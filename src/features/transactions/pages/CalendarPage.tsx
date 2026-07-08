import { Button } from "@/shared/components/ui/button";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar, { type DateClickArg } from "@fullcalendar/react";
import * as LucideIcon from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLazyGetBillsQuery } from "../api/transaction/expensesApi";
import { UpcomingBillsSidebar } from "../components/BillsSidebar";

interface BillEvent {
  id: string;
  title: string;
  start: string;
  allDay: true;
  extendedProps: {
    amount: number;
    category?: {
      name?: string;
      color?: string;
      icon?: string;
    };
    description: string;
  };
}

const CalendarPage = () => {
  const [monthRange, setMonthRange] = useState({ start: "", end: "" });
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const calendarRef = useRef<FullCalendar>(null);
  const width = useScreenWidth();
  const [trigger, { data, isFetching }] = useLazyGetBillsQuery();

  const navigateCalendar = (action: "prev" | "next" | "today") =>
    calendarRef.current?.getApi()?.[action]();

  useEffect(() => {
    if (!monthRange.start || !monthRange.end) return;
    trigger({ dateFrom: monthRange.start, dateTo: monthRange.end }, true);
  }, [monthRange.start, monthRange.end, trigger]);

  const transformedData: BillEvent[] = useMemo(() => {
    return (
      data?.map((bill) => ({
        id: bill.id,
        title: bill.description,
        start: bill.nextDueDate,
        allDay: true as const,
        extendedProps: {
          amount: Number(bill.amount),
          category: bill.category,
          description: bill.description,
        },
      })) ?? []
    );
  }, [data]);

  const isMobile = width < 768;
  const today = moment();

  // Derived, not stored: sidebar shows only the selected day's bills,
  // or everything in range when no day is selected.
  const displayedEvents = useMemo(() => {
    if (!selectedDate) return transformedData;
    return transformedData.filter((event) =>
      moment(event.start).isSame(selectedDate, "day"),
    );
  }, [transformedData, selectedDate]);

  const handleDateClick = (info: DateClickArg) => {
    const clicked = moment(info.date).format("YYYY-MM-DD");
    // Clicking the already-selected date deselects it.
    setSelectedDate((prevDate) => (prevDate === clicked ? null : clicked));
  };

  const handleSelectBill = (event: BillEvent) => {
    // TODO: wire up to bill detail dialog
    console.log("selected bill", event.id);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)]">
      {/* Calendar */}
      <div className="flex flex-1 flex-col p-4 ">
        <div className="mb-4 flex items-center justify-between">
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
            events={transformedData}
            dayCellClassNames={(arg) => {
              const isSelected =
                selectedDate && moment(arg.date).isSame(selectedDate, "day");
              return isSelected ? ["bg-primary/10"] : [];
            }}
            eventContent={(arg) => {
              const category = arg.event.extendedProps?.category;
              const color = category?.color ?? "#94a3b8";

              const dueDate = moment(arg.event.start);
              const isOverdue = dueDate.isBefore(today, "day");
              const isDueToday = dueDate.isSame(today, "day");

              return (
                <div
                  className="flex w-full items-center gap-1.5 truncate px-2 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${color}26`,
                    borderLeft: `3px solid ${color}`,
                    color,
                  }}
                >
                  {(isOverdue || isDueToday) && (
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        isOverdue ? "bg-destructive" : "bg-yellow-500"
                      }`}
                    />
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
      <UpcomingBillsSidebar events={displayedEvents} isFetching={isFetching} />
    </div>
  );
};

export default CalendarPage;
