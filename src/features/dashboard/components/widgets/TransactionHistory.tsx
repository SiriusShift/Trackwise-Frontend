import { formatString } from "@/shared/utils/CustomFunctions";
import moment from "moment";
import React from "react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { useGetExpensesQuery } from "@/features/transactions/api/transaction/expensesApi";
import NoData from "@/assets/images/empty-box.png";
import { Card } from "@/shared/components/ui/card";
import { useGetTransactionHistoryQuery } from "@/features/transactions/api/transaction";

const TransactionHistory = () => {
  //RTK QUERY
  const { data, isLoading } = useGetTransactionHistoryQuery();

  return (
    <Card className="rounded-lg 2xl:h-[342px] col-span-full p-0 md:col-span-2 lg:col-span-1 border">
      <div className="flex justify-between p-6 pb-4 border-b items-center">
        <h1 className="gap-3 text-xl font-semibold">Recent Transactions</h1>
        <Link to={"/transactions"}>See All</Link>
      </div>

      <div className="overflow-y-auto max-h-[260px] px-6 pb-6">
        {data?.data.length === 0 ? (
          <div className="flex flex-col gap-5 justify-center items-center h-[90%]">
            <img src={NoData} width={150} />
            <h1>No Data Found</h1>
          </div>
        ) : (
          data?.data?.map((item: Object, index) => {
            const LucidIcon = Icons[item.category?.icon];
            return (
              <div
                key={index}
                className="flex mt-5 justify-between hover:bg-muted/50 p-3 -m-3 transition-all duration-200 cursor-pointer border-r-2 border-r-transparent hover:border-r-primary"
              >
                <div className="flex w-full">
                  <div className="p-2 border rounded-md  w-12 flex justify-center items-center">
                    <LucidIcon
                      className="text-foreground"
                      width={25}
                      height={25}
                    />
                  </div>
                  <div className="ml-3 w-full">
                    <div className="flex justify-between">
                      <div>
                        <h1
                          className="truncate max-w-[150px]"
                          title={item?.description} // full on hover
                        >
                          {item?.description}
                        </h1>
                      </div>
                      <div>
                        <h1
                          className={`${
                            item?.type === "Expense"
                              ? "text-destructive"
                              : item?.type === "Income"
                              ? "text-success"
                              : "text-primary"
                          } font-medium`}
                        >
                          ₱
                          {item?.amount.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </h1>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-400 text-xs">
                        {item?.category?.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {moment(item?.date).format("MMM DD, h:mm A")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default TransactionHistory;
