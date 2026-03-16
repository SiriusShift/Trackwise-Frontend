import Widget from "@/features/dashboard/components/widgets/Widget";
import { useGetAssetQuery } from "@/shared/api/assetsApi";
import AnimateNumber from "@/shared/components/AnimateNumber";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { overviewWidgetProps } from "@/shared/types";
import {
  formatCurrency,
  formatDateDisplay,
  formatMode,
} from "@/shared/utils/CustomFunctions";
import { ArrowDownToLine, ArrowUpFromLine, Banknote } from "lucide-react";
import { useSelector } from "react-redux";

const IncomeWidget = ({ data, isLoading }) => {
  const date = formatDateDisplay();
  const mode = formatMode();
  const balance = Number(data?.income);
  console.log(data);
  return (
    <Widget title="Income">
      {isLoading ? (
        <>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="w-12 h-12 rounded-md flex justify-center items-center border-2 border-border">
              <ArrowDownToLine />
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <Skeleton className="w-56 h-4" />
            <Skeleton className="w-40 h-4" />
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
                Total Income
              </p>
              {/* <p className="text-3xl">{balance}</p> */}
              <div className="text-3xl flex gap-1">
                ₱
                <AnimateNumber
                  duration={2}
                  value={balance}
                  className="text-xl"
                />
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl flex justify-center items-center bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 shrink-0">
              <ArrowDownToLine
                size={18}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>
          <div className="flex gap-1 mt-3 sm:mt-5">
            {data?.incomeTrend === 0 ? (
              <p>No data last {mode}</p>
            ) : (
              <>
                <p>Compare to last {mode}</p>
                <p
                  className={
                    data?.incomeTrend > 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {data?.incomeTrend > 0 ? "+" : ""}
                  {data?.incomeTrend ? data?.incomeTrend : 0}%
                </p>
              </>
            )}
          </div>
        </>
      )}
    </Widget>
  );
};

export default IncomeWidget;
