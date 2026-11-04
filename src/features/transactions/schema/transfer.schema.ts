import {
  amountField,
  optionalObject,
  requiredDate,
  requiredObject,
  requiredString,
  requireFields,
  requireScheduleFields,
  scheduleDefaults,
} from "@/shared/schema/fields";
import { z } from "zod";

export const transferSchema = {
  schema: z
    .object({
      category: requiredObject("Category is required"),
      description: requiredString("Description is required"),
      amount: amountField,
      date: requiredDate("Date is required"),
      image: z.any(),
      recurring: z.boolean().optional(),
      account: optionalObject,
      to: optionalObject,
    })
    // Keep form-only fields (id, from, balance...) in submitted values
    .passthrough()
    .superRefine((data, ctx) => {
      if (data.recurring === false) {
        requireFields(data, ctx, { account: "Source is required" });
      }
      if (data.recurring === true || data.category.name === "Internal") {
        requireFields(data, ctx, { to: "Destination is required" });
      }
      if (data.recurring === true) {
        requireFields(data, ctx, {
          account: "Source is required",
          behaviour: "Mode is required",
        });
        requireScheduleFields(data, ctx, { frequencyRequired: true });
      }
    }),
  defaultValues: {
    category: null,
    description: "",
    amount: "",
    recurring: false,
    date: new Date(),
    source: null,
    image: null,
    from: null,
    to: null,
    behaviour: null,
    ...scheduleDefaults,
  },
};
