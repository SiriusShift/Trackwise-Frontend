import {
  numberField,
  optionalDate,
  optionalObject,
  requireFields,
  requiredNumber,
  requiredString,
} from "@/shared/schema/fields";
import { z } from "zod";

// A linked goal reads its saved amount from the account's balance; an
// unlinked one keeps a saved amount entered by hand
export const goalSchema = {
  schema: z
    .object({
      name: requiredString("Name is required").max(
        100,
        "Name must be 100 characters or less",
      ),
      targetAmount: numberField(
        requiredNumber("Target is required").positive(
          "Target must be greater than 0",
        ),
      ),
      targetDate: optionalDate,
      icon: requiredString("Icon is required"),
      isLinked: z.boolean(),
      account: optionalObject,
      currentAmount: numberField(
        z.number().min(0, "Saved amount can't be negative").optional(),
      ),
    })
    .superRefine((data, ctx) => {
      if (data.isLinked) {
        requireFields(data, ctx, { account: "Account is required" });
      }
    }),
  defaultValues: {
    name: "",
    targetAmount: "",
    targetDate: null,
    icon: "PiggyBank",
    isLinked: true,
    account: null,
    currentAmount: "",
  },
};

export type GoalForm = z.infer<typeof goalSchema.schema>;
