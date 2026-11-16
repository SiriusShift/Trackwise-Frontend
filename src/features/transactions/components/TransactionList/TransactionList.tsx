import { IRootState } from "@/app/store";
import NoData from "@/assets/images/noData.svg";
import { Card } from "@/shared/components/ui/card";
import { clearRemoving } from "@/shared/slices/activeSlice";
import type { TransactionRow } from "@/shared/types";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import moment from "moment";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TransactionItem from "./TransactionItem";
import TransactionListSkeleton from "./TransactionListSkeleton";

interface TransactionListProps {
  transactions?: TransactionRow[];
  isFetching: boolean;
  onLoadMore?: () => void;
}

interface DayGroup {
  key: string;
  label: string;
  // Signed total for the day; null when it has no meaning (transfers)
  total: number | null;
  rows: TransactionRow[];
}

const dayLabel = (date: string | undefined) => {
  const day = moment(date);
  if (day.isSame(moment(), "day")) return `Today · ${day.format("ddd, MMM D")}`;
  if (day.isSame(moment().subtract(1, "day"), "day")) {
    return `Yesterday · ${day.format("ddd, MMM D")}`;
  }
  return day.format(
    day.isSame(moment(), "year") ? "ddd, MMM D" : "ddd, MMM D, YYYY",
  );
};

// Consecutive rows on the same day share a group, keeping the server's order
const groupByDay = (rows: TransactionRow[]): DayGroup[] => {
  const groups: DayGroup[] = [];
  for (const row of rows) {
    const key = moment(row.date).format("YYYY-MM-DD");
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.rows.push(row);
    } else {
      groups.push({ key, label: dayLabel(row.date), total: null, rows: [row] });
    }
  }
  for (const group of groups) {
    const sign = (row: TransactionRow) =>
      row.type === "Expense" ? -1 : row.type === "Income" ? 1 : 0;
    group.total = group.rows.some((row) => sign(row) !== 0)
      ? group.rows.reduce(
          (sum, row) =>
            row.status === "Cancelled"
              ? sum
              : sum + sign(row) * Number(row.amount ?? 0),
          0,
        )
      : null;
  }
  return groups;
};

const TransactionList = ({
  transactions,
  isFetching,
  onLoadMore,
}: TransactionListProps) => {
  const dispatch = useDispatch();
  const reduceMotion = useReducedMotion();
  const currency = useSelector((state: IRootState) => state.settings.currency);
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

  const groups = useMemo(
    () => groupByDay(visibleTransactions ?? []),
    [visibleTransactions],
  );

  // Ask for the next page when the end of the list scrolls into view. The
  // observer is recreated after each load, so a short page that leaves the end
  // still on screen keeps loading until the screen is full.
  const endRef = useRef<HTMLDivElement | null>(null);
  const rowCount = visibleTransactions?.length ?? 0;
  useEffect(() => {
    const end = endRef.current;
    if (!end || !onLoadMore || isFetching || rowCount === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMore();
      },
      { rootMargin: "240px" },
    );
    observer.observe(end);
    return () => observer.disconnect();
  }, [onLoadMore, isFetching, rowCount]);

  if (isFetching && rowCount === 0) {
    return (
      <div
        className="divide-y overflow-hidden rounded-xl border bg-card"
        aria-busy="true"
        aria-label="Loading transactions"
      >
        {[...Array(5)].map((_, i) => (
          <TransactionListSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (rowCount === 0) {
    return (
      <Card className="flex h-64 flex-col items-center justify-center">
        <img src={NoData} width={250} alt="" />
        <span className="block font-semibold">No transactions found</span>
      </Card>
    );
  }

  let runningIndex = 0;

  return (
    <div>
      <div className="overflow-hidden rounded-xl border bg-card">
        {groups.map((group) => (
          <section key={group.key} aria-label={group.label}>
            <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2 text-xs not-first:border-t">
              <h3 className="font-semibold text-foreground/80">
                {group.label}
              </h3>
              {group.total !== null && (
                <span className="tabular-nums text-muted-foreground">
                  {group.total < 0 ? "−" : group.total > 0 ? "+" : ""}
                  {formatCurrency(Math.abs(group.total), currency)}
                </span>
              )}
            </div>
            <ul className="divide-y">
              {group.rows.map((row) => (
                <motion.li
                  key={row.id}
                  layout={reduceMotion ? false : "position"}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <TransactionItem
                    item={row}
                    index={runningIndex++}
                    onExited={handleExited}
                  />
                </motion.li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div ref={endRef} aria-hidden className="h-px" />
      {isFetching && (
        <p
          role="status"
          className="py-3 text-center text-xs text-muted-foreground"
        >
          Loading more…
        </p>
      )}
    </div>
  );
};

export default TransactionList;
