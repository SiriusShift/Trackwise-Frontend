import { ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";

import { IRootState } from "@/app/store";
import { useGetCategoryLimitQuery } from "@/shared/api/categoryApi";
import CommonDialog from "@/shared/components/dialog/CommonDialog";
import { Button } from "@/shared/components/ui/button";
import { DialogClose, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useTriggerFetch } from "@/shared/hooks/useLazyFetch";
import { transactionConfig } from "../../config/transactionConfig";
import TransactionForm from "../forms/TransactionForm";

import { useGetAccountsQuery } from "@/shared/api/accountsApi";
import { commonDialogProps } from "@/shared/types";
import {
  usePostRecurringMutation,
  useUpdateRecurringMutation,
} from "../../api/transaction/recurringApi";
import { useTransactionForm } from "../hooks/useTransactionForm";
import {
  TransactionType,
  useTransactionSubmit,
} from "../hooks/UseTransactionSubmit";

interface TransactionDialogProps extends commonDialogProps {
  mode: "add" | "edit" | "transact";
  /** Defaults to the transactions page's active type */
  type?: TransactionType;
  rowData?: any;
  /** Add mode only: create a schedule, with a type picker in the form */
  startRecurring?: boolean;
}

const TYPE_OPTIONS: TransactionType[] = ["Expense", "Income", "Transfer"];

export function TransactionDialog({
  open,
  setOpen,
  mode,
  type: typeProp,
  rowData,
  startRecurring = false,
}: TransactionDialogProps) {
  const startDate = useSelector(
    (state: IRootState) => state.active.active.from,
  );
  const pageType = useSelector(
    (state: IRootState) => state.active.type,
  ) as TransactionType;

  // "Add recurring" lets the user pick the type inside the form. Changing it
  // resets the form to that type's fields (useTransactionForm resets on type).
  const isRecurringAdd = mode === "add" && startRecurring;
  const [pickedType, setPickedType] = useState<TransactionType | null>(null);
  useEffect(() => {
    if (open) setPickedType(null);
  }, [open]);
  const type = (isRecurringAdd && pickedType) || typeProp || pageType;
  const endDate = useSelector((state: IRootState) => state.active.active.to);

  const { data: rawAssetData } = useGetAccountsQuery();
  const { data: categoryLimit } = useGetCategoryLimitQuery({
    startDate,
    endDate,
  });

  const assetData = rawAssetData?.data ?? [];

  const { postTrigger, editTrigger, schema } = transactionConfig[type] || {};

  // ── Form state ──────────────────────────────────────────────────────────────
  const form = useTransactionForm({
    open,
    type,
    mode,
    rowData,
    schema,
    startRecurring: isRecurringAdd,
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, isValid },
  } = form;

  // Schedules use the recurring endpoints; everything else uses the per-type ones.
  // Both hooks are always called (hook order must not change when "recurring" toggles).
  const { fetchData: transactionFetch } = useTriggerFetch(
    mode === "edit" ? editTrigger : postTrigger,
  );
  const { fetchData: updateRecurringFetch } = useTriggerFetch(
    useUpdateRecurringMutation,
  );
  const { fetchData: postRecurringFetch } = useTriggerFetch(
    usePostRecurringMutation,
  );

  const fetchData = form.watch("recurring")
    ? mode === "edit"
      ? updateRecurringFetch
      : postRecurringFetch
    : transactionFetch;

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

  console.log(watch());

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const isRecurring = watch("recurring");

  const dialogTitle =
    mode === "add"
      ? `Add ${isRecurring ? "Schedule" : `${type}`} `
      : mode === "transact"
        ? `${getActionLabel()} ${type}`
        : `Edit ${isRecurring ? "Schedule" : `${type}`}`;

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
          {isRecurringAdd && (
            <div className="mb-5 flex flex-col gap-2">
              <Label id="recurring-type-label">Type</Label>
              <Tabs
                value={type}
                onValueChange={(value) =>
                  setPickedType(value as TransactionType)
                }
              >
                <TabsList
                  aria-labelledby="recurring-type-label"
                  className="grid w-full grid-cols-3"
                >
                  {TYPE_OPTIONS.map((option) => (
                    <TabsTrigger key={option} value={option}>
                      {option}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
          <TransactionForm assetData={assetData} mode={mode} type={type} />
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
