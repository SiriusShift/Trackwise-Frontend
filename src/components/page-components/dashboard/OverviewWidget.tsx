import CommonWidget from "@/components/common/CommonWidget";
import { overviewWidgetProps } from "@/types";
import { Banknote } from "lucide-react";
import moment from "moment";

const OverviewWidget = ({ startDate, endDate }: overviewWidgetProps) => {
  return (
    <CommonWidget title="Overview">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400">Balance</p>
          <h1 className="text-3xl">₱10,732.52</h1>
        </div>
        <div className="w-12 h-12 rounded-md flex justify-center items-center border-2 border-gray-100 ">
          <Banknote />
        </div>
      </div>
      <div className="flex gap-1 mt-5">
        <p>Compare to last month</p>
        <p className="text-green-500">+6.52%</p>
      </div>
      <p className="text-gray-400">
        {moment(startDate).startOf("month").format("MMMM DD")} -{" "}
        {moment(endDate).endOf("month").format("MMMM DD")}{" "}
      </p>
    </CommonWidget>
  );
};

export default OverviewWidget;
