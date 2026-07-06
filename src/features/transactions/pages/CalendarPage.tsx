import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar, { type DateClickArg } from "@fullcalendar/react";
import * as LucideIcon from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/shared/components/ui/button";
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
  const [trigger, { data, isFetching }] = useLazyGetBillsQuery();

  const prev = () => calendarRef.current?.getApi().prev();
  const next = () => calendarRef.current?.getApi().next();
  const today = () => calendarRef.current?.getApi().today();

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
    <div className="flex h-[calc(100vh-65px)]">
      {/* Calendar */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={prev}>
              <LucideIcon.ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={today}>
              Today
            </Button>
            <Button size="icon" variant="outline" onClick={next}>
              <LucideIcon.ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
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
              const dueDate = moment(arg.event.start);
              const isOverdue = dueDate.isBefore(moment(), "day");
              const isDueToday = dueDate.isSame(moment(), "day");

              const className = isOverdue
                ? "bg-red-100 text-destructive"
                : isDueToday
                  ? "bg-yellow-400 text-yellow-950"
                  : "bg-blue-100 text-primary";

              return (
                <div
                  className={`w-full truncate border-0 border-border px-2 py-1 text-xs font-medium ${className}`}
                >
                  {arg.event.title}
                </div>
              );
            }}
            dateClick={handleDateClick}
          />
        </div>
      </div>

      {/* Sidebar */}
      <UpcomingBillsSidebar events={displayedEvents} isFetching={isFetching} />
    </div>
  );
};

export default CalendarPage;
