import VirtualizedInfiniteList from "@/shared/components/VirtualizedInfiniteList";
import { forwardRef } from "react";
import { motion } from "motion/react";
import { Card } from "@/shared/components/ui/card";
import NoData from "@/assets/images/noData.svg";
import TransactionListSkeleton from "./TransactionListSkeleton";
import TransactionItem from "./TransactionItem";
import type { TransactionRow } from "@/shared/types";

interface TransactionListProps {
  transactions?: TransactionRow[];
  isFetching: boolean;
  onLoadMore?: () => void;
}

const TransactionList = forwardRef<HTMLDivElement, TransactionListProps>(function TransactionList(
  { transactions, isFetching, onLoadMore },
  ref
) {
  // const dispatch = useDispatch();
  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.1,
  //       delayChildren: 0.1,
  //     },
  //   },
  // };

  // const itemVariants = {
  //   hidden: { x: -40, opacity: 0 },
  //   visible: {
  //     x: 0,
  //     opacity: 1,
  //     transition: {
  //       ease: [0.25, 0.1, 0.25, 1],
  //       duration: 0.4,
  //     },
  //   },
  // };

  return (
    <motion.div initial="hidden" animate="visible">
      {isFetching && !transactions?.length ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <TransactionListSkeleton key={i} />
          ))}
        </div>
      ) : transactions && transactions.length > 0 ? (
        <VirtualizedInfiniteList
          items={transactions}
          itemSize={130}
          height={Math.min(transactions.length * 130, 520)}
          ref={ref}
          isFetching={isFetching}
          onLoadMore={onLoadMore}
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
