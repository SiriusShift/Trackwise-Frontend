import { requiredString } from "@/shared/schema/fields";
import { z } from "zod";

const emailField = requiredString("Email is required").email(
  "Invalid email address",
);

export const signupSchema = {
  schema: z.object({
    firstName: requiredString("First Name is required"),
    lastName: requiredString("Last Name is required"),
    username: requiredString("Username is required"),
    email: emailField,
    password: requiredString("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    acceptTerms: z.boolean().refine((v) => v, {
      message: "You must accept the Terms of Service and Privacy Policy",
    }),
  }),

  defaultValues: {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    acceptTerms: false,
  },
};

export const loginSchema = {
  schema: z.object({
    email: emailField,
    password: requiredString("Password is required"),
  }),
  defaultValues: {
    email: "",
    password: "",
  },
};

export const resetPasswordSchema = {
  schema: z
    .object({
      code: requiredString("Code is required"),
      password: requiredString("Password is required"),
      passwordConfirmation: z.string().optional(),
    })
    .refine(
      (data) =>
        data.passwordConfirmation === undefined ||
        data.passwordConfirmation === data.password,
      { message: "Passwords must match", path: ["passwordConfirmation"] },
    ),
};

export type SignupFormValues = z.infer<typeof signupSchema.schema>;
export type LoginFormValues = z.infer<typeof loginSchema.schema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema.schema>;
