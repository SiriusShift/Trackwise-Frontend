import z from "zod";

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
      .number()
      .positive()
      .refine((v) => !isNaN(Number(v)), "Must be a valid number"),

    // Lives on Asset itself (institution: String?) — applies to any account
    // type, not just credit. Always optional.
    institution: z.string().optional(),

    // Also plain Asset fields (Asset.color / Asset.icon) — cosmetic only,
    // so both stay optional with form-level defaults rather than required.
    color: z.string().optional(),
    icon: z.string().optional(),

    // Mirrors CreditDetail: only creditLimit is non-nullable there.
    creditLimit: z.number().positive().optional(),
    statementDate: z.number().int().min(1).max(31).optional(),
    dueDate: z.number().int().min(1).max(31).optional(),
    minimumPayment: z.number().nonnegative().optional(),
    includeNetWorth: z.boolean(),
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
  });
