import { IRootState } from "@/app/store";
import { AccountSelect } from "@/features/transactions/components/forms/section/AccountSelect";
import { cn } from "@/lib/utils";
import { useGetAccountsQuery } from "@/shared/api/accountsApi";
import { useGetCategoryQuery } from "@/shared/api/categoryApi";
import CommonDialog from "@/shared/components/dialog/CommonDialog";
import DatePicker from "@/shared/components/dialog/DatePicker";
import { IconBadge } from "@/shared/components/IconBadge";
import { Button } from "@/shared/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { commonDialogProps } from "@/shared/types";
import {
  formatCurrency,
  handleCatchErrorMessage,
  numberInput,
} from "@/shared/utils/CustomFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownToLine, ArrowUpFromLine, CalendarIcon } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  ControllerRenderProps,
  FormProvider,
  Resolver,
  useForm,
} from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useGoalTransferMutation } from "../api/savingsApi";
import {
  GoalTransferForm,
  goalTransferSchema,
} from "../schema/goalTransfer.schema";
import { GoalTransferDirection, SavingsData } from "../types/savings.types";

const copy: Record<
  GoalTransferDirection,
  {
    title: string;
    description: string;
    account: string;
    action: string;
    done: string;
  }
> = {
  contribute: {
    title: "Contribute",
    description: "Move money from another account into this goal.",
    account: "From account",
    action: "Contribute",
    done: "Contribution added",
  },
  withdraw: {
    title: "Withdraw",
    description: "Move money out of this goal into another account.",
    account: "To account",
    action: "Withdraw",
    done: "Withdrawal recorded",
  },
};

interface Account {
  id: number;
  name: string;
  category: string;
  remainingBalance: number;
  remainingCredit?: number;
  currency: string | undefined;
}

const ALLOWED_CONTRIBUTE_CATEGORIES = ["CASH", "BANK", "INVESTMENT"];

interface GoalTransferDialogProps extends commonDialogProps {
  // Must be a linked goal: the other side of the transfer is its account
  goal: SavingsData | null;
  direction: GoalTransferDirection;
}

