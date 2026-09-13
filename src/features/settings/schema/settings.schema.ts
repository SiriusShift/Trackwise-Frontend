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

export const profileSchema = z.object({
  profile_image: z.string().nullable(),
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
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});
