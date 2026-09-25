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
      currency: requiredObject("Currency is required"),
    })
    .passthrough(),
  defaultValues: {
    timezone: "MMM DD, YYYY",
    timeFormat: "12",
    currency: null,
  } as GeneralSettingsFormValues,
};

export interface GeneralSettingsFormValues {
  timezone: string;
  timeFormat: string;
  currency: CurrencyCodeRecord | null | undefined;
}

export const notificationSettings = {
  schema: z
    .object({
      notifyDays: numberField(requiredNumber("Notify expense days is required")),
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
      date: z.custom<string | Date>((value) => !isEmpty(value), "Date is required"),
      account: requiredObject("Account is required"),
    })
    .passthrough(),
};
