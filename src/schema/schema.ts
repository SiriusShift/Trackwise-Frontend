import {
  amountField,
  isEmpty,
  numberField,
  requiredDate,
  requiredNumber,
  requiredObject,
  requiredString,
} from "@/shared/schema/fields";
import type { CurrencyCodeRecord } from "currency-codes";
import { z } from "zod";

export const installmentSchema = {
  schema: z
    .object({
      category: requiredObject("Category is required"),
      description: requiredString("Description is required"),
      amount: amountField,
      date: requiredDate("Date is required"),
      months: numberField(
        requiredNumber("Installment Term is required").positive(
          "Months must be greater than 0",
        ),
      ),
    })
    .passthrough(),
  defaultValues: {
    category: null,
    description: "",
    amount: "",
    date: new Date(),
    months: "",
  },
};

export const trackerSchema = {
  schema: z
    .object({
      category: requiredObject("Category is required"),
      amount: amountField,
      period: requiredString("Period is required"),
    })
    // Keeps `id` when editing an existing limit
    .passthrough(),
  defaultValues: {
    category: null,
    amount: 0,
    period: "",
  },
};

export const generalSettings = {
  schema: z
    .object({
      timezone: requiredString("Timezone is required"),
      timeFormat: requiredString("Time format is required"),
      dateFormat: requiredString("Date format is required"),
      weekStartDay: requiredString("Week start day is required"),
      currency: requiredObject("Currency is required"),
    })
    .passthrough(),
  defaultValues: {
    timezone: "",
    timeFormat: "12",
    dateFormat: "MMM D, YYYY",
    weekStartDay: "0",
    currency: null,
  } as GeneralSettingsFormValues,
};

export interface GeneralSettingsFormValues {
  timezone: string;
  timeFormat: string;
  dateFormat: string;
  weekStartDay: string;
  currency: CurrencyCodeRecord | null | undefined;
}

export const notificationSettings = {
  schema: z
    .object({
      notifyDays: numberField(
        requiredNumber("Reminder days is required")
          .int("Enter whole days")
          .min(0, "Days can't be negative"),
      ),
      emailNotification: z.boolean({
        required_error: "Email Notification is required",
      }),
      mobileNotification: z.boolean({
        required_error: "Mobile Notification is required",
      }),
    })
    .passthrough(),
  defaultValues: {
    notifyDays: 1,
    emailNotification: false,
    mobileNotification: false,
  },
};

export const payRecurringSchema = {
  schema: z
    .object({
      amount: numberField(requiredNumber("Amount is required")),
      // Holds either a date string or a Date from the picker
      date: z.custom<string | Date>(
        (value) => !isEmpty(value),
        "Date is required",
      ),
      account: requiredObject("Account is required"),
    })
    .passthrough(),
};

export const payStatementSchema = {
  schema: z
    .object({
      amount: numberField(requiredNumber("Amount is required")),
      // Holds either a date string or a Date from the picker
      date: z.custom<string | Date>(
        (value) => !isEmpty(value),
        "Date is required",
      ),
      account: requiredObject("Account is required"),
      interest: numberField(
        requiredNumber("Enter a valid amount")
          .min(0, "Fees can't be negative")
          .optional(),
      ),
      lateFee: numberField(
        requiredNumber("Enter a valid amount")
          .min(0, "Fees can't be negative")
          .optional(),
      ),
      otherFees: numberField(
        requiredNumber("Enter a valid amount")
          .min(0, "Fees can't be negative")
          .optional(),
      ),
    })
    .passthrough(),
};
