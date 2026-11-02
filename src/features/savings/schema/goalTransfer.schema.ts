import {
  amountField,
  optionalString,
  requiredDate,
  requiredObject,
} from "@/shared/schema/fields";
import { z } from "zod";

// One form for both directions: `account` is the source of a contribution
// and the destination of a withdrawal. The goal's account is the other side.
export const goalTransferSchema = {
  schema: z.object({
    amount: amountField,
    date: requiredDate("Date is required"),
    account: requiredObject("Account is required"),
    category: requiredObject("Category is required"),
    description: optionalString,
  }),
  defaultValues: {
    amount: "",
    date: new Date(),
    account: null,
    category: null,
    description: "",
  },
};

export type GoalTransferForm = z.infer<typeof goalTransferSchema.schema>;
