import { IRootState } from "@/app/store";
import { getStatus } from "@/features/dashboard/components/widgets/DueCalendar";
import { commonDialogProps } from "@/shared/types";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import * as LucideIcons from "lucide-react";
import { CircleHelp, ReceiptText } from "lucide-react";
import { useSelector } from "react-redux";

import moment from "moment";
import { Badge } from "../ui/badge";
import CommonDialog from "./CommonDialog";

interface BillDialogProps extends commonDialogProps {
  data?: {
    amount: number;
    nextDueDate?: string | Date;
    category?: {
      icon?: keyof typeof LucideIcons;
    };
  };
}

const BillDialog = ({ open, setOpen, data }: BillDialogProps) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);

  const today = moment();
  const dueDate = data?.nextDueDate ? moment(data.nextDueDate) : null;

  const isOverdue = dueDate?.isBefore(today, "day") ?? false;
  const isDueToday = dueDate?.isSame(today, "day") ?? false;
  const daysLate = dueDate ? today.diff(dueDate, "days") : 0;
  const status = getStatus(data?.nextDueDate);

  const Icon =
    data?.category?.icon && data.category.icon in LucideIcons
      ? LucideIcons[data.category.icon]
      : CircleHelp;

  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      title="Bill Details"
      icon={ReceiptText}
    >
      <div className="p-5">
        <div className="flex flex-col items-center gap-3 pb-6">
          <div className="rounded-2xl border p-4">
            <Icon className="h-6 w-6" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold">
              {formatCurrency(data?.amount ?? 0, currency)}
            </h1>

            {status && (
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </Badge>
            )}

            {isOverdue && (
              <p className="text-sm font-medium text-muted-foreground">
                {daysLate} {daysLate === 1 ? "day" : "days"} overdue
              </p>
            )}

            {isDueToday && (
              <p className="text-sm font-medium text-muted-foreground">
                Due today
              </p>
            )}
          </div>
        </div>
      </div>
    </CommonDialog>
  );
};

export default BillDialog;
