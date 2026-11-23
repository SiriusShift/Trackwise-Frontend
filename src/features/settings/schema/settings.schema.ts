import { isValidPhoneNumber } from "react-phone-number-input";
import { requiredString } from "@/shared/schema/fields";
import { z } from "zod";

export const categorySchema = {
  schema: z.object({
    name: requiredString("Name is required"),
    type: requiredString("Type is required"),
    icon: requiredString("Icon is required"),
    color: requiredString("Color is required"),
  }),
  defaultValues: {
    name: "",
    type: "",
    icon: "",
    color: "",
  },
};

const passwordRule = z
  .string()
  .min(1, "New password is required")
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  );

// currentPassword is optional here; the form requires it only when the
// account already has a password (Google-only accounts do not).
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: passwordRule,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const profileSchema =z.object({
  profile_image: z.instanceof(File).nullable(),
  first_name: requiredString("First name is required"),
  last_name: requiredString("Last name is required"),
  email: requiredString("Email is required").email("Invalid email address"),
  phone_number: z
    .string().optional()
    // .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});
