import { EventClickArg, EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { ChevronLeft, ChevronRight, Receipt } from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";

import { useLazyGetBillsQuery } from "@/features/transactions/api/transaction/expensesApi";
import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

// ─── Category colour map ──────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Bills: "#3b82f6",
  Subscriptions: "#8b5cf6",
  Housing: "#10b981",
  "Loan Payment": "#ec4899",
  Transportation: "#f59e0b",
  Utilities: "#06b6d4",
  Insurance: "#6366f1",
  default: "#64748b",
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.default;
}

function fmtPeso(n: number) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2 });
}

function isOverdue(dateStr: string) {
  return moment(dateStr).isBefore(moment(), "day");
}

// ─── Custom event pill ────────────────────────────────────────────────────────
function EventPill({ info }: { info: EventContentArg }) {
  const { amount, category } = info.event.extendedProps as {
    amount: number;
    category: string;
  };
  const overdue = isOverdue(info.event.startStr);
  const color = categoryColor(category);

  return (
    <div
      className="flex w-full cursor-pointer items-center gap-1 truncate rounded-md px-1.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: overdue ? "#fee2e2" : `${color}18`,
        color: overdue ? "#dc2626" : color,
        borderLeft: `3px solid ${overdue ? "#dc2626" : color}`,
      }}
      title={`${info.event.title} — ${fmtPeso(amount)}`}
    >
      <span className="truncate">{info.event.title}</span>
      <span className="ml-auto shrink-0 font-semibold">{fmtPeso(amount)}</span>
    </div>
  );
}

// ─── Sidebar bill row ─────────────────────────────────────────────────────────
interface SidebarBill {
  id: string;
  name: string;
  date: string;
  amount: number;
  category: string;
}

function BillRow({
  bill,
  active,
  onClick,
}: {
  bill: SidebarBill;
  active: boolean;
  onClick: () => void;
}) {
  const overdue = isOverdue(bill.date);
  const color = categoryColor(bill.category);

  return (
    <button
      id={`bill-row-${bill.id}`}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
        active
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card hover:bg-accent/50",
      )}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}18`, color }}
      >
        <Receipt size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{bill.name}</p>
        <p className="text-xs text-muted-foreground">{bill.category}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-bold">{fmtPeso(bill.amount)}</p>
        <p
          className={cn(
            "text-xs font-medium",
            overdue ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {overdue
            ? `Overdue ${moment(bill.date).fromNow()}`
            : moment(bill.date).format("MMM D")}
        </p>
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const CalendarPage = () => {
  const [monthRange, setMonthRange] = useState({ start: "", end: "" });
  const [title, setTitle] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const calendarRef = useRef<FullCalendar>(null);
  const [trigger, { data, isFetching }] = useLazyGetBillsQuery();

  const prev = () => calendarRef.current?.getApi().prev();
  const next = () => calendarRef.current?.getApi().next();
  const today = () => calendarRef.current?.getApi().today();

  useEffect(() => {
    if (!monthRange.start || !monthRange.end) return;
    trigger({ dateFrom: monthRange.start, dateTo: monthRange.end });
  }, [monthRange.start, monthRange.end]);

  // FullCalendar event objects
  const calendarEvents = useMemo(
    () =>
      data?.map((bill) => ({
        id: bill.id,
        title: bill.description,
        start: bill.nextDueDate,
        allDay: true,
        extendedProps: {
          amount: Number(bill.amount),
          category: bill.category ?? "default",
          bill,
        },
      })) ?? [],
    [data],
  );

  // Sidebar list — overdue first, then chronological
  const sidebarBills = useMemo<SidebarBill[]>(() => {
    if (!data) return [];
    return [...data]
      .map((bill) => ({
        id: bill.id,
        name: bill.description,
        date: bill.nextDueDate,
        amount: Number(bill.amount),
        category: bill.category ?? "default",
      }))
      .sort((a, b) => {
        const aOver = isOverdue(a.date) ? 0 : 1;
        const bOver = isOverdue(b.date) ? 0 : 1;
        if (aOver !== bOver) return aOver - bOver;
        return moment(a.date).diff(moment(b.date));
      });
  }, [data]);

  const overdueCount = sidebarBills.filter((b) => isOverdue(b.date)).length;
  const totalAmount = sidebarBills.reduce((s, b) => s + b.amount, 0);

  const handleEventClick = (arg: EventClickArg) => {
    const id = arg.event.id;
    setSelectedEventId((prev) => (prev === id ? null : id));
    document
      .getElementById(`bill-row-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* ── Calendar ── */}
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={prev}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={today} className="min-w-[68px]">
              Today
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={next}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            ref={calendarRef}
            fixedWeekCount={false}
            showNonCurrentDates
            headerToolbar={false}
            expandRows
            height="100%"
            eventContent={(info) => <EventPill info={info} />}
            eventClick={handleEventClick}
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
            events={calendarEvents}
          />
        </div>
      </div>

      {/* ── Sidebar ── */}
      <aside className="flex w-72 shrink-0 flex-col border-l bg-muted/20">
        <div className="border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Upcoming Bills</h3>
            {overdueCount > 0 && (
              <Badge variant="destructive" className="text-[10px]">
                {overdueCount} overdue
              </Badge>
            )}
          </div>
          {sidebarBills.length > 0 && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {sidebarBills.length} bills ·{" "}
              <span className="font-medium text-foreground">
                {fmtPeso(totalAmount)}
              </span>{" "}
              total
            </p>
          )}
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {isFetching ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : sidebarBills.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <Receipt className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No bills this month.
              </p>
            </div>
          ) : (
            sidebarBills.map((bill) => (
              <BillRow
                key={bill.id}
                bill={bill}
                active={selectedEventId === bill.id}
                onClick={() =>
                  setSelectedEventId((prev) =>
                    prev === bill.id ? null : bill.id,
                  )
                }
              />
            ))
          )}
        </div>
      </aside>
    </div>
  );
};

export default CalendarPage;
