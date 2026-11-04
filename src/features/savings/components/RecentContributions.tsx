import { IRootState } from "@/app/store";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { ArrowRight, Plus, Repeat } from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useGetGoalContributionsQuery } from "../api/savingsApi";
import { SavingsData } from "../types/savings.types";

interface RecentContributionsProps {
  // Must be a linked goal: manual goals have no tagged transfers
  goal: SavingsData;
  onContribute?: (goal: SavingsData) => void;
}

const RecentContributions = ({
  goal,
  onContribute,
}: RecentContributionsProps) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const contributions = useGetGoalContributionsQuery({ id: goal.id, limit: 5 });

  const format = (amount: number) =>
    formatCurrency(amount, currency, "symbol", 0);

  return (
    <Card className="flex max-h-58 min-w-0 flex-col gap-2 p-4">
      <h3 className="text-sm font-semibold">Recent activity</h3>
      {contributions.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : contributions.data?.data.length ? (
        <ul
          className={`flex flex-col divide-y overflow-auto ${contributions.data?.data.length > 3 ? "pr-1" : ""}`}
        >
          {contributions.data.data.map((t) => {
            const isWithdrawal = t.type === "withdrawal";
            const kind = isWithdrawal ? "Withdrawal" : "Contribution";
            // The default description repeats the goal name this card is
            // already about, so only custom notes are shown
            const isDefault =
              t.description ===
              `${isWithdrawal ? "Withdrawal from" : "Contribution to"} ${goal.name}`;
            return (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3 py-2"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="flex items-center gap-1.5 truncate text-sm">
                    {(!isDefault && t.description) || kind}
                    {t.recurringId != null && (
                      <Repeat
                        className="size-3 shrink-0 text-muted-foreground"
                        aria-label="Recurring"
                      />
                    )}
                    {t.status === "Pending" && (
                      <span className="shrink-0 rounded-full bg-muted px-1.5 text-[11px] text-muted-foreground">
                        Scheduled
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    {moment(t.date).format("MMM D")} · {t.fromAsset.name}
                    <ArrowRight className="size-3 shrink-0" aria-hidden />
                    {t.toAsset?.name ?? goal.asset?.name}
                  </span>
                </div>
                <span
                  className={cn(
                    "shrink-0 text-sm font-semibold tabular-nums",
                    isWithdrawal
                      ? "text-muted-foreground"
                      : "text-green-700 dark:text-success",
                  )}
                >
                  {isWithdrawal ? "−" : "+"}
                  {format(t.amount)}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 text-center text-sm text-muted-foreground">
          No contributions yet
          {goal.isActive && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onContribute?.(goal)}
            >
              <Plus />
              Add the first one
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default RecentContributions;
