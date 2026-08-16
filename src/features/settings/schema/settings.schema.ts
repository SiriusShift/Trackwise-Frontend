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
