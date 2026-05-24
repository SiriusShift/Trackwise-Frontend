import moment from "moment";
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
    image: yup.mixed().notRequired().nullable(),
    // recurring: yup.boolean(),
    account: yup.object().required("Account is required"),
    endDate: yup.date().nullable().notRequired(),
    behaviour: yup.string().when("recurring", {
      is: true,
      then: (schema) => schema.required("Mode is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    mode: yup.string(),
    frequency: yup
      .string()
      .nullable()
      .when("recurring", {
        is: true,
        then: (schema) => schema.required("Repeat is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    every: yup
      .string()
      .nullable()
      .when("recurring", {
        is: true,
        then: (schema) => schema.required("Unit is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
  }),
  defaultValues: {
    category: null,
    description: "",
    amount: 0,
    recurring: false,
    date: moment(),
    endDate: null,
    account: null,
    image: null,
    behaviour: null,
  },
};

export const payExpense = {
  schema: yup.object().shape({
    amount: yup
      .number()
      .required("Amount is required")
      .positive("Amount must be greater than 0"),
    source: yup.object().required("Source is required"),
  }),
  defaultValues: {
    amount: 0,
    source: null,
  },
};
