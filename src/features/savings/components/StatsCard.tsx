import { IRootState } from "@/app/store";
import { cn } from "@/lib/utils";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  formatCompactCurrency,
  formatCurrency,
} from "@/shared/utils/CustomFunctions";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { GoalHealth } from "../types/savings.types";
import { StatSparkline } from "./StatSparkLine";

interface SavingsStatsType {
  title: string;
  key: string;
  value?: number;
  additional?: number | null;
  change?: number;
  icon: LucideIcon;
  graph: number[];
  health?: GoalHealth[];
  // Set on cards that only cover goals with a target date
  datedGoals?: number;
  excludedGoals?: number;
}

const healthStyles: Record<
  GoalHealth["status"],
  { color: string; label: string }
> = {
  onTrack: { color: "bg-success", label: "On track" },
  behind: { color: "bg-warning", label: "Behind schedule" },
  noDeadline: { color: "bg-muted-foreground/30", label: "No deadline" },
};

// One square per goal, colored by its schedule status
const GoalHealthDots = ({ goals }: { goals: GoalHealth[] }) => {
  // Colors alone don't reach screen readers, so summarize the counts
  const summary = (Object.keys(healthStyles) as GoalHealth["status"][])
    .map((status) => {
      const count = goals.filter((g) => g.status === status).length;
      return count
        ? `${count} ${healthStyles[status].label.toLowerCase()}`
        : null;
    })
    .filter(Boolean)
    .join(", ");

  return (
    <div
      role="img"
      aria-label={summary}
      className="flex max-w-20 shrink-0 flex-wrap justify-end gap-1 pb-1"
    >
      {goals.map((goal) => {
        const { color, label } = healthStyles[goal.status];
        return (
          <span
            key={goal.id}
            title={`${goal.name}: ${label}`}
            className={cn("h-2.5 w-2.5 rounded-sm", color)}
          />
        );
      })}
    </div>
  );
};

const StatsCard = ({
  data,
  isLoading,
}: {
  data: SavingsStatsType;
  isLoading?: boolean;
}) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const amount = data.value ?? 0;
  const additional = data.additional ?? 0;
  const Icon = data.icon;
  // A deadline-only card with no dated goals has nothing to measure
  const noDeadlines = data.datedGoals === 0;
  const excludedNote = data.excludedGoals
    ? `Excludes ${data.excludedGoals} goal${data.excludedGoals > 1 ? "s" : ""} without a deadline`
    : undefined;

  const formatValue = () => {
    if (noDeadlines) return "—";
    switch (data.key) {
      case "saved-total":
      case "monthly-pace":
        return formatCurrency(amount, currency, "symbol", 0);
      case "progress":
        return `${Math.round(amount * 100)}%`;
      default:
        return `${amount}/${data.datedGoals ?? 0}`;
    }
  };

  const formatBadge = (): {
    text: string;
    tooltip?: string;
    tone?: "positive" | "negative" | "warning";
  } => {
    if (noDeadlines) {
      return {
        text: "No deadlines set",
        tooltip: "Add a target date to a goal to track it here",
      };
    }
    switch (data.key) {
      case "saved-total": {
        if (!additional) return { text: "Nothing yet this month" };
        return {
          text: `${additional > 0 ? "+" : "-"}${formatCurrency(Math.abs(additional), currency, "symbol", 0)} this month`,
          tone: additional > 0 ? "positive" : "negative",
        };
      }
      case "monthly-pace": {
        const difference = additional - amount;
        const tooltip = [
          `Averaging ${formatCurrency(additional, currency, "symbol", 0)}/mo over the last 3 months`,
          excludedNote,
        ]
          .filter(Boolean)
          .join(" · ");
        if (difference >= 0)
          return { text: "On pace", tooltip, tone: "positive" };
        return {
          text: `${formatCurrency(Math.abs(difference), currency, "symbol", 0)}/mo short`,
          tooltip,
          tone: "warning",
        };
      }
      case "progress": {
        const pts = Math.round((data.change ?? 0) * 100);
        return {
          text: `${pts > 0 ? "+" : ""}${pts} pts`,
          tooltip: excludedNote,
          tone: pts > 0 ? "positive" : pts < 0 ? "negative" : undefined,
        };
      }
      default:
        // Behind schedule is a warning, matching the pace shortfall
        return additional > 0
          ? {
              text: `${additional} behind`,
              tooltip: excludedNote,
              tone: "warning",
            }
          : { text: "All on track", tooltip: excludedNote };
    }
  };

  // Muted text shown after the main value
  const suffix: Record<string, string> = noDeadlines
    ? {}
    : {
        "monthly-pace": "/ mo",
        progress: `of ${formatCompactCurrency(additional, currency)}`,
        count: "on track",
      };

  const badge = formatBadge();
  const TrendIcon =
    badge.tone === "positive"
      ? ArrowUp
      : badge.tone === "negative"
        ? ArrowDown
        : null;

  return (
    <Card className="flex flex-col items-start gap-2 px-4 py-3">
      <div className="flex items-start justify-between gap-2 self-stretch">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        {badge.text && !isLoading && (
          <div
            title={badge.tooltip}
            className={cn(
              "flex min-w-0 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
              // The success/warning tokens are too light for small text on a
              // light tint, so light mode uses darker shades of the same hue
              badge.tone === "positive" &&
                "text-green-700 dark:text-success bg-success/20",
              badge.tone === "negative" && "text-destructive bg-destructive/20",
              badge.tone === "warning" &&
                "text-amber-700 dark:text-warning bg-warning/20",
              !badge.tone && "text-muted-foreground",
            )}
          >
            {TrendIcon && <TrendIcon className="h-3 w-3 shrink-0" />}
            <span className="truncate">{badge.text}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <>
          <Skeleton className="h-7 w-28" />
          <Skeleton className="mt-auto h-3 w-36" />
        </>
      ) : (
        <div className="flex items-end justify-between gap-3 self-stretch">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              {data.title}
            </span>
            <p className="text-2xl font-bold leading-tight tracking-tight tabular-nums">
              {formatValue()}
              {suffix[data.key] && (
                <span className="ml-1 text-xs font-medium tracking-wide text-muted-foreground">
                  {suffix[data.key]}
                </span>
              )}
            </p>
          </div>

          {data.key === "count" ? (
            <GoalHealthDots goals={data.health ?? []} />
          ) : (
            <StatSparkline
              values={data.graph}
              // Compare monthly contributions against the pace needed
              avg={data.key === "monthly-pace" ? amount : undefined}
              fromZero={data.key === "saved-total" || data.key === "progress"}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default StatsCard;
