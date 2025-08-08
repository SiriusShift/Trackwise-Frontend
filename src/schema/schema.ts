import * as yup from "yup";

export const expenseSchema = {
  schema: yup.object().shape({
    category: yup.object().required("Category is required"),
    description: yup.string().required("Description is required"),
    amount: yup
      .number()
      .required("Amount is required")
      .positive("Amount must be greater than 0"),
    date: yup.date().required("Date is required"),
    mode: yup.string().nullable(),
    repeat: yup
      .object()
      .nullable()
      .when("mode", {
        is: "recurring",
        then: (schema) => schema.required("Frequency is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    months: yup
      .number()
      .nullable()
      .when("mode", {
        is: "installment",
        then: (schema) =>
          schema
            .required("Installment Term is required")
            .positive("Months must be greater than 0"),
        otherwise: (schema) => schema.notRequired(),
      }),
    image: yup.mixed().nullable(),

    source: yup.object().required("Source is required"),
  }),
  defaultValues: {
    category: null,
    description: "",
    amount: null,
    date: new Date(),
    mode: "none",
    source: null,
    image: null,
    months: ""
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

export const payRecurringSchema = {
  schema: yup.object().shape({
    // amount: yup
    //   .number()
    //   .required("Amount is required")
    //   .positive("Amount must be greater than 0"),
    source: yup.object().required("Source is required"),
  }),
  defaultValues: {
    amount: 0,
    // source: "",
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
    currency: ""
  },
};
