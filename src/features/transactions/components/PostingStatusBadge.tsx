import { Badge } from "@/shared/components/ui/badge";
import type { TransactionRow } from "@/shared/types";
import { CircleCheck, Clock } from "lucide-react";
import moment from "moment";

// Card purchases are stored as Completed (they count against the card right
// away), so their status is whether the bank has posted them.
export const isCardPurchase = (row?: TransactionRow | null) =>
  row?.type !== "Income" &&
  row?.type !== "Transfer" &&
  row?.asset?.category === "CREDIT";

export const PostingStatusBadge = ({
  row,
  className = "",
}: {
  row: TransactionRow;
  className?: string;
}) => {
  if (row.isPending) {
    return (
      <Badge
        variant="outline"
        className={`gap-1 border-warning/40 bg-warning/15 text-warning-foreground ${className}`}
        title="Not posted by the bank yet"
      >
        <Clock className="h-3 w-3" />
        <span className="hidden min-[380px]:inline">Pending</span>
      </Badge>
    );
  }

  const posted = row.postedDate ?? row.date;
  return (
    <Badge
      variant="outline"
      className={`gap-1 ${className}`}
      title={
        posted ? `Posted ${moment(posted).format("MMM D, YYYY")}` : "Posted"
      }
    >
      <CircleCheck className="h-3 w-3" />
      <span className="hidden min-[380px]:inline">Posted</span>
    </Badge>
  );
};
