import {
  amountField,
  optionalDate,
  optionalString,
  requiredDate,
  requiredObject,
  requiredString,
  requireFields,
} from "@/shared/schema/fields";
import moment from "moment";
import { z } from "zod";

export const expenseSchema = {
  schema: z
    .object({
      category: requiredObject("Category is required"),
      description: requiredString("Description is required"),
      amount: amountField,
      date: requiredDate("Date is required"),
      image: z.any(),
      account: requiredObject("Account is required"),
      endDate: optionalDate,
      behaviour: optionalString,
      mode: optionalString,
      frequency: optionalString,
      every: optionalString,
    })
    // Keep form-only fields (id, recurring, repeat, balance...) in submitted values
    .passthrough()
    .superRefine((data, ctx) => {
      if (data.installment === true) {
        const term = Number(data.termMonths);
        if (!Number.isInteger(term) || term < 2 || term > 60) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["termMonths"],
            message: "Enter 2 to 60 months",
          });
        }
        if (!(Number(data.monthlyAmount) > 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["monthlyAmount"],
            message: "Monthly amount is required",
          });
        }
        const skip = Number(data.installmentSkip ?? 0);
        if (!Number.isInteger(skip) || skip < 0 || skip > 12) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["installmentSkip"],
            message: "Enter 0 to 12 months",
          });
        }
      }
      if (data.recurring !== true) return;
      requireFields(data, ctx, {
        behaviour: "Mode is required",
        frequency: "Repeat is required",
        every: "Unit is required",
      });
    }),
  defaultValues: {
    category: null,
    description: "",
    amount: 0,
    recurring: false,
    installment: false,
    termMonths: null,
    monthlyAmount: null,
    installmentSkip: 0,
    date: moment(),
    endDate: null,
    account: null,
    image: null,
    behaviour: null,
  },
};

export const payExpense = {
  schema: z
    .object({
      amount: amountField,
      source: requiredObject("Source is required"),
    })
    .passthrough(),
  defaultValues: {
    amount: 0,
    source: null,
  },
};
