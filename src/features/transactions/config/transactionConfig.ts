// transactionConfig.ts
import {
  usePostExpenseMutation,
  usePutExpenseMutation,
} from "@/features/transactions/api/transaction/expensesApi";
import { expenseColumns } from "../components/table-columns/transaction/expenseColumn";
import {
  usePostIncomeMutation,
  usePutIncomeMutation,
} from "../api/transaction/incomeApi";
import { incomeColumns } from "../components/table-columns/transaction/incomeColumn";
import { expenseSchema } from "../schema/expense.schema";
import { incomeSchema } from "../schema/income.schema";
import { transferSchema } from "../schema/transfer.schema";
import { transferColumns } from "../components/table-columns/transaction/transferColumn";
import { usePostTransferMutation, usePutTransferMutation } from "../api/transaction/transferApi";

export const transactionConfig = {
  Expense: {
    postTrigger: usePostExpenseMutation,
    editTrigger: usePutExpenseMutation,
    columns: expenseColumns,
    schema: expenseSchema,
  },
  Income: {
    postTrigger: usePostIncomeMutation,
    editTrigger: usePutIncomeMutation,
    columns: incomeColumns,
    schema: incomeSchema,
  },
  Transfer: {
    postTrigger: usePostTransferMutation,
    editTrigger: usePutTransferMutation,
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
