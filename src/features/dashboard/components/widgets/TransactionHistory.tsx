import { formatCurrency, formatString } from "@/shared/utils/CustomFunctions";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { useGetExpensesQuery } from "@/features/transactions/api/transaction/expensesApi";
import NoData from "@/assets/images/file.png";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/card";
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

  console.log(data);

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
    [isFetching],
  );

  useEffect(() => {
    if (data?.data?.filter?.length) {
      setTransactions((prev) => [...prev, ...data?.data?.filter]);
    }
  }, [data]);

  console.log(transactions);

  return (
    <Card
      className="relative border border-border/60 bg-card flex flex-col rounded-2xl shadow-sm col-span-full md:col-span-4 xl:col-span-1 transition-shadow hover:shadow-md"
      style={{
        backgroundImage: `
          radial-gradient(circle at 80% 120%, rgba(96, 165, 250, 0.25) 0%, transparent 60%),
          radial-gradient(circle at 20% 120%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)
        `,
      }}
    >
      {" "}
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Recent Transactions
          </CardTitle>
          <Link
            to="/transactions"
            className="text-xs text-primary hover:underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            See All →
          </Link>
        </div>
      </CardHeader>
      <div className="w-full flex-1 mt-3">
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
          <VirtualizedInfiniteList
            items={transactions}
            itemSize={70}
            height={280}
            ref={lastPostRef}
            isFetching={isFetching}
            dataLength={data?.data?.totalCount}
            renderRow={(item, index) => {
              const LucidIcon = Icons[item.category?.icon];
              return (
                <motion.div
                  key={`${item.id}-${index}`}
                  variants={itemVariants}
                  className="flex items-center p-2 gap-2 rounded-lg ml-6 mr-3 duration-150 cursor-pointer border border-border/50 bg-muted/30 hover:bg-muted/60 "
                >
                  <div className="flex w-full">
                    <div className="p-2 border rounded-md w-10 h-10 flex-shrink-0 flex justify-center items-center">
                      <LucidIcon
                        className="text-foreground"
                        width={25}
                        height={25}
                      />
                    </div>
                    <div className="ml-3 w-full min-w-0">
                      <div className="flex justify-between gap-2">
                        <h1
                          className="truncate text-sm flex-1"
                          title={item?.description}
                        >
                          {item?.description}
                        </h1>
                        <p
                          className={`${
                            item?.type === "Expense"
                              ? "text-destructive"
                              : item?.type === "Income"
                                ? "text-success"
                                : item?.type === "Transfer"
                                  ? item.category.name === "Internal"
                                    ? "text-primary"
                                    : "text-destructive"
                                  : ""
                          } text-sm whitespace-nowrap`}
                        >
                          {formatCurrency(item?.amount)}
                        </p>
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
        )}
      </div>
    </Card>
  );
};

export default TransactionHistory;
