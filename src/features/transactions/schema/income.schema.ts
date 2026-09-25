import {
  amountField,
  optionalDate,
  optionalObject,
  optionalString,
  requiredDate,
  requiredObject,
  requiredString,
  requireFields,
} from "@/shared/schema/fields";
import moment from "moment";
import { z } from "zod";

export const incomeSchema = {
  schema: z
    .object({
      category: requiredObject("Category is required"),
      description: requiredString("Description is required"),
      amount: amountField,
      date: requiredDate("Date is required"),
      image: z.any(),
      endDate: optionalDate,
      behaviour: optionalString,
      account: optionalObject,
      mode: optionalString,
      repeat: optionalObject,
    })
    // Keep form-only fields (id, recurring, auto, balance...) in submitted values
    .passthrough()
    .superRefine((data, ctx) => {
      if (data.recurring === true) {
        requireFields(data, ctx, {
          behaviour: "Mode is required",
          mode: "Mode is required",
          repeat: "Repeat is required",
        });
      }

      const needsAccount =
        (data.recurring && data.auto) ||
        (!data.recurring && moment(data.date).isSameOrBefore(moment()));
      if (needsAccount) {
        requireFields(data, ctx, { account: "Destination is required" });
      }
    }),
  defaultValues: {
    category: null,
    description: "",
    amount: "",
    recurring: false,
    date: new Date(),
    account: null,
    image: null,
    behaviour: null,
  },
};
