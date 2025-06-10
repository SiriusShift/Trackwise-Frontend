import * as yup from "yup";

export const signupSchema = {
  schema: yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    username: yup.string().required("Username is required"),
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  }),

  defaultValues: {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  },
};

export const loginSchema = {
  schema: yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required"),
  }),
  defaultValues: {
    email: "",
    password: "",
  },
};

export const resetPasswordSchema = {
  schema: yup.object({
    code: yup.string().required("Code is required"),
    password: yup.string().required("Password is required"),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match"),
  }),
};

export const expenseSchema = {
  schema: yup.object().shape({
    expenseId: yup.string().nullable(),
    category: yup.object().required("Category is required"),
    description: yup.string().required("Description is required"),
    amount: yup
      .number()
      .required("Amount is required")
      .positive("Amount must be greater than 0"),
    date: yup.date().required("Date is required"),
    source: yup.object().required("Source is required"),
    recipient: yup.string().required("Receipient is required"),
  }),
  defaultValues: {
    expenseId: null,
    category: "",
    description: "",
    amount: "",
    date: "",
    source: "",
    recipient: "",
  },
};

export const recurringExpense = {
  schema: yup.object().shape({
    userId: yup.string().required("User Id is required"),
    expenseId: yup.string().nullable(),
    category: yup.object().required("Category is required"),
    description: yup.string().required("Description is required"),
    frequency: yup.object().required("Frequency is required"),
    amount: yup
      .number()
      .required("Amount is required")
      .positive("Amount must be greater than 0"),
    startDate: yup.date().required("Start date is required"),
    recipient: yup.string().required("Receipient is required"),
  }),
  defaultValues: {
    userId: null,
    expenseId: "",
    category: "",
    description: "",
    frequency: "",
    amount: 0,
    startDate: "",
    recipient: "",
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
