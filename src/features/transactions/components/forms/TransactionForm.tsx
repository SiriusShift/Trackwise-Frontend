import { ArrowUpDown, CalendarIcon } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import DatePicker from "@/shared/components/dialog/DatePicker";
import { Button } from "@/shared/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Separator } from "@/shared/components/ui/separator";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { Field } from "@/shared/types";

import { TransactionType } from "../hooks/UseTransactionSubmit";
import { AccountSelect } from "./section/AccountSelect";
import { BehaviourSelector } from "./section/BehaviourSelector";
import { CategoryAmountSection } from "./section/CategoryAmountSection";
import { ImageAttachment } from "./section/ImageAttachment";
import { InstallmentSection } from "./section/InstallmentSection";
import { RepeatBySection } from "./section/RepeatBySection";
import { useDateFormat } from "@/shared/hooks/useDateFormat";

// Account categories each transaction type can use (LOAN isn't supported yet).
const EXPENSE_CATEGORIES = ["CASH", "BANK", "CREDIT"];
const INCOME_CATEGORIES = ["CASH", "BANK"];
const TRANSFER_CATEGORIES = ["CASH", "BANK", "CREDIT", "INVESTMENT"];

interface Asset {
  id: number;
  name: string;
  category: string;
  remainingBalance: number;
  remainingCredit?: number;
  currency: string | undefined;
}

interface TransactionFormProps {
  assetData: Asset[];
  mode: string;
  /** The dialog's type, which can differ from the transactions page's */
  type: TransactionType;
}

