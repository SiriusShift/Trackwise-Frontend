import { IRootState } from "@/app/store";
import { useGetBillsQuery } from "@/features/transactions/api/transaction/expensesApi";
import { cn } from "@/lib/utils";
import BillDialog from "@/shared/components/dialog/BillDialog/BillDialog";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import * as Icons from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PESO_LOCALE = "en-PH";

export const getStatus = (date) => {
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

// Returns a lucide-react icon component for a given icon name, falling back
// to Banknote when the category/icon is missing or unrecognized.
const getCategoryIcon = (iconName?: string) => {
  if (iconName && Icons[iconName as keyof typeof Icons]) {
    return Icons[iconName as keyof typeof Icons];
  }
  return Icons.Banknote;
};

const formatCurrency = (amount: number) =>
  `₱${Number(amount ?? 0).toLocaleString(PESO_LOCALE)}`;

export default function DueCalendar() {
  const [open, setOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const active = useSelector((state: IRootState) => state.active.active);

  const { data, isLoading } = useGetBillsQuery({
    dateTo: active.to,
  });

  const upcomingBills = data?.slice(0, 2) ?? [];
  const remaining = Math.max((data?.length ?? 0) - 2, 0);
  const remainingEmpty = Math.max(2 - (data?.length ?? 0), 0);
  const totalRemaining =
    data?.slice(2)?.reduce((sum, p) => sum + Number(p.amount ?? 0), 0) ?? 0;
  const previewBills = data?.slice(2, 3) ?? [];

  console.log(previewBills);

  const handleOpenBill = (bill) => {
    setSelectedBill(bill);
    setOpen(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--mouse-x",
      `${e.clientX - rect.left}px`,
    );
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <>
      <Card
        onMouseMove={handleMouseMove}
        className={cn(
          `relative overflow-hidden border border-border/60 bg-card
    p-5 flex flex-col rounded-2xl shadow-sm  col-span-2 lg:col-span-full xl:col-span-2 2xl:col-span-1
    transition-shadow hover:shadow-md group`,
        )}
      >
        {/* Spotlight fill */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.15), transparent 80%)`,
          }}
        />

        {/* Border glow that tracks the cursor */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            padding: "1px",
            background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.7), transparent 70%)`,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        {/* Header */}
        <CardHeader className="flex flex-row w-full justify-between p-0">
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-foreground flex flex-row gap-1 items-center">
            <h1 className="text-sm font-semibold uppercase tracking-widest">
              Payment Due
            </h1>
            {isLoading ? (
              <Skeleton className="w-20 h-3 mt-1" />
            ) : (
              <>
                <span>•</span>
                <p className="text-[11px] font-medium text-muted-foreground">
                  {data?.length ?? 0} bill
                  {data?.length !== 1 ? "s" : ""}
                </p>
              </>
            )}
          </CardTitle>
          <Link
            to="/transactions/schedules"
            className="text-xs font-medium text-primary hover:underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            See All →
          </Link>
        </CardHeader>

        {/* Body — centers content vertically when only 1 bill */}
        <div className="flex-1 flex flex-col justify-start gap-2 mt-4">
          {/* Bill list */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3.5 rounded-xl border border-border/50 bg-muted/30"
                >
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="w-16 h-4" />
                    <Skeleton className="w-12 h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : upcomingBills.length > 0 ? (
            <div className="space-y-3">
              {upcomingBills.map((bill) => {
                const status = getStatus(bill.nextDueDate);
                const dueDate = moment(bill.nextDueDate);
                const IconComponent = getCategoryIcon(bill.category?.icon);

                return (
                  <Card
                    key={bill.id}
                    className="flex items-center cursor-pointer gap-4 p-2 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/60 transition-colors"
                    onClick={() => handleOpenBill(bill)}
                  >
                    <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-background border border-border/60 shadow-sm">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground leading-none">
                        {dueDate.format("MMM")}
                      </span>
                      <span className="text-lg font-bold leading-tight tabular-nums">
                        {dueDate.format("DD")}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <IconComponent
                          width={13}
                          className="text-muted-foreground"
                        />
                        <span className="font-semibold text-sm truncate">
                          {bill.description}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {bill.category?.name}
                      </p>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      <span className="text-sm font-bold">
                        {formatCurrency(bill.amount)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.bg} ${status.color} ${status.border}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                        />
                        {status.label}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 p-6 rounded-xl border border-border/50 bg-muted/30 text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10">
                <Icons.Check className="text-success" size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  All caught up
                </p>
                <p className="text-xs text-muted-foreground">
                  No pending bills at the moment.
                </p>
              </div>
            </div>
          )}

          {!isLoading &&
            remainingEmpty !== 2 &&
            Array.from({ length: remainingEmpty }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-2 rounded-xl border border-dashed border-border bg-muted/10 opacity-60"
              >
                {/* Date placeholder */}
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl border border-dashed border-border">
                  <Icons.CalendarDays
                    size={18}
                    className="text-muted-foreground/50"
                  />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    No upcoming bill
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    You're all caught up.
                  </p>
                </div>

                {/* Amount placeholder */}
                <span className="text-xs text-muted-foreground/50">—</span>
              </div>
            ))}

          {/* Remaining summary badge */}
          {!isLoading && remaining > 0 && (
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-dashed border-border hover:bg-muted/60 transition-colors group">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {previewBills.map((p) => {
                    const LucidIcon = getCategoryIcon(p.category?.icon);
                    const isDue = moment(p?.nextDueDate).isBefore(moment());
                    console.log(isDue, "DUE");
                    return (
                      <span
                        key={p.id}
                        className={`w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center text-[9px] ${isDue ? "border border-destructive" : ""}`}
                      >
                        <LucidIcon
                          className="text-foreground"
                          width={10}
                          height={10}
                        />
                      </span>
                    );
                  })}
                </div>
                <span className="text-xs text-muted-foreground">
                  +{remaining} more bill{remaining !== 1 ? "s" : ""}
                </span>
              </div>
              <span className="text-xs font-semibold tabular-nums text-muted-foreground group-hover:text-foreground transition-colors">
                {formatCurrency(totalRemaining)}
              </span>
            </div>
          )}
        </div>
      </Card>
      <BillDialog open={open} setOpen={setOpen} data={selectedBill} />
    </>
  );
}
