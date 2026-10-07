import { ReceiptText } from "lucide-react";
import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";

import { IRootState } from "@/app/store";
import { useGetCategoryLimitQuery } from "@/shared/api/categoryApi";
import { Button } from "@/shared/components/ui/button";
import CommonDialog from "@/shared/components/dialog/CommonDialog";
import { DialogClose, DialogFooter } from "@/shared/components/ui/dialog";
import { useTriggerFetch } from "@/shared/hooks/useLazyFetch";
import { transactionConfig } from "../../config/transactionConfig";
import TransactionForm from "../forms/TransactionForm";

import { useGetAccountsQuery } from "@/shared/api/accountsApi";
import { commonDialogProps } from "@/shared/types";
import { useTransactionForm } from "../hooks/useTransactionForm";
import {
  TransactionType,
  useTransactionSubmit,
} from "../hooks/UseTransactionSubmit";

interface TransactionDialogProps extends commonDialogProps {
  mode: "add" | "edit" | "transact";
  rowData?: any;
}

export function TransactionDialog({
  open,
  setOpen,
  mode,
  rowData,
}: TransactionDialogProps) {
  const [recurring, setRecurring] = useState(false);

  const type = useSelector(
    (state: IRootState) => state.active.type,
  ) as TransactionType;
  const startDate = useSelector(
    (state: IRootState) => state.active.active.from,
  );
  const endDate = useSelector((state: IRootState) => state.active.active.to);

  const { data: rawAssetData } = useGetAccountsQuery();
  const { data: categoryLimit } = useGetCategoryLimitQuery({
    startDate,
    endDate,
  });

  const assetData = rawAssetData?.data ?? [];

  const {
    postTrigger,
    editTrigger,
    schema,
    transactTrigger,
    postRecurringTrigger,
  } = transactionConfig[type] || {};

  const trigger =
    mode === "edit"
      ? editTrigger
      : mode === "transact"
        ? transactTrigger
        : recurring
          ? postRecurringTrigger
          : postTrigger;

  const { fetchData } = useTriggerFetch(trigger);

  // ── Form state ──────────────────────────────────────────────────────────────
  const form = useTransactionForm({
    open,
    type,
    mode,
    rowData,
    schema,
  });
  const {
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, isValid },
  } = form;

  // ── Submit logic ─────────────────────────────────────────────────────────────
  const { onSubmit, getActionLabel } = useTransactionSubmit({
    type,
    mode,
    categoryLimit: categoryLimit ?? [],
    fetchData,
    watch,
    reset,
    setOpen,
  });

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const isRecurring = watch("recurring");

  const dialogTitle =
    mode === "add"
      ? `Add ${isRecurring ? "Scheduled" : ""} ${type}`
      : mode === "transact"
        ? `${getActionLabel()} ${type}`
        : `Edit ${isRecurring ? "Scheduled" : ""} ${type}`;

  const recurringLabel = isRecurring && mode !== "transact" ? "recurring " : "";

  const dialogDescription =
    mode === "add"
      ? `Fill in the details to create a new ${recurringLabel}${type.toLowerCase()}.`
      : mode === "transact"
        ? `Confirm and complete this ${recurringLabel}${type.toLowerCase()}.`
        : `Update the details of this ${recurringLabel}${type.toLowerCase()}.`;

  return (
    <FormProvider {...form}>
      <CommonDialog
        open={open}
        setOpen={setOpen}
        isDirty={isDirty}
        reset={reset}
        title={dialogTitle}
        description={dialogDescription}
        icon={ReceiptText}
        preventClickOutside
        contentClassName="sm:max-w-lg sm:max-h-[90vh]"
      >
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <TransactionForm
            assetData={assetData}
            mode={mode}
            setRecurring={setRecurring}
          />
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 px-6 py-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={(!isDirty && mode !== "transact") || !isValid}
          >
            {getActionLabel()}
          </Button>
        </DialogFooter>
      </CommonDialog>
    </FormProvider>
  );
}
