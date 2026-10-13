import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const categorySchema = {
  schema: z.object({
    name: z.string({
      required_error: "Name is required",
    }),

    type: z.string({
      required_error: "Type is required",
    }),

    icon: z.string({
      required_error: "Icon is required",
    }),

    color: z.string({
      required_error: "Color is required",
    }),
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
  first_name: z.string({
    required_error: "First Name is required",
  }),
  last_name: z.string({
    required_error: "First Name is required",
  }),
  email: z.string({
    required_error: "Email is required",
  }),
  phone_number: z
    .string().optional()
    // .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});
