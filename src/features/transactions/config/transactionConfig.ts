// transactionConfig.ts
import {
  usePostExpenseMutation,
  usePatchExpenseMutation,
  usePostRecurringExpenseMutation,
  usePatchPaymentMutation,
} from "@/features/transactions/api/transaction/expensesApi";
import {
  expenseColumns,
  recurringExpenseColumns,
} from "../components/table-columns/transaction/expenseColumn";
import {
  usePostIncomeMutation,
  useUpdateIncomeMutation,
} from "../api/transaction/incomeApi";
import {
  incomeColumns,
  recurringIncomeColumns,
} from "../components/table-columns/transaction/incomeColumn";
import { expenseSchema } from "../schema/expense.schema";
import { incomeSchema } from "../schema/income.schema";

export const transactionConfig = {
  Expense: {
    transactTrigger: usePatchPaymentMutation,
    postTrigger: usePostExpenseMutation,
    editTrigger: usePatchExpenseMutation,
    postRecurringTrigger: usePostRecurringExpenseMutation,
    columns: expenseColumns,
    recurringColumns: recurringExpenseColumns,
    schema: expenseSchema,
  },
  Income: {
    postTrigger: usePostIncomeMutation,
    postRecurringTrigger: usePostRecurringExpenseMutation,
    editTrigger: useUpdateIncomeMutation,
    columns: incomeColumns,
    recurringColumns: recurringIncomeColumns,
    schema: incomeSchema,
  },
  Transfer: {},
  // Installment: {
  //   postTrigger: usePostInstallmentMutation,
  //   getTrigger: useLazyGetInstallmentsQuery,
  //   editTrigger: usePatchInstallmentMutation,
  //   columns: installmentColumn,
  //   Form: InstallmentForm,
  // },
} as const;
