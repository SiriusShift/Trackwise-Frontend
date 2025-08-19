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
    image: yup.mixed().nullable(),
    recurring: yup.boolean(),
    from: yup.object().when("recurring", {
      is: false,
      then: (schema) => schema.required("Source is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    endDate: yup.date().nullable(),
    auto: yup.boolean(),
    repeat: yup.object().when("recurring", {
      is: true,
      then: (schema) => schema.required("Repeat is required"),
      otherwise: (schema) => schema.notRequired()
    })
  }),
  defaultValues: {
    category: null,
    description: "",
    amount: "",
    recurring: false,
    date: new Date(),
    endDate: null,
    source: null,
    image: null,
    auto: false
  },
};

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
    auto: yup.boolean()
  }),
  defaultValues: {
    category: null,
    description: "",
    amount: "",
    recurring: false,
    date: new Date(),
    source: null,
    image: null,
    auto: null
  },
};

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
    }),    to: yup.object().when("recurring", {
      is: false,
      then: (schema) => schema.required("Destination is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    auto: yup.boolean()
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
    auto: null
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

export const recurringSchema = {};

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
    currency: "",
  },
};
