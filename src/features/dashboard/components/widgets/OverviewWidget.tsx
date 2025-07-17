import Widget from "@/features/dashboard/components/widgets/Widget";
import { useGetAssetQuery } from "@/shared/api/assetsApi";
import { overviewWidgetProps } from "@/shared/types";
import { formatDateDisplay, formatMode } from "@/shared/utils/CustomFunctions";
import { Banknote } from "lucide-react";
import { useSelector } from "react-redux";

const OverviewWidget = () => {
  const {data, isLoading }= useGetAssetQuery();

  console.log(data)
  return (
    <Widget title="Overview">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400">Balance</p>
          <h1 className="text-3xl">
            ₱
            {data?.balance.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}
          </h1>
        </div>
        <div className="w-12 h-12 rounded-md flex justify-center items-center border-2 border-gray-100 ">
          <Banknote />
        </div>
      </div>
      <div className="flex gap-1 mt-5">
        {isNaN(data?.trend) ? (
          <p>No data last {formatMode()}</p>
        ) : (
          <>
            <p>Compare to last {formatMode()}</p>
            <p className={data?.trend > 0 ? "text-green-500" : "text-red-500"}>
              {data?.trend > 0 ? "+" : ""}
              {data?.trend ? data?.trend : 0}%
            </p>
          </>
        )}
      </div>
      <p className="text-gray-400">
        {formatDateDisplay()}
      </p>
    </Widget>
  );
};

export default OverviewWidget;
