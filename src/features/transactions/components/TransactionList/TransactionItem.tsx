import { IRootState } from "@/app/store";
import { cn } from "@/lib/utils";
import useLongPress from "@/shared/hooks/useLongPress";
import { setActionShow, setActiveRow } from "@/shared/slices/activeSlice";
import type { TransactionRow } from "@/shared/types";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { getLucideIcon } from "@/shared/utils/icons";
import { CircleAlert, Clock, Repeat } from "lucide-react";
import moment from "moment";
import { motion, useReducedMotion } from "motion/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { isCardPurchase } from "../PostingStatusBadge";

// Statuses that need no label: the normal, finished state
const SETTLED_STATUSES = new Set(["Completed", "Paid", "Received"]);

type RowAlert = {
  label: string;
  className: string;
  icon: typeof Clock;
};

const ALERT_TONES = {
  waiting: "bg-warning/15 text-warning-foreground",
  problem: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
};

// A status label is shown only when the user may need to act on the row
const getRowAlert = (item: TransactionRow): RowAlert | null => {
  if (isCardPurchase(item) && item.isPending) {
    return { label: "Pending", className: ALERT_TONES.waiting, icon: Clock };
  }
  const status = item.status;
  if (!status || SETTLED_STATUSES.has(status)) return null;
  switch (status) {
    case "Pending":
    case "Partial":
      return { label: status, className: ALERT_TONES.waiting, icon: Clock };
    case "Overdue":
    case "Failed":
      return {
        label: status,
        className: ALERT_TONES.problem,
        icon: CircleAlert,
      };
    default:
      return { label: status, className: ALERT_TONES.muted, icon: CircleAlert };
  }
};

const TransactionItem = React.memo(function TransactionItem({
  item,
  index,
  onExited,
}: {
  item: TransactionRow;
  index: number;
  onExited?: (id: number) => void;
}) {
  const dispatch = useDispatch();
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const isRemoving = useSelector((state: IRootState) =>
    state.active.removingIds.includes(item.id),
  );
  const reduceMotion = useReducedMotion();

  const CategoryIcon = getLucideIcon(item?.category?.icon);
  const categoryColor = item?.category?.color;
  const rowAlert = getRowAlert(item);
  const AlertIcon = rowAlert?.icon;
  const isCancelled = item?.status === "Cancelled";

  const isTransfer = item?.type === "Transfer";
  const isIncome = item?.type === "Income";
  const sign = item?.type === "Expense" ? "−" : isIncome ? "+" : "";
  const accountLabel = isTransfer
    ? [item?.fromAsset?.name, item?.toAsset?.name].filter(Boolean).join(" → ")
    : item?.asset?.name;

  const subtitle = [
    item?.category?.name,
    accountLabel,
    moment(item?.date).format("h:mm A"),
  ]
    .filter(Boolean)
    .join(" · ");

  const longPressProps = useLongPress(() => {
    dispatch(setActionShow(true));
  }, 1000);

  const handleOpen = () => {
    dispatch(setActiveRow(item));
    dispatch(setActionShow(true));
  };

  return (
    <motion.div
      key={`${item.id}-${index}`}
      role="button"
      tabIndex={isRemoving ? -1 : 0}
      aria-label={`${item?.description}, ${sign}${formatCurrency(item.amount, currency)}`}
      initial={false}
      animate={
        isRemoving
          ? {
              opacity: 0,
              x: reduceMotion ? 0 : -48,
              scale: reduceMotion ? 1 : 0.96,
            }
          : { opacity: 1, x: 0, scale: 1 }
      }
      transition={{ duration: 0.25, ease: [0.4, 0, 1, 1] }}
      onAnimationComplete={() => {
        if (isRemoving) onExited?.(item.id);
      }}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left outline-hidden transition-colors",
        "hover:bg-muted/40 active:bg-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        isRemoving && "pointer-events-none",
      )}
      {...longPressProps}
    >
      {/* Category tile, tinted with the category colour */}
      <span
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-muted text-muted-foreground"
        style={
          categoryColor
            ? {
                backgroundColor: `color-mix(in srgb, ${categoryColor} 15%, transparent)`,
                color: categoryColor,
              }
            : undefined
        }
      >
        <CategoryIcon width={20} height={20} />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5">
            <span
              className="truncate text-sm font-semibold leading-tight"
              title={item?.description}
            >
              {item?.description}
            </span>
            {item?.recurringTemplate && (
              <Repeat
                role="img"
                aria-label="Recurring"
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
              />
            )}
          </span>
          <span
            className={cn(
              "whitespace-nowrap text-sm font-semibold tabular-nums",
              isIncome && "text-success",
              isCancelled && "text-muted-foreground line-through",
            )}
          >
            {sign}
            {formatCurrency(item.amount, currency)}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <span className="min-w-0 truncate">{subtitle}</span>
          {rowAlert && AlertIcon && (
            <span
              className={cn(
                "ml-auto flex shrink-0 items-center gap-1 rounded-full px-2 py-px text-[11px] font-semibold",
                rowAlert.className,
              )}
            >
              <AlertIcon className="h-3 w-3" aria-hidden />
              {rowAlert.label}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default TransactionItem;
