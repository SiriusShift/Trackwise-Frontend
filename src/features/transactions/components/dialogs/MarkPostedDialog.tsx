import { IRootState } from "@/app/store";
import { usePostPendingExpenseMutation } from "@/features/transactions/api/transaction/expensesApi";
import CommonDialog from "@/shared/components/dialog/CommonDialog";
import { Button } from "@/shared/components/ui/button";
import { DialogFooter } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  formatCurrency,
  handleCatchErrorMessage,
} from "@/shared/utils/CustomFunctions";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export interface PendingPurchase {
  id: number;
  description?: string;
  amount: number;
  date?: string;
}

interface MarkPostedDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  purchase: PendingPurchase | null;
}

const DATE_FORMAT = "YYYY-MM-DD";

// Confirms a pending card purchase with what the bank posted. The amount and
// date are filled in, so most of the time this is one tap.
const MarkPostedDialog = ({
  open,
  setOpen,
  purchase,
}: MarkPostedDialogProps) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const [postPending, { isLoading }] = usePostPendingExpenseMutation();

  const [amount, setAmount] = useState("");
  const [postedDate, setPostedDate] = useState("");

  const loggedAmount = Number(purchase?.amount ?? 0);
  const purchaseDay = moment(purchase?.date).format(DATE_FORMAT);
  const today = moment().format(DATE_FORMAT);

  useEffect(() => {
    if (!open || !purchase) return;
    setAmount(String(loggedAmount));
    setPostedDate(today);
  }, [open, purchase?.id]);

  const postedAmount = Number(amount);
  const difference = postedAmount - loggedAmount;
  const amountValid = Number.isFinite(postedAmount) && postedAmount > 0;
  const dateValid =
    !!postedDate && postedDate >= purchaseDay && postedDate <= today;

  const handleSubmit = async () => {
    if (!purchase || !amountValid || !dateValid) return;
    try {
      await postPending({
        id: purchase.id,
        data: {
          // Noon local time keeps the day the same in any timezone.
          postedDate: moment(postedDate, DATE_FORMAT).hour(12).toISOString(),
          ...(difference !== 0 && { amount: postedAmount }),
        },
      }).unwrap();
      toast.success(`${purchase.description ?? "Purchase"} marked as posted.`);
      setOpen(false);
    } catch (err) {
      toast.error(handleCatchErrorMessage(err) ?? "Something went wrong.");
    }
  };

  return (
    <CommonDialog
      setOpen={setOpen}
      open={open}
      title="Confirm posted charge"
      description={`            ${purchase?.description} · bought
            ${moment(purchase?.date).format("MMM D")}. Use what your bank app
            shows.`}
    >
      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="posted-amount">Posted amount</Label>
          <Input
            id="posted-amount"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {amountValid && difference !== 0 && (
            <p className="text-xs text-muted-foreground">
              {formatCurrency(Math.abs(difference), currency)}{" "}
              {difference > 0 ? "more" : "less"} than you logged (
              {formatCurrency(loggedAmount, currency)}). The purchase will be
              updated to the posted amount.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="posted-date">Posted on</Label>
          <Input
            id="posted-date"
            type="date"
            min={purchaseDay}
            max={today}
            value={postedDate}
            onChange={(e) => setPostedDate(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            The posting date decides which statement it lands on.
          </p>
        </div>
      </div>

      <DialogFooter className="gap-2 px-6 pb-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!amountValid || !dateValid || isLoading}
        >
          Mark as posted
        </Button>
      </DialogFooter>
    </CommonDialog>
  );
};

export default MarkPostedDialog;
