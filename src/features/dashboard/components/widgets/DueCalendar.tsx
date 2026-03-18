import { Card } from "@/shared/components/ui/card";
import { Link } from "react-router-dom";
import moment from "moment";
import { useGetBillsQuery } from "@/features/transactions/api/transaction/expensesApi";
import * as Icons from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
const payments = [
  {
    name: "Electric",
    amount: 3540.21,
    dueDate: "2026-01-13",
    type: "Monthly expense",
  },
  {
    name: "Water",
    amount: 1000,
    dueDate: "2026-09-15",
    type: "Monthly expense",
  },
  {
    name: "Rent",
    amount: 1000,
    dueDate: "2026-09-15",
    type: "Monthly expense",
  },
];

const getStatus = (date) => {
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

const categoryIcon = (name: string) => {
  const icons: Record<string, string> = {
    Electric: "⚡",
    Water: "💧",
    Internet: "🌐",
    Rent: "🏠",
  };
  return icons[name] ?? "📄";
};

// const urgencyOrder = { Overdue: 0, "Due Today": 1, "Due Soon": 2, Upcoming: 3 };

// const sortedPayments = [...payments].sort((a, b) => {
//   const diff =
//     urgencyOrder[getStatus(a.dueDate).label] -
//     urgencyOrder[getStatus(b.dueDate).label];
//   return diff !== 0 ? diff : moment(a.dueDate).diff(moment(b.dueDate));
// });

export default function DueCalendar() {
  const { data, isLoading } = useGetBillsQuery({});
  const totalRemaining = data
    ?.slice(1)
    ?.reduce((sum, p) => sum + Number(p.amount), 0);
  const featured = data?.[0];
  const featuredStatus = getStatus(featured?.date);
  const featuredDate = moment(featured?.date);
  // console.log(featured)

  const remaining = data?.length - 1;
  return (
    <Card
      className="rounded-2xl col-span-2 lg:col-span-full 2xl:col-span-1 p-5 border border-border/60 shadow-sm bg-card"
      style={{
        backgroundImage: `
    radial-gradient(circle at 80% 120%, rgba(96, 165, 250, 0.25) 0%, transparent 60%),
    radial-gradient(circle at 20% 120%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)
  `,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-sm font-semibold uppercase tracking-widest">
            Payment Due
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {data?.length} upcoming bill
            {data?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/funds"
          className="text-xs font-medium text-primary hover:underline underline-offset-4 transition-opacity hover:opacity-80"
        >
          See All →
        </Link>
      </div>

      {/* Featured item */}
      <div className="flex items-center gap-4 p-3.5 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/60 transition-colors">
        {/* Date badge */}
        <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-background border border-border/60 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground leading-none">
            {featuredDate.format("MMM")}
          </span>
          <span className="text-lg font-bold leading-tight tabular-nums">
            {featuredDate.format("DD")}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm">{categoryIcon(featured?.name)}</span>
            <span className="font-semibold text-sm truncate">
              {featured?.description}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {featured?.category?.name}
          </p>
        </div>

        {/* Amount + status */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <span className="text-sm font-bold tabular-nums">
            ₱{featured?.amount.toLocaleString()}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${featuredStatus.bg} ${featuredStatus.color} ${featuredStatus.border}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${featuredStatus.dot} shrink-0`}
            />
            {featuredStatus.label}
          </span>
        </div>
      </div>

      {/* Remaining summary badge */}
      {remaining > 0 && (
        <Link to="/funds">
          <div className="mt-3 flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-dashed border-border hover:bg-muted/60 transition-colors group">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {data.slice(1, 4).map((p, i) => {
                  const LucidIcon = Icons[p.category.icon];
                  return (
                    <span
                      key={i}
                      className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center text-[9px]"
                    >
                      <LucidIcon
                        className="text-foreground"
                        width={10}
                        height={10}
                      />{" "}
                    </span>
                  );
                })}
              </div>
              <span className="text-xs text-muted-foreground">
                +{remaining} more bill{remaining !== 1 ? "s" : ""}
              </span>
            </div>
            <span className="text-xs font-semibold tabular-nums text-muted-foreground group-hover:text-foreground transition-colors">
              ₱{totalRemaining.toLocaleString()}
            </span>
          </div>
        </Link>
      )}
    </Card>
  );
}
