// transactionConfig.ts
import ExpenseForm from "@/features/transactions/components/dialogs/forms/TransactionForm";
import InstallmentForm from "../components/dialogs/forms/InstallmentForm";
import {
  usePostExpenseMutation,
  usePatchExpenseMutation,
  useLazyGetExpensesQuery,
} from "@/features/transactions/api/transaction/expensesApi";
import {
  useLazyGetInstallmentsQuery,
  usePatchInstallmentMutation,
  usePostInstallmentMutation,
} from "../api/transaction/installmentApi";
import { expenseColumns } from "../components/table-columns/expense/expenseColumn";
import { useLazyGetAssetQuery } from "@/shared/api/assetsApi";
import { installmentColumn } from "../components/table-columns/expense/installmentColumn";

export const transactionConfig = {
  Expense: {
    postTrigger: usePostExpenseMutation,
    editTrigger: usePatchExpenseMutation,
    columns: expenseColumns,
    getTrigger: useLazyGetExpensesQuery,
  },
  Income: {

  },
  Transfer: {
    
  }
  // Installment: {
  //   postTrigger: usePostInstallmentMutation,
  //   getTrigger: useLazyGetInstallmentsQuery,
  //   editTrigger: usePatchInstallmentMutation,
  //   columns: installmentColumn,
  //   Form: InstallmentForm,
  // },
} as const;
