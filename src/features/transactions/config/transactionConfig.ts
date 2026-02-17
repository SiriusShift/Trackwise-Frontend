// transactionConfig.ts
import {
  usePostExpenseMutation,
  usePatchExpenseMutation,
  usePostPaymentMutation,
  usePostRecurringExpenseMutation,
} from "@/features/transactions/api/transaction/expensesApi";
import { expenseColumns } from "../components/table-columns/transaction/expenseColumn";
import {
  usePostIncomeMutation,
  usePostReceiveMutation,
  usePostRecurringIncomeMutation,
  useUpdateIncomeMutation,
} from "../api/transaction/incomeApi";
import { incomeColumns } from "../components/table-columns/transaction/incomeColumn";
import { expenseSchema } from "../schema/expense.schema";
import { incomeSchema } from "../schema/income.schema";

export const transactionConfig = {
  Expense: {
    transactTrigger: usePostPaymentMutation,
    postTrigger: usePostExpenseMutation,
    editTrigger: usePatchExpenseMutation,
    postRecurringTrigger: usePostRecurringExpenseMutation,
    columns: expenseColumns,
    schema: expenseSchema,
  },
  Income: {
    postTrigger: usePostIncomeMutation,
    transactTrigger: usePostReceiveMutation,
    editTrigger: useUpdateIncomeMutation,
    postRecurringTrigger: usePostRecurringIncomeMutation,
    columns: incomeColumns,
    schema: incomeSchema,
  },
  Transfer: {
    postTrigger: usePostIncomeMutation,
    transactTrigger: usePostReceiveMutation,
    editTrigger: useUpdateIncomeMutation,
    postRecurringTrigger: usePostRecurringIncomeMutation,
    columns: incomeColumns,
    schema: incomeSchema,
  },
  // Installment: {
  //   postTrigger: usePostInstallmentMutation,
  //   getTrigger: useLazyGetInstallmentsQuery,
  //   editTrigger: usePatchInstallmentMutation,
  //   columns: installmentColumn,
  //   Form: InstallmentForm,
  // },
} as const;
