import React from "react";
import * as Icons from "lucide-react";
import {StatusIcon} from "@/features/transactions/components/statusIcon";
import { motion } from "motion/react";
import { Badge } from "@/shared/components/ui/badge";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setActionShow, setActiveRow, setOpenDialog } from "@/shared/slices/activeSlice";
import useLongPress from "@/shared/hooks/useLongPress";
const TransactionItem = React.memo(function TransactionItem({
  item,
  index,
}) {
  const dispatch = useDispatch()
  const LucidIcon = Icons[item.category?.icon];
  const statusIcon = StatusIcon[item?.status];

  const longPressProps = useLongPress(() => {
    console.log("test");
    dispatch(setActionShow(true));
  }, 1000); // hold 1.5 seconds

  const handleClick = () => {
    dispatch(setActiveRow(item));
    dispatch(setOpenDialog(true));
  };

  return (
    <motion.div
      key={`${item.id}-${index}`}
      // variants={itemVariants}
      onClick={handleClick}
      className="flex flex-col border rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer bg-card hover:bg-muted/50 p-3"
      {...longPressProps}
    >
      {/* Top row: icon + main info */}
      <div className="flex items-center w-full">
        {/* Icon */}
        <div className="p-2 border rounded-md w-12 h-12 flex-shrink-0 flex justify-center items-center">
          <LucidIcon className="text-foreground" width={25} height={25} />
        </div>

        {/* Details */}
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h1
              className="truncate font-medium text-sm leading-tight"
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
              } font-semibold text-base whitespace-nowrap ml-2`}
            >
              ₱
              {item?.amount.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </h1>
          </div>

          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-muted-foreground truncate">
              {item?.category?.name}
            </p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {moment(item?.date).format("MMM DD, h:mm A")}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom row: status + recurring indicator */}
      <div className="flex justify-between items-center mt-3">
        {item?.status &&         <Badge
          variant="outline"
          className="flex items-center gap-1 text-xs px-2 py-0.5"
        >
          {statusIcon}
          {item?.status}
        </Badge>}


        {item?.recurringTemplate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icons.Repeat className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Recurring</span>
          </div>
        )}
      </div>
    </motion.div>
  );
});

export default TransactionItem;
