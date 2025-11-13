import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { Skeleton } from "../ui/skeleton";

const CommonPieGraphFooter = ({graphLoading, trend, modeDisplay, type}) => {
  return (
    <div className="flex flex-col sm:p-4 items-center text-center gap-2 text-sm">
      {graphLoading ? (
        <>
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-3/4 rounded" />
        </>
      ) : trend === "NaN" ? (
        <span>No trend data available for this {modeDisplay}.</span>
      ) : (
        <div className="flex flex-col items-center text-center gap-2 text-sm">
          <div className="flex items-center justify-center gap-2 font-medium leading-none">
            <span className="truncate">
              {trend > 0
                ? `Up by ${trend}% this ${modeDisplay}`
                : `Down by ${trend}% this ${modeDisplay}`}
            </span>
            {trend > 0 ? (
              <TrendingUp
                className={`h-4 w-4 ${
                  type === "Expense" ? "text-destructive" : "text-success"
                }`}
              />
            ) : (
              <TrendingDown
                className={`h-4 w-4 ${
                  type === "Expense" ? "text-success" : "text-destructive"
                }`}
              />
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            Total {type?.toLowerCase()} shown for this {modeDisplay}.
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonPieGraphFooter;
