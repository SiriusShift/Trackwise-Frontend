import { z } from "zod";

// Reusable zod field builders for react-hook-form schemas.
// Inputs often hold "" or numeric strings, so empty values are treated as
// missing and numeric strings are coerced before validation.

export const isEmpty = (value: unknown) =>
  value === "" || value === null || value === undefined;

const toNumber = (value: unknown) =>
  isEmpty(value) ? undefined : typeof value === "string" ? Number(value) : value;

// Accepts Date, moment objects, timestamps and date strings
const toDate = (value: unknown) =>
  isEmpty(value) || value instanceof Date
    ? value
    : new Date(value as string | number);

export const requiredString = (message: string) =>
  z.string({ required_error: message, invalid_type_error: message }).min(1, message);

// Stringifies numbers (e.g. a recurring interval) so they don't fail validation
export const optionalString = z.preprocess(
  (value) => (typeof value === "number" ? String(value) : value),
  z.string().nullish(),
);

export const requiredNumber = (message: string) =>
  z.number({ required_error: message, invalid_type_error: message });

export const numberField = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(toNumber, schema);

export const amountField = numberField(
  requiredNumber("Amount is required").positive("Amount must be greater than 0"),
);

export const requiredDate = (message: string) =>
  z.preprocess(
    (value) => (isEmpty(value) ? undefined : toDate(value)),
    z.date({ required_error: message, invalid_type_error: message }),
  );

export const optionalDate = z.preprocess(
  (value) => (value === "" ? null : toDate(value)),
  z.date().nullish(),
);

// Select values (category, account, currency...) are whole objects
export const requiredObject = (message: string) =>
  z
    .object({}, { required_error: message, invalid_type_error: message })
    .passthrough();

export const optionalObject = z.object({}).passthrough().nullish();

// Adds a "required" issue for each listed field that is empty
export function requireFields(
  data: Record<string, unknown>,
  ctx: z.RefinementCtx,
  fields: Record<string, string>,
) {
  for (const [path, message] of Object.entries(fields)) {
    if (isEmpty(data[path])) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });
    }
  }
}
