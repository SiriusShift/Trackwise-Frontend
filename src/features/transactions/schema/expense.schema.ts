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
    from: yup
      .object()
      .when(["recurring", "auto", "date", "mode"], {
        is: (recurring: boolean, auto: boolean, date: Date, mode: string) =>
          (recurring && auto) ||
          (!recurring && moment(date).isSameOrBefore(moment())) || mode === "transact",
        then: (schema) => schema.required("Source is required"),
        otherwise: (schema) => schema.notRequired(),
      })
      .nullable(),
    endDate: yup.date().nullable().notRequired(),
    auto: yup.boolean().when("recurring", {
      is: true,
      then: (schema) => schema.required("Mode is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    mode: yup.string(),
    repeat: yup
      .object()
      .nullable()
      .when("recurring", {
        is: true,
        then: (schema) => schema.required("Repeat is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
  }),
  defaultValues: {
    category: null,
    description: "",
    amount: "",
    recurring: false,
    date: new Date(),
    endDate: null,
    from: null,
    image: null,
    auto: false,
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
