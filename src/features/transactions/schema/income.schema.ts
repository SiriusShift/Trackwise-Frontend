import moment from "moment";
import * as yup from "yup";
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
    endDate: yup.date().nullable().notRequired(),
    behaviour: yup.boolean().when("recurring", {
      is: true,
      then: (schema) => schema.required("Mode is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    account: yup
      .object()
      .when(["recurring", "auto", "date"], {
        is: (recurring: boolean, auto: boolean, date: Date) =>
          (recurring && auto) ||
          (!recurring && moment(date).isSameOrBefore(moment())),
        then: (schema) => schema.required("Destination is required"),
        otherwise: (schema) => schema.notRequired(),
      })
      .nullable(),
    mode: yup.string().when("recurring", {
      is: true,
      then: (schema) => schema.required("Mode is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
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
    account: null,
    image: null,
    behaviour: null,
  },
};
