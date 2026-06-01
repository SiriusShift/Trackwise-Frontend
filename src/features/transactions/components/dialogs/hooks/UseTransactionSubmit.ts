import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { toast } from "sonner";
import { assetsApi } from "@/shared/api/assetsApi";
import { categoryApi } from "@/shared/api/categoryApi";
import { transactionApi } from "@/features/transactions/api/transaction";
import { expensesApi } from "@/features/transactions/api/transaction/expensesApi";
import { incomeApi } from "@/features/transactions/api/transaction/incomeApi";
import { transferApi } from "@/features/transactions/api/transaction/transferApi";
import { IRootState } from "@/app/store";

type TransactionType = "Expense" | "Income" | "Transfer";

const TRANSACT_LABEL: Record<string, string> = {
  expense: "Pay",
  income: "Receive",
  transfer: "Transfer",
};

const SUCCESS_VERB: Record<string, Record<string, string>> = {
  edit: { Expense: "updated", Income: "updated", Transfer: "updated" },
  transact: { Expense: "paid", Income: "received", Transfer: "transferred" },
  add: { Expense: "added", Income: "added", Transfer: "added" },
};

interface UseTransactionSubmitProps {
  type: TransactionType;
  mode: string;
  history?: boolean;
  categoryLimit: any[];
  fetchData: (data: any) => Promise<any>;
  editHistory: (args: any) => Promise<any>;
  watch: (field?: string) => any;
  reset: () => void;
  setOpen: (open: boolean) => void;
}

export function useTransactionSubmit({
  type,
  mode,
  history,
  categoryLimit,
  fetchData,
  editHistory,
  watch,
  reset,
  setOpen,
}: UseTransactionSubmitProps) {
  const dispatch = useDispatch();
  const { confirm } = useConfirm();

  function getTransactLabel() {
    return TRANSACT_LABEL[type.toLowerCase()] ?? "Submit";
  }

  function getActionLabel() {
    if (mode === "edit") return "Update";
    if (mode === "transact") return getTransactLabel();
    return "Add";
  }

  function buildFormData(data: any) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      switch (key) {
        case "date":
          formData.append(
            "date",
            moment(value as any)
              .utc()
              .format(),
          );
          break;
        case "category":
          formData.append("category", (value as any)?.id);
          break;
        case "account":
          formData.append("account", (value as any)?.id);
          break;
        case "to":
          formData.append("to", (value as any)?.id);
          break;
        default:
          if (value !== null && value !== undefined) {
            formData.append(key, value as any);
          }
      }
    });
    if (watch("recurring")) formData.append("type", type);
    return formData;
  }

  function buildJsonData(data: any) {
    return {
      ...data,
      category: data.category?.id,
      ...(data.account && { account: data.account.id }),
      ...(data.to && { to: data.to.id }),
      type,
    };
  }

  function getBudgetWarning() {
    const isSpending = type === "Expense" || type === "Transfer";
    if (!isSpending || !categoryLimit?.length) return "";

    const over = categoryLimit.some(
      (item) =>
        Number(watch("amount")) + Number(item.total) > item.value &&
        watch("category")?.name === item.category?.name,
    );
    return over ? "This will go over your budget limit." : "";
  }

  function invalidateCaches() {
    if (mode === "edit") {
      const tagMap: Record<TransactionType, string[]> = {
        Expense: ["Expenses", "Recurring"],
        Income: ["Income", "Recurring"],
        Transfer: ["Transfer", "Recurring"],
      };
      const apiMap: Record<TransactionType, any> = {
        Expense: expensesApi,
        Income: incomeApi,
        Transfer: transferApi,
      };
      dispatch(apiMap[type].util.invalidateTags(tagMap[type]));
    }
    dispatch(assetsApi.util.invalidateTags(["Assets"]));
    dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
    dispatch(transactionApi.util.invalidateTags(["History", "Stats"]));
  }

  async function onSubmit(data: any) {
    const isRecurring = watch("recurring");
    const formattedData = isRecurring
      ? buildJsonData(data)
      : buildFormData(data);
    const warning = getBudgetWarning();
    const actionLabel = getActionLabel();

    confirm({
      title: `${actionLabel} ${watch("recurring") ? "schedule" : type}`,
      description: `Are you sure you want to ${actionLabel.toLowerCase()} this ${
        isRecurring ? "recurring " : ""
      }${type.toLowerCase()}? ${warning}`,
      variant: warning ? "warning" : "info",
      confirmText: actionLabel,
      cancelText: "Cancel",
      showLoadingOnConfirm: true,
      onConfirm: async () => {
        try {
          // if (history) {
          //   await editHistory({ data: formattedData, id: data.id }).unwrap();
          // } else
          if (mode === "edit" || mode === "transact") {
            await fetchData({ data: formattedData, id: data.id }).unwrap();
          } else {
            await fetchData(formattedData).unwrap();
          }

          invalidateCaches();
          reset();
          setOpen(false);
          toast.success(
            `${type} ${SUCCESS_VERB[mode]?.[type] ?? "submitted"} successfully.`,
          );
        } catch (err: any) {
          toast.error(err?.data?.error ?? "Something went wrong.");
        }
      },
    });
  }

  return { onSubmit, getActionLabel };
}
