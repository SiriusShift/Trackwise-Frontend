import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";

const peso = (value: number) =>
  `₱${value.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const TERM_PRESETS = [3, 6, 12, 18, 24];

// Same rules as the backend's dayInMonth/creditDueDate: a day past the end of
// a short month falls on its last day.
const dayInMonth = (month: moment.Moment, day: number) =>
  month
    .clone()
    .startOf("month")
    .date(Math.min(day, month.daysInMonth()));

/**
 * Which statement the first installment lands on. A purchase made on or before
 * the cut-off day goes on that month's statement right away; one made after it
 * waits for the next. `skip` defers it by that many more months, for promos
 * like "pay after 3 months".
 */
// Same rule as the backend: a set number of days after the statement (moved to
// the nearest weekday), or a day of the month.
const dueDateFor = (
  close: moment.Moment,
  statementDay: number,
  dueDay: number,
  daysAfter: number,
) => {
  if (daysAfter) {
    const due = close.clone().add(daysAfter, "days");
    const weekday = due.isoWeekday();
    if (weekday === 6) return due.subtract(1, "day");
    if (weekday === 7) return due.add(1, "day");
    return due;
  }
  const month = dueDay > statementDay ? close : close.clone().add(1, "month");
  return dayInMonth(month, dueDay);
};

const firstBill = (
  purchase: moment.Moment,
  statementDay: number,
  dueDay: number,
  daysAfter: number,
  skip: number,
) => {
  const thisCut = dayInMonth(purchase, statementDay);
  const close = purchase.isAfter(thisCut, "day")
    ? dayInMonth(purchase.clone().add(1, "month"), statementDay)
    : thisCut;
  const shifted = dayInMonth(close.clone().add(skip, "month"), statementDay);
  return {
    close: shifted,
    due: dueDateFor(shifted, statementDay, dueDay, daysAfter),
  };
};

/**
 * "Convert to installment" block for a credit card purchase. Writes
 * `installment`, `termMonths`, `monthlyAmount` and `installmentSkip` into the
 * parent form; the purchase amount stays the expense's own `amount`. The
 * backend places each installment on its statement from the card's cycle, so
 * the user never picks a date.
 */
export const InstallmentSection = () => {
  const { control, watch, setValue } = useFormContext();

  const enabled = !!watch("installment");
  const amount = Number(watch("amount") || 0);
  const termMonths = Number(watch("termMonths") || 0);
  const monthlyAmount = Number(watch("monthlyAmount") || 0);
  const skip = Number(watch("installmentSkip") || 0);
  const purchaseDate = watch("date");
  const creditDetail = watch("account")?.creditDetail;

  // Suggest monthly = amount / term until the user types their own figure
  // (the bank's number usually differs because of its fee or interest).
  const monthlyEdited = useRef(false);
  useEffect(() => {
    if (!enabled) {
      monthlyEdited.current = false;
      return;
    }
    if (monthlyEdited.current || !termMonths || !amount) return;
    setValue("monthlyAmount", Math.round((amount / termMonths) * 100) / 100, {
      shouldValidate: true,
    });
  }, [enabled, amount, termMonths, setValue]);

  const handleToggle = (on: boolean) => {
    setValue("installment", on, { shouldValidate: true });
    if (!on) {
      setValue("termMonths", null);
      setValue("monthlyAmount", null);
      setValue("installmentSkip", 0);
    }
  };

  const [showDeferred, setShowDeferred] = useState(false);
  const deferredOpen = showDeferred || skip > 0;

  const suggestedMonthly =
    amount > 0 && termMonths > 0
      ? Math.round((amount / termMonths) * 100) / 100
      : null;
  const monthlyDiffers =
    suggestedMonthly !== null && monthlyAmount !== suggestedMonthly;

  const useSuggestedMonthly = () => {
    if (suggestedMonthly === null) return;
    monthlyEdited.current = false;
    setValue("monthlyAmount", suggestedMonthly, { shouldValidate: true });
  };

  const totalPayable = monthlyAmount * termMonths;
  const financingCost = totalPayable - amount;

  const statementDay = Number(creditDetail?.statementDate);
  const dueDay = Number(creditDetail?.dueDate);
  const daysAfter = Number(creditDetail?.dueDaysAfterStatement);
  const bill =
    statementDay && (dueDay || daysAfter)
      ? firstBill(moment(purchaseDate), statementDay, dueDay, daysAfter, skip)
      : null;

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Convert to installment</p>
          <p className="text-xs text-muted-foreground">
            Split this purchase into monthly bills on the card.
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={handleToggle}
          aria-label="Convert to installment"
        />
      </div>

      {enabled && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="termMonths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Term (months) <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="number"
                        min={2}
                        max={60}
                        step={1}
                        placeholder="12"
                        className="pr-16 text-sm"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? null : Number(e.target.value),
                          )
                        }
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        months
                      </span>
                    </div>
                  </FormControl>
                  <div className="flex flex-wrap gap-1.5">
                    {TERM_PRESETS.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() =>
                          setValue("termMonths", term, { shouldValidate: true })
                        }
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-xs transition-colors hover:bg-muted",
                          termMonths === term &&
                            "border-primary bg-primary/10 text-primary",
                        )}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="monthlyAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Monthly amount <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        ₱
                      </span>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7 text-sm"
                        onChange={(e) => {
                          monthlyEdited.current = true;
                          field.onChange(
                            e.target.value === "" ? null : Number(e.target.value),
                          );
                        }}
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Use the amount your bank bills each month.
                  </p>
                  {monthlyDiffers && (
                    <button
                      type="button"
                      onClick={useSuggestedMonthly}
                      className="text-left text-xs text-primary hover:underline"
                    >
                      Use {peso(suggestedMonthly)} (amount ÷ term)
                    </button>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {deferredOpen ? (
            <FormField
              control={control}
              name="installmentSkip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Deferred start{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={field.value ?? 0}
                        type="number"
                        min={0}
                        max={12}
                        step={1}
                        placeholder="0"
                        className="pr-16 text-sm"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? 0 : Number(e.target.value),
                          )
                        }
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        months
                      </span>
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    For promos like "pay after 3 months". Leave at 0 to bill
                    from the next statement.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowDeferred(true)}
              className="self-start text-xs text-primary hover:underline"
            >
              + Promo with deferred start?
            </button>
          )}

          {bill && (
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <p className="text-xs text-muted-foreground">First bill</p>
              <p>
                Statement of{" "}
                <span className="font-medium">
                  {bill.close.format("MMM DD")}
                </span>
                , due{" "}
                <span className="font-medium">
                  {bill.due.format("MMM DD, YYYY")}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Purchases made after the card's cut-off go on the next
                statement.
              </p>
            </div>
          )}

          {termMonths > 0 && monthlyAmount > 0 && (
            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 rounded-md bg-muted/50 p-3 text-sm">
              <dt className="text-muted-foreground">Total payable</dt>
              <dd className="text-right tabular-nums">{peso(totalPayable)}</dd>
              <dt className="text-muted-foreground">Cost of financing</dt>
              <dd
                className={cn(
                  "text-right tabular-nums",
                  financingCost > 0 && "text-destructive",
                )}
              >
                {financingCost > 0 && "+"}
                {peso(Math.max(financingCost, 0))}
              </dd>
              {financingCost > 0 && (
                <dd className="col-span-2 text-xs text-muted-foreground">
                  {peso(monthlyAmount)} × {termMonths} months is{" "}
                  {peso(financingCost)} more than the {peso(amount)} purchase.
                </dd>
              )}
              {financingCost < 0 && (
                <dd className="col-span-2 text-xs text-destructive">
                  Monthly bills add up to less than the purchase amount.
                  Double-check the monthly amount.
                </dd>
              )}
            </dl>
          )}
        </>
      )}
    </div>
  );
};
