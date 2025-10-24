import { formatString } from "@/shared/utils/CustomFunctions";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { useGetExpensesQuery } from "@/features/transactions/api/transaction/expensesApi";
import NoData from "@/assets/images/empty-box.png";
import { Card } from "@/shared/components/ui/card";
import { useGetTransactionHistoryQuery } from "@/features/transactions/api/transaction";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { motion } from "motion/react";
import VirtualizedInfiniteList from "@/shared/components/VirtualizedInfiniteList";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { data, isFetching } = useGetTransactionHistoryQuery({
    pageSize: 5,
    pageIndex,
  });

  const observer = useRef();

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -40, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        ease: [0.25, 0.1, 0.25, 1],
        duration: 0.4,
      },
    },
  };

  const lastPostRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          pageIndex !== data?.data?.totalPages - 1
        ) {
          setPageIndex((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching]
  );

  useEffect(() => {
    if (data?.data?.filter?.length) {
      setTransactions((prev) => [...prev, ...data?.data?.filter]);
    }
  }, [data]);

  console.log(transactions);

  return (
    <Card className="rounded-lg 2xl:h-[342px] col-span-full p-0 md:col-span-2 lg:col-span-1 border">
      <div className="flex justify-between p-6 pb-4 border-b items-center">
        <h1 className="gap-3 text-xl font-semibold">Recent Transactions</h1>
        <Link to={"/transactions"}>See All</Link>
      </div>

      <div className="w-full">
        {isFetching && transactions.length === 0 ? (
          <div className="py-4 px-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col gap-5 justify-center items-center h-full">
            <img src={NoData} width={150} />
            <h1>No Data Found</h1>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            <VirtualizedInfiniteList
              items={transactions}
              itemSize={70}
              height={270}
              ref={lastPostRef}
              isFetching={isFetching}
              renderRow={(item, index) => {
                const LucidIcon = Icons[item.category?.icon];
                return (
                  <motion.div
                    key={`${item.id}-${index}`}
                    variants={itemVariants}
                    className="flex justify-between hover:bg-muted/50 p-3 transition-all duration-200 cursor-pointer border-r-2 border-r-transparent hover:border-r-primary"
                  >
                    <div className="flex w-full">
                      <div className="p-2 border rounded-md w-12 h-12 flex-shrink-0 flex justify-center items-center">
                        <LucidIcon
                          className="text-foreground"
                          width={25}
                          height={25}
                        />
                      </div>
                      <div className="ml-3 w-full min-w-0">
                        <div className="flex justify-between gap-2">
                          <h1
                            className="truncate flex-1"
                            title={item?.description}
                          >
                            {item?.description}
                          </h1>
                          <h1
                            className={`${
                              item?.type === "Expense"
                                ? "text-destructive"
                                : item?.type === "Income"
                                ? "text-success"
                                : "text-primary"
                            } font-medium whitespace-nowrap`}
                          >
                            ₱
                            {item?.amount.toLocaleString("en-PH", {
                              minimumFractionDigits: 2,
                            })}
                          </h1>
                        </div>
                        <div className="flex justify-between gap-2">
                          <p className="text-gray-400 text-xs truncate">
                            {item?.category?.name}
                          </p>
                          <p className="text-gray-400 text-xs whitespace-nowrap">
                            {moment(item?.date).format("MMM DD, h:mm A")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }}
            />
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default TransactionHistory;