const GoalTransferDialog = ({
  open,
  setOpen,
  goal,
  direction,
}: GoalTransferDialogProps) => {
  const [openDate, setOpenDate] = useState(false);
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const { data: accountsData } = useGetAccountsQuery();
  const { data: categories } = useGetCategoryQuery({ type: "Transfer" });
  const [goalTransfer, { isLoading }] = useGoalTransferMutation();

  const assets: Account[] = accountsData?.data ?? [];
  const text = copy[direction];
  const isContribution = direction === "contribute";

  const form = useForm<GoalTransferForm>({
    resolver: zodResolver(
      goalTransferSchema.schema,
    ) as Resolver<GoalTransferForm>,
    mode: "onChange",
    defaultValues: goalTransferSchema.defaultValues as never,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  // Fresh form on every open, with the Savings category picked when there is one
  useEffect(() => {
    if (!open) return;
    reset({
      ...goalTransferSchema.defaultValues,
      date: moment().toDate(),
      category: categories?.find((c) => c.name === "Savings") ?? null,
    } as never);
  }, [open, direction, goal?.id, categories, reset]);

  const format = (amount: number) =>
    formatCurrency(amount, currency, "symbol", 0);

  // Scheduled (future) transfers aren't checked against balances until they run
  const isScheduled = moment(watch("date")).isAfter(moment());

  // Most that can move right now: what the source can spend, capped by what a
  // card destination still owes
  const maxAmount = (() => {
    if (!goal || isScheduled) return null;
    const account = watch("account") as unknown as Account | null;
    if (isContribution) {
      if (!account) return null;
      return account.category === "CREDIT"
        ? (account.remainingCredit ?? 0)
        : account.remainingBalance;
    }
    const owed =
      account?.category === "CREDIT"
        ? Math.max(account.remainingBalance, 0)
        : Infinity;
    return Math.max(Math.min(goal.savedAmount, owed), 0);
  })();

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<GoalTransferForm, "amount">,
  ) => {
    if (maxAmount !== null && Number(e.target.value) > maxAmount) {
      toast.error(`Amount exceeds the ${format(maxAmount)} available`);
      e.target.value = String(maxAmount);
    }
    numberInput(e, field);
  };

  const onSubmit = async (values: GoalTransferForm) => {
    if (!goal) return;
    try {
      await goalTransfer({
        id: goal.id,
        direction,
        data: {
          amount: Number(values.amount),
          account: Number(values.account.id),
          category: Number(values.category.id),
          date: moment(values.date).toISOString(),
          ...(values.description && { description: values.description }),
        },
      }).unwrap();
      toast.success(
        `${text.done}${isScheduled ? " (scheduled)" : ""} for ${goal.name}.`,
      );
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(handleCatchErrorMessage(err) ?? "Something went wrong.");
    }
  };

  const busy = isSubmitting || isLoading;

  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      isDirty={isDirty}
      reset={reset}
      title={`${text.title} ${isContribution ? "to" : "from"} ${goal?.name ?? "goal"}`}
      description={text.description}
      icon={isContribution ? ArrowDownToLine : ArrowUpFromLine}
      preventClickOutside
    >
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {/* Goal summary */}
            {goal && (
              <div className="flex items-center gap-3 rounded-xl border p-3">
                <IconBadge icon={goal.icon} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{goal.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {isContribution ? "Into" : "Out of"}{" "}
                    {goal.asset?.name ?? "the linked account"}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {format(goal.savedAmount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {goal.isCompleted
                      ? "Target reached"
                      : `${format(goal.remainingAmount)} to go`}
                  </p>
                </div>
              </div>
            )}

            {/* Amount */}
            <FormField
              name="amount"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Amount <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₱
                      </span>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                        onChange={(e) => handleAmountChange(e, field)}
                      />
                    </div>
                  </FormControl>
                  {isContribution &&
                  goal &&
                  !goal.isCompleted &&
                  goal.requiredMonthlyPace ? (
                    <p className="text-xs text-muted-foreground">
                      About {format(goal.requiredMonthlyPace)}/mo keeps this
                      goal on schedule.
                    </p>
                  ) : maxAmount !== null ? (
                    <p className="text-xs text-muted-foreground">
                      Up to {format(maxAmount)} available.
                    </p>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AccountSelect
                name="account"
                label={text.account}
                assets={assets}
                control={control}
                categories={ALLOWED_CONTRIBUTE_CATEGORIES}
                // Default categories match the backend's transfer rules; a
                // withdrawal into a card pays it down
                excludeId={goal?.assetId ?? undefined}
              />

              <FormField
                control={control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(
                        "justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      onClick={() => setOpenDate(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {field.value
                        ? moment(field.value).format("MMM DD, YYYY")
                        : "Pick a date"}
                    </Button>
                    <DatePicker
                      open={openDate}
                      setOpen={setOpenDate}
                      removeTime
                      field={field}
                    />
                    {isScheduled && (
                      <p className="text-xs text-muted-foreground">
                        Scheduled: balances update on this date.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category */}
            <FormField
              control={control}
              name="category"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    value={value?.id != null ? String(value.id) : undefined}
                    onValueChange={(id) =>
                      onChange(categories?.find((c) => String(c.id) === id))
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              name="description"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Note{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder={
                        isContribution
                          ? `Contribution to ${goal?.name ?? "goal"}`
                          : `Withdrawal from ${goal?.name ?? "goal"}`
                      }
                      className="min-h-14 resize-none text-sm"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 border-t p-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy || !isValid}>
              {busy ? "Saving..." : text.action}
            </Button>
          </div>
        </form>
      </FormProvider>
    </CommonDialog>
  );
};

export default GoalTransferDialog;
