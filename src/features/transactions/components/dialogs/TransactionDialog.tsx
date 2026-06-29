import { ReceiptText } from "lucide-react";
import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";

import { IRootState } from "@/app/store";
import { useGetAssetQuery } from "@/shared/api/assetsApi";
import {
  useGetCategoryLimitQuery,
  useGetCategoryQuery,
} from "@/shared/api/categoryApi";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTriggerFetch } from "@/shared/hooks/useLazyFetch";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { useUpdateTransactionHistoryMutation } from "../../api/transaction";
import { transactionConfig } from "../../config/transactionConfig";
import TransactionForm from "../forms/TransactionForm";

import { commonDialogProps } from "@/shared/types";
import { useTransactionForm } from "../hooks/useTransactionForm";
import { useTransactionSubmit } from "../hooks/UseTransactionSubmit";

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

  const type = useSelector((state: IRootState) => state.active.type);
  const startDate = useSelector(
    (state: IRootState) => state.active.active.from,
  );
  const endDate = useSelector((state: IRootState) => state.active.active.to);
  const { confirm } = useConfirm();

  const { data: categoryData } = useGetCategoryQuery({ type });
  const { data: rawAssetData } = useGetAssetQuery();
  const { data: categoryLimit } = useGetCategoryLimitQuery({
    startDate,
    endDate,
  });
  const [editHistory] = useUpdateTransactionHistoryMutation();

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
    history,
    categoryLimit: categoryLimit ?? [],
    fetchData,
    editHistory,
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

  function handleCloseIntent() {
    if (!isDirty) {
      setOpen(false);
      return;
    }
    confirm({
      title: "Discard changes?",
      description: "All unsaved changes will be lost.",
      variant: "destructive",
      confirmText: "Discard",
      cancelText: "Keep editing",
      onConfirm: () => {
        setOpen(false);
        reset();
      },
    });
  }

  return (
    <FormProvider {...form}>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) handleCloseIntent();
          else setOpen(o);
        }}
      >
        <DialogContent
          className="flex flex-col w-full max-w-full h-dvh p-0 sm:max-w-lg sm:h-auto sm:max-h-[90vh] gap-0"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="flex flex-row items-center gap-3 px-6 py-4 border-b">
            <ReceiptText className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription className="mt-0.5">
                {dialogDescription}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <TransactionForm
              type={type}
              assetData={assetData}
              categoryData={categoryData}
              mode={mode}
              setRecurring={setRecurring}
            />
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 px-6 py-4 border-t">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseIntent}
              >
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
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
