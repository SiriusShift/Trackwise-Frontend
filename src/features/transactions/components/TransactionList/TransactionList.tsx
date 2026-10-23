import { IRootState } from "@/app/store";
import VirtualizedInfiniteList from "@/shared/components/VirtualizedInfiniteList";
import { clearRemoving } from "@/shared/slices/activeSlice";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
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
  const dispatch = useDispatch();
  const removingIds = useSelector(
    (state: IRootState) => state.active.removingIds,
  );
  // Archived rows whose exit animation has finished
  const [exitedIds, setExitedIds] = useState<Set<number>>(new Set());

  const handleExited = useCallback((id: number) => {
    setExitedIds((prev) => new Set(prev).add(id));
  }, []);

  // Hide exited rows until the refetch drops them from the data
  const visibleTransactions = useMemo(
    () =>
      transactions?.filter(
        (row) => !(removingIds.includes(row.id) && exitedIds.has(row.id)),
      ),
    [transactions, removingIds, exitedIds],
  );

  // Once the server data no longer has an archived row, forget about it
  useEffect(() => {
    if (!transactions || !removingIds.length) return;
    const present = new Set(transactions.map((row) => row.id));
    const gone = removingIds.filter((id) => !present.has(id));
    if (!gone.length) return;
    dispatch(clearRemoving(gone));
    setExitedIds((prev) => {
      const next = new Set(prev);
      gone.forEach((id) => next.delete(id));
      return next;
    });
  }, [transactions, removingIds, dispatch]);

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
      {isFetching && !visibleTransactions?.length ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <TransactionListSkeleton key={i} />
          ))}
        </div>
      ) : visibleTransactions && visibleTransactions.length > 0 ? (
        <VirtualizedInfiniteList
          items={visibleTransactions}
          itemSize={130}
          height={Math.min(visibleTransactions.length * 130, 520)}
          ref={ref}
          isFetching={isFetching}
          onLoadMore={onLoadMore}
          renderRow={(item, index) => (
            <TransactionItem
              item={item}
              index={index}
              onExited={handleExited}
            />
          )}
        />
      ) : (
        <Card className="flex flex-col h-64 items-center justify-center">
          <img src={NoData} width={250} alt="" />
          <span className="block font-semibold">No transactions found</span>
        </Card>
      )}
    </motion.div>
  );
});

export default TransactionList;
