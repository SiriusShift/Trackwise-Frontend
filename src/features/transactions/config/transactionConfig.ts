// transactionConfig.ts
import {
  usePostExpenseMutation,
  usePatchExpenseMutation,
  useLazyGetExpensesQuery,
  useLazyGetGraphExpenseQuery,
} from "@/features/transactions/api/transaction/expensesApi";
import {
  useLazyGetInstallmentsQuery,
  usePatchInstallmentMutation,
  usePostInstallmentMutation,
} from "../api/transaction/installmentApi";
import { expenseColumns } from "../components/table-columns/transaction/expenseColumn";
import { useLazyGetGraphIncomeQuery, useLazyGetIncomeQuery, usePostIncomeMutation, useUpdateIncomeMutation } from "../api/transaction/incomeApi";
import { incomeColumns } from "../components/table-columns/transaction/incomeColumn";
import { expenseSchema, incomeSchema } from "@/schema/schema";

export const transactionConfig = {
  Expense: {
    postTrigger: usePostExpenseMutation,
    editTrigger: usePatchExpenseMutation,
    columns: expenseColumns,
    getTrigger: useLazyGetExpensesQuery,
    getChart: useLazyGetGraphExpenseQuery,
    schema: expenseSchema
  },
  Income: {
    postTrigger: usePostIncomeMutation,
    editTrigger: useUpdateIncomeMutation,
    columns: incomeColumns,
    getTrigger: useLazyGetIncomeQuery,
    getChart:  useLazyGetGraphIncomeQuery,
    schema: incomeSchema
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
