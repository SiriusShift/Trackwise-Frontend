import * as yup from "yup"
export const incomeSchema = {
  schema: yup.object().shape({
    category: yup.object().required("Category is required"),
    description: yup.string().required("Description is required"),
    amount: yup
      .number()
      .required("Amount is required")
      .positive("Amount must be greater than 0"),
    date: yup.date().required("Date is required"),
    image: yup.mixed().nullable(),
    recurring: yup.boolean(),
    to: yup.object().when("recurring", {
      is: false,
      then: (schema) => schema.required("Source is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    auto: yup.boolean(),
  }),
  defaultValues: {
    category: null,
    description: "",
    amount: "",
    recurring: false,
    date: new Date(),
    source: null,
    image: null,
    auto: null,
  },
};