// transactionConfig.ts
import ExpenseForm from "@/features/transactions/components/dialogs/forms/ExpenseForm";
import InstallmentForm from "../forms/InstallmentForm";
import { usePostExpenseMutation, usePatchExpenseMutation } from "@/features/transactions/api/expense/expensesApi";
import { usePostInstallmentMutation } from "../../../api/expense/installmentApi";

export const transactionConfigDialog = {
  Expense: {
    postTrigger: usePostExpenseMutation,
    editTrigger: usePatchExpenseMutation,
    Form: ExpenseForm,
  },
  Installment: {
    postTrigger: usePostInstallmentMutation,
    // editTrigger: usePatchInstallmentMutation,
    Form: InstallmentForm,
  },
} as const;
