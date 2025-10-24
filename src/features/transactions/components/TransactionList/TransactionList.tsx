import VirtualizedInfiniteList from "@/shared/components/VirtualizedInfiniteList";
import React, { forwardRef } from "react";
import { motion } from "motion/react";
import * as Icons from "lucide-react";
import moment from "moment";
import { Badge } from "@/shared/components/ui/badge";
import StatusIcon from "../statusIcon";
import useLongPress from "@/shared/hooks/useLongPress";
import {
  setActionShow,
  setActiveRow,
  setOpenDialog,
} from "@/shared/slices/activeSlice";
import { useDispatch } from "react-redux";
import { Card } from "@/shared/components/ui/card";
import NoData from "@/assets/images/noData.svg";
import TransactionListSkeleton from "./TransactionListSkeleton";
import TransactionItem from "./TransactionItem";
const TransactionList = forwardRef(function TransactionList(
  { transactions, isFetching },
  ref
) {
  const dispatch = useDispatch();
  const containerVariants = {
    hidden: { opacity: 0 },
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

  return (
    <motion.div initial="hidden" animate="visible">
      {isFetching ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <TransactionListSkeleton />
          ))}
        </div>
      ) : transactions?.length > 0 ? (
        <VirtualizedInfiniteList
          items={transactions}
          itemSize={130}
          height={transactions?.length * 130}
          ref={ref}
          isFetching={isFetching}
          renderRow={(item, index) => (
            <TransactionItem item={item} index={index} />
          )}
        />
      ) : (
        <Card className="flex flex-col h-64 items-center justify-center">
          <img src={NoData} width={250} />
          <h1 className="font-semibold">No transactions found</h1>
        </Card>
      )}
    </motion.div>
  );
});

export default TransactionList;
