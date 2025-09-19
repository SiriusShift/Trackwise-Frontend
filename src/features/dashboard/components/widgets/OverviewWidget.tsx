import Widget from "@/features/dashboard/components/widgets/Widget";
import { useGetAssetQuery } from "@/shared/api/assetsApi";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { overviewWidgetProps } from "@/shared/types";
import { formatCurrency, formatDateDisplay, formatMode } from "@/shared/utils/CustomFunctions";
import { Banknote } from "lucide-react";
import { useSelector } from "react-redux";

const OverviewWidget = () => {
  const { data, isLoading } = useGetAssetQuery();
  const date = formatDateDisplay();
  const mode = formatMode();
  const balance = formatCurrency(data?.balance)
  console.log(data);
  return (
    <Widget title="Overview">
      {isLoading ? (
        <>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="w-12 h-12 rounded-md flex justify-center items-center border-2 border-white">
              <Banknote />
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <Skeleton className="w-56 h-4"/>
            <Skeleton className="w-40 h-4" />
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-foreground">Balance</p>
              <h1 className="text-3xl">{balance}</h1>
            </div>
            <div className="w-12 h-12 rounded-md flex justify-center items-center border-2 border-white">
              <Banknote />
            </div>
          </div>
          <div className="flex gap-1 mt-5">
            {isNaN(data?.trend) ? (
              <p>No data last {mode}</p>
            ) : (
              <>
                <p>Compare to last {mode}</p>
                <p
                  className={
                    data?.trend > 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {data?.trend > 0 ? "+" : ""}
                  {data?.trend ? data?.trend : 0}%
                </p>
              </>
            )}
          </div>
          <p className="text-gray-400">{date}</p>
        </>
      )}
    </Widget>
  );
};

export default OverviewWidget;
