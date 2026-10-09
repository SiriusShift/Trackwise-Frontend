import {
  usePayCreditStatementMutation,
  usePayRecurringScheduleMutation,
} from "@/features/transactions/api/transaction/schedulesApi";
import { AccountSelect } from "@/features/transactions/components/forms/section/AccountSelect";
import { cn } from "@/lib/utils";
import { payRecurringSchema } from "@/schema/schema";
import { useGetAccountsQuery } from "@/shared/api/accountsApi";
import {
  commonDialogProps,
  payRecurringForm,
  ScheduleAccount,
  ScheduleCategory,
  ScheduleSource,
  ScheduleType,
} from "@/shared/types";
import {
  handleCatchErrorMessage,
  numberInput,
} from "@/shared/utils/CustomFunctions";
import {
  getNextDuePreview,
  getScheduleColor,
  getScheduleIcon,
  scheduleActionLabels,
} from "@/shared/utils/schedule";
import { zodResolver } from "@hookform/resolvers/zod";
import * as LucideIcons from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import CommonDialog from "./CommonDialog";
import DatePicker from "./DatePicker";

// What is being paid: the current cycle of a recurring schedule, or a credit
// card statement.
export interface PayTarget {
  source: ScheduleSource;
  id: number;
  type: ScheduleType;
  description: string;
  amount: number;
  dueDate: string;
  category?: ScheduleCategory | null;
  // Account preselected in the form
  account?: ScheduleAccount | null;
  // Destination (transfer target / credit card); excluded from the account list
  toAsset?: ScheduleAccount | null;
  interval?: number;
  unit?: string;
}

interface PayDialogType extends commonDialogProps {
  data?: PayTarget | null;
}

function PayDialog({ data, open, setOpen }: PayDialogType) {
  const [openDate, setOpenDate] = useState(false);
  const { data: accountsData } = useGetAccountsQuery();
  const assetData = accountsData?.data;
  const [payRecurring, { isLoading: recurringLoading }] =
    usePayRecurringScheduleMutation();
  const [payCredit, { isLoading: creditLoading }] =
    usePayCreditStatementMutation();
  const isLoading = recurringLoading || creditLoading;

  const isCredit = data?.source === "CREDIT_STATEMENT";
  const labels = isCredit
    ? scheduleActionLabels.Expense
    : scheduleActionLabels[data?.type ?? "Expense"];
  // Income adds to the account, so there's no balance to run out of.
  const checksBalance = data?.type !== "Income";

  const form = useForm<payRecurringForm>({
    resolver: zodResolver(payRecurringSchema.schema),
    mode: "onChange",
    defaultValues: {
      amount: data?.amount ?? 0,
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  const pastDue = moment().isAfter(moment(data?.dueDate), "day");
  const Icon = getScheduleIcon(data);
  const color = getScheduleColor(data);

  const onSubmit = async (values: payRecurringForm) => {
    if (!data) return;
    const { date, account, amount } = values;
    const payload = {
      id: data.id,
      data: {
        amount: Number(amount),
        date: moment(date).toISOString(),
        account: (account as { id?: number })?.id,
      },
    };

    try {
      if (isCredit) await payCredit(payload).unwrap();
      else await payRecurring(payload).unwrap();
      toast.success(`${data.description} marked as ${labels.done.toLowerCase()}.`);
      setOpen(false);
    } catch (err) {
      toast.error(handleCatchErrorMessage(err) ?? "Something went wrong.");
    }
  };

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any,
  ) => {
    const value = Number(e.target.value);
    const account = watch("account") as
      | { remainingBalance?: number; category?: string }
      | undefined;
    const accountBalance = account?.remainingBalance;

    // Credit accounts can go "negative" (charges increase what's owed).
    if (
      checksBalance &&
      account?.category !== "CREDIT" &&
      accountBalance !== undefined &&
      value > accountBalance
    ) {
      toast.error(
        `Amount exceeds the total balance of ${accountBalance.toFixed(2)}`,
      );
      e.target.value = String(accountBalance ?? "");
      return;
    }

    numberInput(e, field);
  };

  useEffect(() => {
    if (!open) return;
    reset({
      account: assetData?.find(
        (asset: { id: number }) => asset.id === data?.account?.id,
      ),
      amount: Number(data?.amount ?? 0),
      date: moment().toLocaleString(),
    });
  }, [data, open, assetData, reset]);

  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      title={labels.title}
      description="Confirm the details before recording this transaction."
      icon={LucideIcons.CheckCircle2}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 p-5">
            {/* Summary */}
            <div className="rounded-xl border p-3">
              <div className="flex gap-3">
                <div
                  className="flex p-3 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-bold">{data?.description}</p>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="truncate">
                      {isCredit
                        ? data?.toAsset?.name
                        : data?.type === "Transfer"
                          ? `To ${data?.toAsset?.name ?? "—"}`
                          : data?.category?.name}
                    </span>
                    <span aria-hidden="true" className="shrink-0">
                      ·
                    </span>
                    <span>
                      {pastDue && "was "}
                      due {moment(data?.dueDate).format("MMMM DD, YYYY")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount */}
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.amount}</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₱
                      </span>

                      <Input
                        {...field}
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                        onChange={(e) => handleAmountChange(e, field)}
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {isCredit
                      ? "Default is the remaining statement balance. Pay less for a partial payment."
                      : "Default is the scheduled amount. Edit if the actual amount differs."}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>{labels.date}</FormLabel>
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(
                        "justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      onClick={() => setOpenDate(true)}
                    >
                      <LucideIcons.CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {field.value
                        ? moment(field.value).format("MMM DD, YYYY")
                        : "Pick a date"}
                    </Button>
                    <DatePicker
                      open={openDate}
                      setOpen={setOpenDate}
                      removeTime={true}
                      field={field}
                    />
                  </FormItem>
                )}
              />
              <AccountSelect
                name="account"
                label={
                  data?.type === "Income"
                    ? "To account"
                    : data?.type === "Transfer" || isCredit
                      ? "From account"
                      : "Account"
                }
                assets={assetData ?? []}
                control={control}
                excludeId={data?.toAsset?.id}
              />
            </div>
            {!isCredit && (
              <div className="rounded-lg border p-3">
                <div className="flex flex-row justify-between gap-3">
                  <div className="flex flex-row items-center text-muted-foreground gap-2">
                    <LucideIcons.Calendar className="h-3 w-3" />
                    <p className="text-xs font-bold">Next due after this</p>
                  </div>
                  <p className="text-xs font-bold">
                    {getNextDuePreview(data?.dueDate, data?.interval, data?.unit)}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 p-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || isLoading || !isValid}
            >
              {isSubmitting || isLoading ? "Recording..." : `Confirm`}
            </Button>
          </div>
        </form>
      </FormProvider>
    </CommonDialog>
  );
}

export default PayDialog;
