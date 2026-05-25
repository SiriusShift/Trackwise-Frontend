// transactionConfig.ts
import {
  usePostExpenseMutation,
  usePostPaymentMutation,
  usePutExpenseMutation,
} from "@/features/transactions/api/transaction/expensesApi";
import { expenseColumns } from "../components/table-columns/transaction/expenseColumn";
import {
  usePostIncomeMutation,
  usePostReceiveMutation,
  usePutIncomeMutation,
} from "../api/transaction/incomeApi";
import { incomeColumns } from "../components/table-columns/transaction/incomeColumn";
import { expenseSchema } from "../schema/expense.schema";
import { incomeSchema } from "../schema/income.schema";
import { transferSchema } from "../schema/transfer.schema";
import { transferColumns } from "../components/table-columns/transaction/transferColumn";
import { usePostTransferMoneyMutation, usePostTransferMutation, usePutTransferMutation } from "../api/transaction/transferApi";
import { usePostRecurringMutation } from "../api/transaction/recurringApi";

export const transactionConfig = {
  Expense: {
    transactTrigger: usePostPaymentMutation,
    postTrigger: usePostExpenseMutation,
    editTrigger: usePutExpenseMutation,
    postRecurringTrigger: usePostRecurringMutation,
    columns: expenseColumns,
    schema: expenseSchema,
  },
  Income: {
    postTrigger: usePostIncomeMutation,
    transactTrigger: usePostReceiveMutation,
    editTrigger: usePutIncomeMutation,
    postRecurringTrigger: usePostRecurringMutation,
    columns: incomeColumns,
    schema: incomeSchema,
  },
  Transfer: {
    postTrigger: usePostTransferMutation,
    transactTrigger: usePostTransferMoneyMutation,
    editTrigger: usePutTransferMutation,
    postRecurringTrigger: usePostRecurringMutation,
    columns: transferColumns,
    schema: transferSchema,
  },
  // Installment: {
  //   postTrigger: usePostInstallmentMutation,
  //   getTrigger: useLazyGetInstallmentsQuery,
  //   editTrigger: usePatchInstallmentMutation,
  //   columns: installmentColumn,
  //   Form: InstallmentForm,
  // },
} as const;
