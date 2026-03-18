import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatDateDisplay, formatMode } from "@/shared/utils/CustomFunctions";
import { commonWidgetProps } from "@/shared/types";
import { Skeleton } from "@/shared/components/ui/skeleton";
import AnimateNumber from "@/shared/components/AnimateNumber";
import { StackedBar } from "@/shared/components/charts/CommonStackedBar";
import * as Icons from "lucide-react";

// ─── Empty state for the stacked bar ────────────────────────────────────────
function BarEmptyState({ title }: { title: string }) {
  const label =
    title === "Overview"
      ? "No accounts added yet"
      : title === "Income"
        ? "No income recorded"
        : "No expenses recorded";

  return (
    <div className="flex flex-col gap-2">
      {/* Placeholder bar */}
      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden" />
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

// ─── Helper ─────────────────────────────────────────────────────────────────
function hasData(segments: commonWidgetProps["segments"]) {
  return segments?.length > 0 && segments.some((s) => s.value > 0);
}

// ─── Component ───────────────────────────────────────────────────────────────
const WidgetLayout = ({
  title,
  isLoading,
  data,
  segments,
  icon,
}: commonWidgetProps) => {
  const date = formatDateDisplay();
  const mode = formatMode();

  const balance =
    title === "Expense"
      ? data?.expense
      : title === "Income"
        ? data?.income
        : data?.balance;

  const trend =
    title === "Expense"
      ? data?.expenseTrend
      : title === "Income"
        ? data?.incomeTrend
        : data?.balanceTrend;

  const isOverview = title === "Overview";

  const IconComponent = Icons[icon as keyof typeof Icons] || Icons.Banknote;

  const gradientColor =
    title === "Expense"
      ? {
          container:
            "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800",
          text: "text-red-600 dark:text-red-400",
        }
      : title === "Income"
        ? {
            container:
              "bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800",
            text: "text-green-600 dark:text-green-400",
          }
        : {
            container:
              "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800",
            text: "text-blue-600 dark:text-blue-400",
          };

  const trendPositiveIsGood = title !== "Expense";
  const trendColor =
    trend > 0
      ? trendPositiveIsGood
        ? "text-green-500"
        : "text-red-500"
      : trendPositiveIsGood
        ? "text-red-500"
        : "text-green-500";

  return (
    <Card
      className={`
        relative overflow-hidden border border-border/60 bg-card
        p-5 flex flex-col rounded-2xl shadow-sm col-span-full
        ${isOverview ? "md:col-span-2" : "md:col-span-1"}
        xl:col-span-1 2xl:col-span-1
        transition-shadow hover:shadow-md
      `}
      style={{
        backgroundImage: `
          radial-gradient(circle at 80% 120%, rgba(96, 165, 250, 0.25) 0%, transparent 60%),
          radial-gradient(circle at 20% 120%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)
        `,
      }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <CardHeader className="p-0">
        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-foreground flex flex-row gap-1 items-center">
          {title}
          {title !== "Overview" && (
            <>
              {" "}
              <span>•</span>
              <span className="text-[11px] font-medium text-muted-foreground">
                {date}
              </span>
            </>
          )}
        </CardTitle>
      </CardHeader>

      <div className="flex-1 min-h-0 mt-4">
        {isLoading ? (
          <div className="flex flex-col justify-between h-full gap-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="w-11 h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-3.5 w-48" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full gap-2">
            <div className="space-y-4">
              {/* Amount + icon row */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
                    {title === "Overview" ? "Balance" : `Total ${title}`}
                  </p>
                  <div className="text-3xl flex gap-1">
                    ₱<AnimateNumber duration={2} value={balance} />
                  </div>
                </div>
                <div
                  className={`w-11 h-11 rounded-xl flex justify-center items-center border shrink-0 ${gradientColor.container}`}
                >
                  <IconComponent
                    width={18}
                    height={18}
                    className={gradientColor.text}
                  />
                </div>
              </div>

              {/* Stacked bar or empty state */}
              {hasData(segments) ? (
                <StackedBar
                  segments={segments}
                  formatValue={(v) =>
                    `₱${v.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
                  }
                />
              ) : (
                <BarEmptyState title={title} />
              )}
            </div>

            {/* Trend row */}
            <div className="flex gap-2 flex-col">
              <hr className="border-border/60" />
              <div className="flex gap-1">
                {isNaN(trend) || (trend === 0 && !data) ? (
                  <p className="text-sm text-muted-foreground">
                    No data last {mode}
                  </p>
                ) : (
                  <div className="flex justify-between w-full">
                    <p className="text-sm text-muted-foreground">
                      Compare to last {mode}
                    </p>
                    <p className={`text-sm font-medium ${trendColor}`}>
                      {trend > 0 ? "↑ +" : "↓ "}
                      {trend ?? 0}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WidgetLayout;
