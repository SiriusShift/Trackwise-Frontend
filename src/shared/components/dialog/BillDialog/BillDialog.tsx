import { IRootState } from "@/app/store";
import { commonDialogProps } from "@/shared/types";
import { formatCurrency, getStatus } from "@/shared/utils/CustomFunctions";
import * as LucideIcons from "lucide-react";
import { CircleHelp, ReceiptText } from "lucide-react";
import { useSelector } from "react-redux";

import {
  useGetBillPaymentsQuery,
  useGetBillQuery,
} from "@/features/transactions/api/transaction/expensesApi";
import { frequencies } from "@/shared/constants/dateConstants";
import moment from "moment";
import { useMemo, useState } from "react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import CommonDialog from "../CommonDialog";
import PayDialog from "../PayDialog";
// import SkipDialog from "../SkipDialog";
import { cn } from "@/lib/utils";
import SkipDialog from "../SkipDialog";
import { InfoRow } from "../ViewDialog/InfoRow";
import ButtonSkeleton from "./ButtonSkeleton";
import BillDialogSkeleton from "./InfoSkeleton";

interface BillDialogProps extends commonDialogProps {
  data?: {
    id: string;
    amount: number;
    nextDueDate?: string | Date;
    category?: {
      icon?: keyof typeof LucideIcons;
    };
  };
}

const BillDialog = ({ open, setOpen, data }: BillDialogProps) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSkip, setOpenSkip] = useState(false);
  const currency = useSelector((state: IRootState) => state.settings.currency);

  const { currentData: bill, isFetching: billLoading } = useGetBillQuery(
    data?.id,
    {
      skip: !data?.id,
    },
  );
  const { currentData: history, isFetching: historyLoading } =
    useGetBillPaymentsQuery(data?.id, {
      skip: !data?.id,
    });
  const today = moment();
  const dueDate = bill?.nextDueDate ? moment(bill.nextDueDate) : null;

  const isOverdue = dueDate?.isBefore(today, "day") ?? false;
  const isDueToday = dueDate?.isSame(today, "day") ?? false;
  const daysLate = dueDate ? today.diff(dueDate, "days") : 0;
  const status = getStatus(bill?.nextDueDate);

  const Icon =
    bill?.category?.icon && bill.category.icon in LucideIcons
      ? LucideIcons[bill.category.icon]
      : CircleHelp;

  const frequency = useMemo(
    () =>
      frequencies.find(
        (f) => f.unit === bill?.unit && f.interval === bill?.interval,
      ),
    [bill?.unit, bill?.interval],
  );

  const unit =
    bill?.interval === 1
      ? bill?.unit?.toLowerCase()
      : `${bill?.unit?.toLowerCase()}s`;
  const frequencyLabel = frequency?.name ?? `Every ${bill?.interval} ${unit}`;
  const scheduleObject = {
    behaviour: bill?.behaviour,
    label: frequencyLabel,
  };

  // Map the bill's recurrence unit to a moment.js duration key so the
  // "next due date if paid today" preview reflects the real cadence
  // instead of always assuming monthly.
  const momentUnitMap: Record<string, moment.unitOfTime.DurationConstructor> = {
    DAY: "days",
    WEEK: "weeks",
    MONTH: "months",
    YEAR: "years",
  };

  const nextDueDatePreview =
    bill?.nextDueDate && bill?.unit && bill?.interval
      ? moment(bill.nextDueDate)
          .add(bill.interval, momentUnitMap[bill.unit] ?? "months")
          .format("MMMM DD, YYYY")
      : bill?.nextDueDate
        ? moment(bill.nextDueDate).format("MMMM DD, YYYY")
        : "—";

  return (
    <>
      <CommonDialog
        open={open}
        setOpen={setOpen}
        title="Bill Details"
        icon={ReceiptText}
      >
        {billLoading ? (
          <BillDialogSkeleton />
        ) : (
          <div className="p-4">
            <div className="flex flex-col items-center gap-3 pb-6">
              <div className="rounded-2xl border p-4">
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-center space-y-1">
                <h1 className="text-3xl font-bold">
                  {formatCurrency(bill?.amount ?? 0, currency)}
                </h1>

                {status && (
                  <Badge
                    variant="outline"
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                    />
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
            <div className="flex flex-col gap-3">
              <InfoRow
                icon={LucideIcons.Calendar1}
                label="Due Date"
                value={moment(bill?.nextDueDate)
                  .format("MMMM DD, YYYY")
                  .toLocaleString()}
              />
              <Separator />
              <InfoRow
                icon={LucideIcons.Wallet}
                label="Account"
                value={bill?.fromAsset?.name}
              />
              <Separator />
              <InfoRow
                icon={LucideIcons.Tag}
                label="Category"
                value={bill?.category?.name}
              />
              <Separator />
              <InfoRow
                icon={LucideIcons.Repeat}
                label="Schedule"
                value={scheduleObject}
              />
              <Separator />
              <InfoRow
                icon={LucideIcons.CalendarClock}
                label="Next Due Date (if paid today)"
                value={nextDueDatePreview}
              />
            </div>
          </div>
        )}

        <div className="p-4">
          <h2 className="mb-3 text-sm font-bold">Payment History</h2>

          {historyLoading ? (
            <div className="space-y-3">
              <div className="animate-pulse rounded-xl border p-4 space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
            </div>
          ) : history?.length ? (
            <div className="space-y-3">
              {history.map((payment) => {
                const isSkipped = payment.status === "Skipped";
                const due = payment?.recurringDueDate;
                const daysLate =
                  !isSkipped && due
                    ? moment(payment.date).diff(due, "days")
                    : 0;

                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "rounded-full p-2",
                          isSkipped ? "bg-muted" : "bg-primary/10",
                        )}
                      >
                        {isSkipped ? (
                          <LucideIcons.CalendarX className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <LucideIcons.CalendarCheck className="h-4 w-4 text-primary" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm">
                          {moment(isSkipped ? due : payment.date).format(
                            "MMMM DD, YYYY",
                          )}
                        </p>
                        <p className="font-medium text-xs text-muted-foreground">
                          {isSkipped
                            ? "Skipped"
                            : daysLate > 0
                              ? `${daysLate} ${daysLate > 1 ? "days" : "day"} late`
                              : "Paid on time"}
                        </p>
                      </div>
                    </div>

                    <p
                      className={cn(
                        "font-medium",
                        isSkipped && "text-muted-foreground line-through",
                      )}
                    >
                      {formatCurrency(payment.amount, currency)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-5 text-center">
              <h3>No payments yet</h3>
            </div>
          )}
        </div>

        {billLoading ? (
          <ButtonSkeleton />
        ) : (
          <div className="p-3 flex justify-end gap-3 border-t">
            <Button variant={"outline"} onClick={() => setOpenSkip(true)}>
              Skip
            </Button>
            <Button onClick={() => setOpenConfirm(true)}>Pay</Button>
          </div>
        )}
      </CommonDialog>
      <PayDialog open={openConfirm} setOpen={setOpenConfirm} data={bill} />
      <SkipDialog open={openSkip} setOpen={setOpenSkip} data={bill} />
    </>
  );
};

export default BillDialog;