const TransactionForm = ({ assetData, mode, type }: TransactionFormProps) => {
  const [openDate, setOpenDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  const { watch, control, setValue, getValues } = useFormContext();
  const { dateFormat, dateTimeFormat } = useDateFormat();

  const isRecurring = watch("recurring");
  const isTransfer = type === "Transfer";
  const accountCategories = isTransfer
    ? TRANSFER_CATEGORIES
    : type === "Income"
      ? INCOME_CATEGORIES
      : EXPENSE_CATEGORIES;

  // "recurring" is fixed when the dialog opens: on for "Add recurring" and for
  // editing a schedule, off otherwise. Credit cards can't be scheduled, so
  // they're hidden from the account list while it's on.
  const isCreditAccount = watch("account")?.category === "CREDIT";

  // Installments only apply to a new one-off purchase on a credit card.
  const canConvertToInstallment =
    type === "Expense" &&
    mode === "add" &&
    !isRecurring &&
    watch("account")?.category === "CREDIT";

  // A new one-off card purchase can wait for the bank to post it. Installment
  // plans are billed by the plan, so they're never pending.
  const canMarkPending =
    type === "Expense" &&
    mode === "add" &&
    !isRecurring &&
    isCreditAccount &&
    !watch("installment");

  // Card purchases usually post a day or more later, so new ones start as
  // pending; the user turns it off for a charge that already shows in the bank.
  useEffect(() => {
    if (mode === "add" && type === "Expense") {
      setValue("isPending", isCreditAccount);
    }
  }, [isCreditAccount, mode, type]);

  // Show attachment for past transactions being added/edited
  const showAttachment =
    !isRecurring &&
    ((watch("date") < moment() && mode === "add") ||
      mode === "transact" ||
      mode === "edit");

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleDateChange = (field: Field, date: Date) => {
    field.onChange(date);
    // Normalize: future → strip time, past/now → keep exact moment
    if (moment(date).isAfter(moment())) {
      setValue("image", null);
      setValue("date", moment(date).startOf("day").toDate());
    } else {
      setValue("date", moment().toDate());
    }
  };

  // Swap the From / To accounts (Transfer only)
  const handleSwapAccounts = () => {
    const from = getValues("account");
    const to = getValues("to");
    setValue("account", to ?? null);
    setValue("to", from ?? null);
  };

  // ── Derived ──────────────────────────────────────────────────────────────────

  const fromAccountId = watch("account")?.id;

  const fromLabel = isTransfer
    ? "From"
    : type === "Income"
      ? "Account"
      : "Account";

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">
      {/* Description */}
      <FormField
        name="description"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Description <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Enter description"
                className="text-sm resize-none min-h-14"
                rows={2}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date */}
      <div className="flex gap-3 items-end">
        <FormField
          control={control}
          name="date"
          render={({ field }: { field: Field }) => (
            <FormItem className="flex flex-col flex-1">
              <FormLabel>
                {isRecurring ? "Start date" : "Date & time"}{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <Button
                variant="outline"
                type="button"
                disabled={mode === "transact"}
                className={cn(
                  "justify-start text-left font-normal",
                  !field.value && "text-muted-foreground",
                )}
                onClick={() => setOpenDate(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                {field.value
                  ? isRecurring || moment(field.value).isAfter(moment())
                    ? moment(field.value).format(dateFormat)
                    : moment(field.value).format(dateTimeFormat)
                  : "Pick a date"}
              </Button>
              <DatePicker
                setDate={handleDateChange}
                disablePast={isRecurring}
                disableFuture={!isRecurring}
                open={openDate}
                setOpen={setOpenDate}
                field={field}
              />
            </FormItem>
          )}
        />
      </div>

      {/* From / Account */}
      <AccountSelect
        name="account"
        label={fromLabel}
        assets={assetData ?? []}
        control={control}
        categories={
          isRecurring
            ? accountCategories.filter((c) => c !== "CREDIT")
            : accountCategories
        }
      />

      {/* Swap button + To account — Transfer only */}
      {isTransfer && (
        <>
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 h-8 w-8 rounded-full"
              onClick={handleSwapAccounts}
              aria-label="Swap from and to accounts"
            >
              <ArrowUpDown className="h-3 w-3" />
            </Button>
            <Separator className="flex-1" />
          </div>

          <AccountSelect
            name="to"
            label="To"
            assets={assetData ?? []}
            control={control}
            excludeId={fromAccountId} // prevents selecting the same account
            categories={TRANSFER_CATEGORIES}
          />
        </>
      )}

      {/* Category + Amount */}
      <CategoryAmountSection mode={mode} type={type} />

      {/* Pending — new, one-off credit card purchases only */}
      {canMarkPending && (
        <FormField
          control={control}
          name="isPending"
          render={({ field: { value, onChange } }) => (
            <FormItem className="flex items-start justify-between gap-4 rounded-xl border border-dashed p-3">
              <div className="space-y-1">
                <FormLabel htmlFor="isPending">
                  Not posted by the bank yet
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                  Stays off your statement until you mark it posted. It still
                  counts against your available credit.
                </p>
              </div>
              <FormControl>
                <Switch
                  id="isPending"
                  checked={!!value}
                  onCheckedChange={onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      {/* Installment conversion — new, non-recurring credit card expenses only */}
      {canConvertToInstallment && <InstallmentSection />}

      {/* Recurring schedule fields */}
      {isRecurring && (
        <>
          <Separator />
          <p className="text-sm font-semibold">Schedule</p>

          <RepeatBySection mode={mode} />

          <FormField
            control={control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  End date{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </FormLabel>
                <Button
                  variant="outline"
                  type="button"
                  className={cn(
                    "justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  onClick={() => setOpenEndDate(true)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                  {field.value
                    ? moment(field.value).format(dateFormat)
                    : "No end date"}
                </Button>
                <DatePicker
                  open={openEndDate}
                  setOpen={setOpenEndDate}
                  disablePast
                  removeTime
                  clearable
                  field={field}
                />
              </FormItem>
            )}
          />
        </>
      )}

      <Separator />

      {/* Attachment — non-recurring past/edit/transact only */}
      {showAttachment && (
        <FormField
          name="image"
          control={control}
          render={({ field: { onChange, value } }) => (
            <ImageAttachment value={value} onChange={onChange} />
          )}
        />
      )}

      {/* Behaviour selector — recurring only */}
      {isRecurring && <BehaviourSelector control={control} />}
    </div>
  );
};

export default TransactionForm;
