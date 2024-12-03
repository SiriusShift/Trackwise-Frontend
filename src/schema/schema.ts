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
    password: yup.string().required("Password is required"),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match"),
  }),
};

export const expenseSchema = yup.object().shape({
  userId: yup.string().required("User Id is required"),
  category: yup.object().required("Category is required"),
  description: yup.string().required("Description is required"),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be greater than 0"),
  date: yup.date().required("Date is required"),
  source: yup.object().required("Source is required"),
});


export const recurringExpense = yup.object().shape({
  category: yup.object().required("Category is required"),
  description: yup.string().required("Description is required"),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be greater than 0"),
  date: yup.date().required("Date is required"),
  source: yup.object().required("Source is required"),
  status: yup.string().required("Status is required"),
});
