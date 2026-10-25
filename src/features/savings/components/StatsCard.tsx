import { Card } from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { useSelector } from "react-redux";
import { IRootState } from "@/app/store";
import { StackedBar } from "@/shared/components/charts/CommonBar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface SavingsStatsType {
  title: string;
  key: string;
  value?: number;
  additional?: number | null;
}

const StatsCard = ({ data, isLoading }: { data: SavingsStatsType; isLoading?: boolean }) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const amount = data.value ?? 0;
  const additional = data.additional ?? 0;

  const formatValue = () => {
    switch (data.key) {
      case "saved-total":
      case "saved-current":
        return formatCurrency(amount, currency, "symbol", 0);
      case "progress":
        return `${Math.round(amount * 100)}%`;
      default:
        return amount;
    }
  };

  // Footer text plus its tone: positive, negative, or muted
  const formatFooter = (): { text: string; tone?: "positive" | "negative" } => {
    switch (data.key) {
      case "saved-total":
        return { text: `Across ${additional} active goals` };
      case "saved-current": {
        if (data.additional == null) return { text: "No savings last month" };
        const pct = Math.round(additional * 100);
        return {
          text: `${pct >= 0 ? "+" : ""}${pct}% vs last month`,
          tone: pct >= 0 ? "positive" : "negative",
        };
      }
      case "progress":
        return {
          text: `of ${formatCurrency(additional, currency, "symbol", 0)} combined target`,
        };
      default:
        return additional > 0
          ? { text: `${additional} behind schedule`, tone: "negative" }
          : { text: "All goals on schedule" };
    }
  };

  const footer = formatFooter();

  return (
    <Card className="flex flex-col gap-1 px-4 py-3 transition-shadow hover:shadow-md">
      <span className="text-xs font-medium text-muted-foreground">{data.title}</span>

      {isLoading ? (
        <>
          <Skeleton className="h-7 w-28" />
          <Skeleton className="mt-auto h-3 w-36" />
        </>
      ) : (
        <>
          <p className="text-2xl font-bold leading-tight tracking-tight tabular-nums">
            {formatValue()}
            {data.key === "count" && (
              <span className="ml-1 text-sm font-medium text-muted-foreground">on track</span>
            )}
          </p>
          {data.key === "progress" && (
            <StackedBar
              segments={[{ label: "Progress", value: amount, color: "hsl(var(--primary))" }]}
              mode="progress"
              maxValue={1}
            />
          )}
          <span
            className={cn(
              "mt-auto text-xs",
              footer.tone === "positive" && "text-primary",
              footer.tone === "negative" && "text-destructive",
              !footer.tone && "text-muted-foreground",
            )}
          >
            {footer.text}
          </span>
        </>
      )}
    </Card>
  );
};

export default StatsCard;
