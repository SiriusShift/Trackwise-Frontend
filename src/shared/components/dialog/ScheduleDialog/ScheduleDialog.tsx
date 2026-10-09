import { commonDialogProps, ScheduledItem } from "@/shared/types";
import { CreditCard, ReceiptText } from "lucide-react";
import { useState } from "react";
import CommonDialog from "../CommonDialog";
import PayDialog, { PayTarget } from "../PayDialog";
import SkipDialog from "../SkipDialog";
import CreditStatementDetails from "./CreditStatementDetails";
import RecurringScheduleDetails from "./RecurringScheduleDetails";

interface ScheduleDialogProps extends commonDialogProps {
  // The clicked item from /transactions/schedules
  data?: ScheduledItem | null;
}

// Details for any scheduled item. Pay/Skip open on top of it and act on the
// item's current cycle.
const ScheduleDialog = ({ open, setOpen, data }: ScheduleDialogProps) => {
  const [payTarget, setPayTarget] = useState<PayTarget | null>(null);
  const [openPay, setOpenPay] = useState(false);
  const [openSkip, setOpenSkip] = useState(false);

  const isCredit = data?.source === "CREDIT_STATEMENT";

  const handlePay = (target: PayTarget) => {
    setPayTarget(target);
    setOpenPay(true);
  };

  const handleSkip = (target: PayTarget) => {
    setPayTarget(target);
    setOpenSkip(true);
  };

  return (
    <>
      <CommonDialog
        open={open}
        setOpen={setOpen}
        title={isCredit ? "Credit Card Bill" : `Scheduled ${data?.type ?? ""}`}
        icon={isCredit ? CreditCard : ReceiptText}
      >
        <div className="overflow-auto">
          {isCredit ? (
            <CreditStatementDetails item={data} onPay={handlePay} />
          ) : data ? (
            <RecurringScheduleDetails
              item={data}
              onPay={handlePay}
              onSkip={handleSkip}
            />
          ) : null}
        </div>
      </CommonDialog>
      <PayDialog open={openPay} setOpen={setOpenPay} data={payTarget} />
      <SkipDialog open={openSkip} setOpen={setOpenSkip} data={payTarget} />
    </>
  );
};

export default ScheduleDialog;
