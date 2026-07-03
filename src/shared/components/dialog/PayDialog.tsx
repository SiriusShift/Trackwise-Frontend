import { usePostPaymentMutation } from "@/features/transactions/api/transaction/expensesApi";
import { AccountSelect } from "@/features/transactions/components/forms/section/AccountSelect";
import { cn } from "@/lib/utils";
import { payRecurringSchema } from "@/schema/schema";
import { useGetAssetQuery } from "@/shared/api/assetsApi";
import { commonDialogProps, payRecurringForm } from "@/shared/types";
import { numberInput } from "@/shared/utils/CustomFunctions";
import { yupResolver } from "@hookform/resolvers/yup";
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

interface PayDialogType extends commonDialogProps {
  data: any;
}
function PayDialog({ data, open, setOpen }: PayDialogType) {
  const [openDate, setOpenDate] = useState(false);
  let { data: assetData } = useGetAssetQuery();
  assetData = assetData?.data;
  const [triggerPayment, { isLoading }] = usePostPaymentMutation();

  console.log(data);
  const form = useForm<payRecurringForm>({
    resolver: yupResolver(payRecurringSchema.schema),
    mode: "onChange",
    defaultValues: {
      ...payRecurringSchema.defaultValues,
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

  const pastDue = moment().isAfter(moment(data?.nextDueDate), "day");
  const iconName = data?.category?.icon as keyof typeof LucideIcons;
  const Icon =
    iconName && iconName in LucideIcons
      ? LucideIcons[iconName]
      : LucideIcons.CircleHelp;

  const onSubmit = async (values: payRecurringForm) => {
    const { date, account, ...rest } = values;

    await triggerPayment({
      id: data?.id,
      data: {
        category: data?.category?.id,
        description: data?.description,
        account: account?.id,
        ...rest,
        date: moment(date),
      },
    });
    setOpen(false);
  };

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any,
  ) => {
    const value = Number(e.target.value);
    const accountBalance = watch("account")?.remainingBalance;

    console.log(value, accountBalance);
    if (value > accountBalance) {
      toast.error(
        `Amount exceeds the total balance of ${accountBalance.toFixed(2)}`,
      );
      e.target.value = String(accountBalance ?? "");
      return;
    }

    numberInput(e, field);
  };

  useEffect(() => {
    reset({
      account: data?.fromAsset,
      amount: Number(data?.amount),
      date: moment().toLocaleString(),
    });
  }, [data]);

  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      title="Mark as paid"
      description="Confirm the payment details before recording this payment."
      icon={LucideIcons.CheckCircle2}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 p-5">
            {/* Bill summary */}
            <div className="rounded-xl border p-3">
              <div className="flex gap-3">
                <div
                  className="flex p-3 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${data?.category?.color}20`,
                    color: data?.category?.color,
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-bold">{data?.description}</p>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="truncate">{data?.category?.name}</span>
                    <span aria-hidden="true" className="shrink-0">
                      ·
                    </span>
                    <span>
                      {pastDue && "was "}
                      due{" "}
                      {moment(data?.nextDueDate)
                        .format("MMMM DD, YYYY")
                        .toLocaleString()}
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
                  <FormLabel>Amount paid</FormLabel>

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
                    Default is the scheduled amount. Edit if the actual bill
                    differs.
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
                    <FormLabel>Date paid</FormLabel>
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
                label="Account"
                assets={assetData ?? []}
                control={control}
              />
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex flex-row justify-between gap-3">
                <div className="flex flex-row items-center text-muted-foreground gap-2">
                  <LucideIcons.Calendar className="h-3 w-3" />
                  <p className="text-xs font-bold">Next due after payment</p>
                </div>
                <p className="text-xs font-bold">
                  {moment(data?.nextDueDate)
                    .add(1, "month")
                    .format("MMMM DD, YYYY")
                    .toLocaleString()}
                </p>
              </div>
            </div>
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
              {isSubmitting || isLoading ? "Recording..." : "Confirm Payment"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </CommonDialog>
  );
}

export default PayDialog;
