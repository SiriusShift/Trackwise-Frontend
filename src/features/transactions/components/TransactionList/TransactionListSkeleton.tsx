import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import React from "react";

const TransactionListSkeleton = () => {
  return (
    <Card className="w-full rounded-md h-[100px] p-3">
      <div className="flex items-center w-full">
        <Skeleton className="w-12 h-12 border rounded-md flex-shrink-0" />
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-24" />

            {/* <h1
                      className={`${
                        item?.type === "Expense"
                          ? "text-destructive"
                          : item?.type === "Income"
                          ? "text-success"
                          : "text-primary"
                      } font-semibold text-base whitespace-nowrap ml-2`}
                    >
                      ₱
                      {item?.amount.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </h1> */}
          </div>

          <div className="flex justify-between items-center mt-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex justify-between items-center mt-3">
            <Skeleton className="h-5 w-16"/>
            <Skeleton className="h-5 w-5"/>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionListSkeleton;
