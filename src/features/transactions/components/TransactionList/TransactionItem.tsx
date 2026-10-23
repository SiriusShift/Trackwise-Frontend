import { IRootState } from "@/app/store";
import { StatusIcon } from "@/features/transactions/components/StatusIcon";
import { Badge } from "@/shared/components/ui/badge";
import useLongPress from "@/shared/hooks/useLongPress";
import { setActionShow, setActiveRow } from "@/shared/slices/activeSlice";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import * as Icons from "lucide-react";
import moment from "moment";
import { motion, useReducedMotion } from "motion/react";
import React from "react";
import type { TransactionRow } from "@/shared/types";
import { getLucideIcon } from "@/shared/utils/icons";
import { useDispatch, useSelector } from "react-redux";

// Colour treatment per transaction type
const TYPE_TONES = {
  Expense: {
    text: "text-destructive",
    tile: "bg-destructive/10 text-destructive",
    badge: "bg-destructive text-destructive-foreground",
    stripe: "bg-destructive",
    icon: Icons.ArrowUpRight,
  },
  Income: {
    text: "text-success",
    tile: "bg-success/10 text-success",
    badge: "bg-success text-success-foreground",
    stripe: "bg-success",
    icon: Icons.ArrowDownLeft,
  },
  Transfer: {
    text: "text-primary",
    tile: "bg-primary/10 text-primary",
    badge: "bg-primary text-primary-foreground",
    stripe: "bg-primary",
    icon: Icons.ArrowLeftRight,
  },
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

  const LucidIcon = getLucideIcon(item?.category?.icon);
  const statusIcon = item?.status
    ? StatusIcon[item.status as keyof typeof StatusIcon]
    : null;

  const isTransfer = item?.type === "Transfer";
  const tone = TYPE_TONES[item?.type as keyof typeof TYPE_TONES] ?? TYPE_TONES.Transfer;
  const TypeIcon = tone.icon;
  const sign = item?.type === "Expense" ? "−" : item?.type === "Income" ? "+" : "";
  const accountLabel = isTransfer
    ? [item?.fromAsset?.name, item?.toAsset?.name].filter(Boolean).join(" → ")
    : item?.asset?.name;

  const longPressProps = useLongPress(() => {
    dispatch(setActionShow(true));
  }, 1000); // hold 1.5 seconds

  const handleClick = () => {
    dispatch(setActiveRow(item));
    dispatch(setActionShow(true));
    // dispatch(setOpenDialog(true));
  };

  return (
    <motion.div
      key={`${item.id}-${index}`}
      // variants={itemVariants}
      initial={false}
      animate={
        isRemoving
          ? { opacity: 0, x: reduceMotion ? 0 : -48, scale: reduceMotion ? 1 : 0.96 }
          : { opacity: 1, x: 0, scale: 1 }
      }
      transition={{ duration: 0.25, ease: [0.4, 0, 1, 1] }}
      onAnimationComplete={() => {
        if (isRemoving) onExited?.(item.id);
      }}
      onClick={handleClick}
      className={`group relative flex flex-col overflow-hidden border rounded-xl shadow-xs hover:shadow-md active:scale-[0.99] transition-[box-shadow,background-color,transform] duration-200 cursor-pointer bg-card hover:bg-muted/40 p-3 pl-4 ${
        isRemoving ? "pointer-events-none" : ""
      }`}
      {...longPressProps}
    >
      {/* Type accent stripe */}
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${tone.stripe}`}
      />

      {/* Top row: icon + main info */}
      <div className="flex items-center w-full gap-3">
        {/* Icon */}
        <div
          className={`relative w-11 h-11 shrink-0 rounded-xl flex justify-center items-center ${tone.tile}`}
        >
          <LucidIcon width={22} height={22} />
          <span
            className={`absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-card ${tone.badge}`}
          >
            <TypeIcon className="h-2.5 w-2.5" strokeWidth={3} />
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline gap-2">
            <span
              className="block truncate font-semibold text-[15px] leading-tight"
              title={item?.description}
            >
              {item?.description}
            </span>
            <span
              className={`block ${tone.text} font-bold text-base tabular-nums whitespace-nowrap`}
            >
              {sign}
              {formatCurrency(item.amount, currency)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground min-w-0">
            <span className="truncate shrink-0 max-w-[45%]">
              {item?.category?.name}
            </span>
            {accountLabel && (
              <>
                <span aria-hidden className="h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                <span className="flex items-center gap-1 truncate">
                  {/* {isTransfer ? (
                    <Icons.ArrowLeftRight className="h-3 w-3 shrink-0" />
                  ) : (
                    <Icons.Wallet className="h-3 w-3 shrink-0" />
                  )} */}
                  <span className="truncate">{accountLabel}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: date, status, recurring */}
      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-dashed">
        <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
          <Icons.CalendarDays className="h-3.5 w-3.5" />
          {moment(item?.date).format("MMM DD · h:mm A")}
        </span>

        <div className="ml-auto flex items-center gap-1.5">
          {item?.recurringTemplate && (
            <span
              className="flex items-center gap-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium px-2 py-0.5"
              title="Recurring"
            >
              <Icons.Repeat className="h-3 w-3" />
              <span className="hidden min-[380px]:inline">Recurring</span>
            </span>
          )}
          {item?.status && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 rounded-full text-[11px] px-2 py-0.5 [&_svg]:mr-0 [&_svg]:size-3"
            >
              {statusIcon}
              {item?.status}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default TransactionItem;
