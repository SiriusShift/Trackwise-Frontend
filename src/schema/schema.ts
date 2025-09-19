import * as yup from "yup";

export const transferSchema = {
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
    from: yup.object().when("recurring", {
      is: false,
      then: (schema) => schema.required("Source is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    to: yup.object().when("recurring", {
      is: false,
      then: (schema) => schema.required("Destination is required"),
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
    from: null,
    to: null,
    auto: null,
  },
};

export const installmentSchema = {
  schema: yup.object().shape({
    category: yup.object().required("Category is required"),
    description: yup.string().required("Description is required"),
    amount: yup
      .number()
      .required("Amount is required")
      .positive("Amount must be greater than 0"),
    date: yup.date().required("Date is required"),
    months: yup
      .number()
      .required("Installment Term is required")
      .positive("Months must be greater than 0"),
  }),
  defaultValues: {
    category: null,
    description: "",
    amount: "",
    date: new Date(),
    months: "",
  },
};

export const trackerSchema = {
  schema: yup.object().shape({
    category: yup.object().required("Category is required"),
    amount: yup
      .number()
      .required("Amount is required")
      .positive("Amount must be greater than 0"),
  }),
  defaultValues: {
    category: "",
    amount: 0,
  },
};

export const generalSettings = {
  schema: yup.object().shape({
    timezone: yup.string().required("Timezone is required"),
    timeFormat: yup.string().required("Time format is required"),
    currency: yup.object().required("Currency is required"),
  }),
  defaultValues: {
    timezone: "MMM DD, YYYY",
    timeFormat: "12",
    currency: "",
  },
};