import { IRootState } from "@/app/store";
import { useGetCreditStatementQuery } from "@/features/transactions/api/transaction/schedulesApi";
import { ScheduledItem } from "@/shared/types";
import { formatCurrency, getStatus } from "@/shared/utils/CustomFunctions";
import * as LucideIcons from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { PayTarget } from "../PayDialog";
import { InfoRow } from "../ViewDialog/InfoRow";
import ButtonSkeleton from "./ButtonSkeleton";
import InfoSkeleton from "./InfoSkeleton";

interface CreditStatementDetailsProps {
  item?: ScheduledItem | null;
  onPay: (target: PayTarget) => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Unpaid",
  PARTIAL: "Partially paid",
  PAID: "Paid",
  OVERDUE: "Overdue",
  UPCOMING: "Estimated",
};

const CreditStatementDetails = ({ item, onPay }: CreditStatementDetailsProps) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);
  // Projected statements haven't closed yet, so there's nothing to fetch/pay.
  const statementId = item?.projected ? null : item?.sourceId;

  const { currentData: statement, isFetching } = useGetCreditStatementQuery(
    statementId ?? 0,
    { skip: !statementId },
  );

  const shown = statement ?? item;
  const status = getStatus(shown?.dueDate);
  const remaining = shown?.amount ?? 0;
  const isPaid = shown?.status === "PAID" || remaining <= 0;

  const payTarget: PayTarget | null = statement
    ? {
        source: "CREDIT_STATEMENT",
        id: statement.id,
        type: "Transfer",
        description: statement.description,
        amount: statement.amount,
        dueDate: statement.dueDate,
        toAsset: statement.toAsset,
      }
    : null;

  if (isFetching) {
    return (
      <>
        <InfoSkeleton />
        <ButtonSkeleton />
      </>
    );
  }

  return (
    <>
      <div className="p-4">
        <div className="flex flex-col items-center gap-3 pb-6">
          <div className="rounded-2xl border p-4">
            <LucideIcons.CreditCard className="h-6 w-6" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold">
              {formatCurrency(remaining, currency)}
            </h1>
            <p className="text-sm text-muted-foreground">
              {shown?.toAsset?.name}
            </p>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {STATUS_LABELS[shown?.status ?? ""] ?? status.label}
            </Badge>
            {item?.projected && (
              <p className="text-xs text-muted-foreground">
                Estimated from the card's current balance. The actual amount is
                set when the statement closes.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <InfoRow
            icon={LucideIcons.Calendar1}
            label="Due Date"
            value={moment(shown?.dueDate).format("MMMM DD, YYYY")}
          />
          <Separator />
          <InfoRow
            icon={LucideIcons.FileText}
            label="Statement Date"
            value={moment(shown?.statementDate).format("MMMM DD, YYYY")}
          />
          <Separator />
          <InfoRow
            icon={LucideIcons.Receipt}
            label="Statement Balance"
            value={formatCurrency(shown?.statementBalance ?? 0, currency)}
          />
          <Separator />
          <InfoRow
            icon={LucideIcons.CircleCheck}
            label="Paid So Far"
            value={formatCurrency(shown?.amountPaid ?? 0, currency)}
          />
          {statement && (
            <>
              <Separator />
              <InfoRow
                icon={LucideIcons.Wallet}
                label="Current Card Balance"
                value={formatCurrency(statement.currentBalance ?? 0, currency)}
              />
              {statement.fees.map((fee) => (
                <div key={fee.id} className="flex flex-col gap-3">
                  <Separator />
                  <InfoRow
                    icon={LucideIcons.BadgeAlert}
                    label={fee.label}
                    value={formatCurrency(fee.amount, currency)}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {statement && (
        <div className="p-4">
          <h2 className="mb-3 text-sm font-bold">Payments</h2>
          {statement.payments.length ? (
            <div className="space-y-3">
              {statement.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full p-2 bg-primary/10">
                      <LucideIcons.CalendarCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">
                        {moment(payment.date).format("MMMM DD, YYYY")}
                      </p>
                      <p className="font-medium text-xs text-muted-foreground">
                        From {payment.fromAsset?.name ?? "—"}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(payment.amount, currency)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-5 text-center">
              <h3>No payments yet</h3>
            </div>
          )}
        </div>
      )}

      <div className="p-3 flex items-center justify-end gap-3 bg-card sticky bottom-0 border-t">
        {item?.projected && (
          <p className="mr-auto text-xs text-muted-foreground">
            Can be paid once the statement closes.
          </p>
        )}
        <Button
          disabled={!payTarget || isPaid}
          onClick={() => payTarget && onPay(payTarget)}
        >
          Pay
        </Button>
      </div>
    </>
  );
};

export default CreditStatementDetails;
