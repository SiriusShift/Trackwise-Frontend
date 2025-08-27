// transactionConfig.ts
import {
  usePostExpenseMutation,
  usePatchExpenseMutation,
  useLazyGetExpensesQuery,
  useLazyGetGraphExpenseQuery,
  useGetGraphExpenseQuery,
  useGetExpensesQuery,
} from "@/features/transactions/api/transaction/expensesApi";
import {
  useLazyGetInstallmentsQuery,
  usePatchInstallmentMutation,
  usePostInstallmentMutation,
} from "../api/transaction/installmentApi";
import { expenseColumns } from "../components/table-columns/transaction/expenseColumn";
import { useGetGraphIncomeQuery, useGetIncomeQuery, usePostIncomeMutation, useUpdateIncomeMutation } from "../api/transaction/incomeApi";
import { incomeColumns } from "../components/table-columns/transaction/incomeColumn";
import { expenseSchema, incomeSchema } from "@/schema/schema";

export const transactionConfig = {
  Expense: {
    postTrigger: usePostExpenseMutation,
    editTrigger: usePatchExpenseMutation,
    columns: expenseColumns,
    schema: expenseSchema
  },
  Income: {
    postTrigger: usePostIncomeMutation,
    editTrigger: useUpdateIncomeMutation,
    columns: incomeColumns,
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
