import FullCalendar from "@fullcalendar/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import dayGridPlugin from "@fullcalendar/daygrid";
import moment from "moment";
import { useLazyGetBillsQuery } from "../api/transaction/expensesApi";

const CalendarPage = () => {
  const [monthRange, setMonthRange] = useState({
    start: "",
    end: "",
  });
  const [title, setTitle] = useState("");

  console.log(monthRange);
  const calendarRef = useRef<FullCalendar>(null);

  const [trigger, { data, isFetching }] = useLazyGetBillsQuery();

  const prev = () => calendarRef.current?.getApi().prev();
  const next = () => calendarRef.current?.getApi().next();
  const today = () => calendarRef.current?.getApi().today();

  useEffect(() => {
    if (!monthRange.start || !monthRange.end) return;
    trigger({
      dateFrom: monthRange.start,
      dateTo: monthRange.end,
    });
  }, [monthRange.start, monthRange.end]);

  const transformedData = useMemo(() => {
    return (
      data?.map((bill) => ({
        id: bill.id,
        title: bill.description,
        start: bill.nextDueDate,
        allDay: true,

        // Optional: keep the original object
        extendedProps: {
          amount: Number(bill.amount),
          category: bill.category,
          bill,
        },
      })) ?? []
    );
  }, [data]);
  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Calendar */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button variant="outline" onClick={today}>
              Today
            </Button>

            <Button size="icon" variant="outline" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
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
            }}
            events={transformedData}
            eventContent={(arg) => {
              const dueDate = moment(arg.event.start);
              const today = moment();

              const isOverdue = dueDate.isBefore(today, "day");
              const isDueToday = dueDate.isSame(today, "day");

              const className = isOverdue
                ? "bg-red-100 text-destructive"
                : isDueToday
                  ? "bg-yellow-400 text-yellow-950"
                  : "bg-blue-100 text-primary";

              return (
                <div
                  className={`w-full px-2 py-1 text-xs font-medium border-0 border-border truncate ${className}`}
                >
                  {arg.event.title}
                </div>
              );
            }}
          />
        </div>
      </div>
      {/* Sidebar */}
      <div className="w-72 shrink-0 p-4 border-l">
        <h1 className="font-bold">Upcoming Bills</h1>
      </div>
    </div>
  );
};

export default CalendarPage;
