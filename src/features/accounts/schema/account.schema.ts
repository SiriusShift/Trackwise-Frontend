import z from "zod";

const dayOfMonth = z
  .number()
  .int("Enter a day from 1 to 31")
  .min(1, "Enter a day from 1 to 31")
  .max(31, "Enter a day from 1 to 31")
  .optional()
  .nullable();

export const accountSchema = z
  .object({
    name: z.string().min(1, "Account name is required"),
    type: z.enum(["CASH", "BANK", "CREDIT", "LOAN", "INVESTMENT"]),
    sub_type: z.string().optional(),
    currency: z.object({
      code: z.string(),
      currency: z.string(),
      digits: z.number(),
      number: z.string(),
    }),
    balance: z
      .number({
        required_error: "Balance is required",
        invalid_type_error: "Must be a valid number",
      })
      .min(0, "Balance cannot be negative"),

    // Lives on Asset itself (institution: String?) — applies to any account
    // type, not just credit. Always optional.
    institution: z.string().optional().nullable(),

    // Also plain Asset fields (Asset.color / Asset.icon) — cosmetic only,
    // so both stay optional with form-level defaults rather than required.
    color: z.string().optional(),
    icon: z.string().optional(),

    // Mirrors CreditDetail: only creditLimit is non-nullable there.
    creditLimit: z
      .number()
      .positive("Credit limit must be greater than 0")
      .optional(),
    statementDate: dayOfMonth,
    dueDate: dayOfMonth,
    // Alternative to dueDate: due this many days after the statement date
    dueDaysAfterStatement: z
      .number()
      .int("Enter whole days")
      .min(1, "Enter 1 to 60 days")
      .max(60, "Enter 1 to 60 days")
      .optional()
      .nullable(),
    includeNetWorth: z.boolean(),
    targetAmount: z
      .number()
      .positive("Savings goal must be greater than 0")
      .optional()
      .nullable(),
    targetDate: z.date().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type !== "CASH" && !data.sub_type?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sub_type"],
        message: "Sub type is required",
      });
    }

    if (data.type === "CREDIT" && data.creditLimit == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["creditLimit"],
        message: "Credit limit is required",
      });
    }

    // Statements and bill reminders are generated from the statement day plus
    // one due rule: a day of the month, or days after the statement date.
    if (data.type === "CREDIT") {
      if (data.statementDate == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["statementDate"],
          message: "Statement date is required",
        });
      }

      if (data.dueDate == null && data.dueDaysAfterStatement == null) {
        // Reported on both fields; only the one for the chosen rule is shown.
        for (const path of ["dueDate", "dueDaysAfterStatement"]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [path],
            message: "Due date is required",
          });
        }
      }
    }

    const hasGoal = data.targetAmount != null;
    const hasDate = data.targetDate != null;

    if (hasGoal && !hasDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["targetDate"],
        message: "Target date is required when a savings goal is set",
      });
    }
    if (hasDate && !hasGoal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["targetAmount"],
        message: "Savings goal is required when a target date is set",
      });
    }
  });
