import { ArrowUpDown, CalendarIcon, Repeat } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

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
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { Toggle } from "@/shared/components/ui/toggle";
import { frequencyList } from "@/shared/constants/dateConstants";
import { Field } from "@/shared/types";

import { AccountSelect } from "./section/AccountSelect";
import { BehaviourSelector } from "./section/BehaviourSelector";
import { CategoryAmountSection } from "./section/CategoryAmountSection";
import { ImageAttachment } from "./section/ImageAttachment";

interface Asset {
  id: string;
  name: string;
  remainingBalance: number;
}

interface Category {
  id: string;
  name: string;
}

interface TransactionFormProps {
  assetData: Asset[];
  categoryData: Category[];
  type: "Income" | "Expense" | "Transfer";
  mode: string;
  history?: boolean;
  setRecurring: (fn: (prev: boolean) => boolean) => void;
}

const TransactionForm = ({
  assetData,
  categoryData,
  type,
  mode,
  history,
  setRecurring,
}: TransactionFormProps) => {
  const [openDate, setOpenDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  const { watch, control, setValue, getValues } = useFormContext();

  const isRecurring = watch("recurring");
  const isTransfer = type === "Transfer";

  // Recurring toggle is only available for add/edit of non-transfer, non-history
  const canToggleRecurring = mode !== "transact" && !isTransfer;

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

  const handleRecurringToggle = (pressed: boolean) => {
    setValue("frequency", null);
    setValue("every", null);
    setValue("endDate", null);
    setValue("account", null);
    setValue("image", null);
    if (type !== "Expense") setValue("to", null);
    setValue(
      "date",
      pressed ? moment().startOf("day").toDate() : moment().toDate(),
    );
    setRecurring((prev) => !prev);
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
                className="text-sm resize-none"
                rows={2}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date + Recurring toggle */}
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
                    ? moment(field.value).format("MMM DD, YYYY")
                    : moment(field.value).format("MMM DD, YYYY hh:mm A")
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

        {/* Only render when the user is allowed to toggle recurring */}
        {canToggleRecurring && (
          <FormField
            control={control}
            name="recurring"
            render={({ field: { onChange, value } }) => (
              <FormItem className="flex items-end pb-0.5">
                <FormControl>
                  <Toggle
                    pressed={!!value}
                    onPressedChange={(pressed) => {
                      onChange(pressed);
                      handleRecurringToggle(pressed);
                    }}
                    aria-label="Toggle recurring"
                  >
                    <Repeat className="h-4 w-4" />
                  </Toggle>
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>

      {/* From / Account */}
      <AccountSelect
        name="account"
        label={fromLabel}
        assets={assetData ?? []}
        control={control}
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
          />
        </>
      )}

      {/* Category + Amount */}
      <CategoryAmountSection
        categoryData={categoryData}
        type={type}
        mode={mode}
      />

      {/* Recurring schedule fields */}
      {isRecurring && (
        <>
          <Separator />
          <p className="text-sm font-semibold">Schedule</p>

          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="every"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Every</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      placeholder="1"
                      className="text-sm"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              name="frequency"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <FormControl>
                    <Select value={value ?? ""} onValueChange={onChange}>
                      <SelectTrigger className="h-10 text-sm">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyList.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    ? moment(field.value).format("MMM DD, YYYY")
                    : "No end date"}
                </Button>
                <DatePicker
                  open={openEndDate}
                  setOpen={setOpenEndDate}
                  disablePast
                  removeTime
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
