import { formatString } from "@/utils/CustomFunctions";
import moment from "moment";
import React from "react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { useGetExpensesQuery } from "@/feature/expenses/api/expensesApi";
import NoData from "@/assets/images/empty-box.png";

const TransactionHistory = () => {
  //RTK QUERY
  const { data, isLoading } = useGetExpensesQuery();

  return (
    <div className="rounded-lg 2xl:h-[342px] col-span-full overflow-y-auto  md:col-span-2 lg:col-span-1 p-7 border">
      <div className="flex justify-between items-center">
        <h1 className="gap-3 text-xl font-semibold">Recent Transactions</h1>
        <Link to={"/expenses"}>See All</Link>
      </div>

      {data?.data.length === 0 ? (
        <div className="flex flex-col gap-5 justify-center items-center h-[90%]">
          <img src={NoData} width={150} />
          <h1>No Data Found</h1>
        </div>
      ) : (
        data?.data.map((item: Object) => {
          const LucidIcon = Icons[item.category?.icon];
          return (
            <div className="flex mt-5 rounded-md justify-between">
              <div className="flex w-full">
                <div className="p-2 border rounded-md bg-white w-12 flex justify-center items-center">
                  <LucidIcon className="text-black" width={25} height={25} />
                </div>
                <div className="ml-3 w-full">
                  <div className="flex justify-between">
                    <div>
                      <h1 className="font-medium">
                        {formatString(item?.description)}
                      </h1>
                    </div>
                    <div>
                      <h1 className="font-medium">
                        ₱
                        {item?.amount.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </h1>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {item?.category?.name} -{" "}
                    {moment
                      .tz(item?.date, "Asia/Manila")
                      .format("MMM DD, h:mm A")}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TransactionHistory;
