import { IRootState } from "@/app/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useScreenWidth from "../hooks/useScreenWidth";
import { setActionShow } from "../slices/activeSlice";
import { motion } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { Archive, Banknote, Check, Eye, Pencil, Trash2, X } from "lucide-react";
import { TransactionDialog } from "@/features/transactions/components/dialogs/TransactionDialog";
import ViewTransaction from "./dialog/ViewDialog/ViewTransaction";
import { useConfirm } from "../provider/ConfirmProvider";
import { handleCatchErrorMessage } from "../utils/CustomFunctions";
import { toast } from "sonner";
import { categoryApi } from "../api/categoryApi";
import { assetsApi } from "../api/assetsApi";
import { useArchiveTransactionMutation } from "@/features/transactions/api/transaction";
import { expensesApi } from "@/features/transactions/api/transaction/expensesApi";
import { incomeApi } from "@/features/transactions/api/transaction/incomeApi";
import { transferApi } from "@/features/transactions/api/transaction/transferApi";

const CommonToolbar = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<string>();

  const showActionTab = useSelector((state: IRootState) => state.active.action);
  const selectedData = useSelector(
    (state: IRootState) => state.active.activeRow,
  );
  const width = useScreenWidth();
  const dispatch = useDispatch();
  const { confirm } = useConfirm();

  const [archive] = useArchiveTransactionMutation();

  const onView = () => {
    setViewOpen(true);
  };

  const onTransact = async () => {
    console.log(selectedData?.recurringTemplate, "expense payment");
    if (selectedData?.recurringTemplate?.auto) {
      confirm({
        title: "Confirm Payment",
        description: "Do you want to proceed with paying this expense?",
        variant: "info",
        confirmText: "Pay",
        cancelText: "Cancel",
        showLoadingOnConfirm: true,
        onConfirm: async () => {
          try {
            await payAuto({
              id: expense.id,
              data: {
                type: "Expense",
              },
            }).unwrap();
            dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
          } catch (err) {
            let errorMessage = handleCatchErrorMessage(err); // Default message
            toast.error(errorMessage);
          }
        },
      });
    } else {
      setMode("transact");
      setDialogOpen(true); // open dialog
    }
  };

  const onArchive = async () => {
    confirm({
      description: `Are you sure you want to archive this expense?`,
      title: `Archive expense`,
      variant: "info",
      confirmText: "Confirm",
      showLoadingOnConfirm: true,
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await archive({
            data: {
              type: selectedData?.category?.type.toLowerCase(),
            },
            id: selectedData.id,
          }).unwrap();
          if (selectedData?.category?.type === "Expense") {
            dispatch(
              expensesApi.util.invalidateTags(["Expenses", "Recurring"]),
            );
          } else if (selectedData?.category?.type === "Income") {
            dispatch(incomeApi.util.invalidateTags(["Income", "Recurring"]));
          } else if (selectedData?.category?.type === "Transfer") {
            dispatch(
              transferApi.util.invalidateTags(["Transfer", "Recurring"]),
            );
          }
          dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
          dispatch(assetsApi.util.invalidateTags(["Assets"]));
        } catch (err) {
          console.log(err);
          toast.error(err?.data?.error);
        }
      },
    });
  };

  const onEdit = () => {
    setMode("edit");
    setDialogOpen(true);
  };
  return (
    <>
      {showActionTab && width < 640 && (
        <motion.div className="fixed top-15 left-0 right-0 z-50 w-full border-b bg-background px-5 py-2 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onEdit}
            disabled={
              selectedData?.status === "Paid" ||
              selectedData?.status === "Received" ||
              selectedData?.status === "Completed"
            }
          >
            <Pencil className="w-4 h-4" />
          </Button>
          {selectedData?.category?.type !== "Transfer" && (
            <Button
              variant="outline"
              onClick={onTransact}
              disabled={
                selectedData?.status === "Paid" ||
                selectedData?.status === "Received"
              }
            >
              <Banknote className="w-4 h-4" />
            </Button>
          )}

          {selectedData?.category?.type === "Transfer" && (
            <Button
              variant="outline"
              onClick={onTransact}
              disabled={selectedData?.status === "Completed"}
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          <Button variant="outline" onClick={onView}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={onArchive}>
            <Archive className="w-4 h-4" />
          </Button>
          {selectedData?.recurringTemplate && (
            <Button variant="outline">
              <X className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </motion.div>
      )}

      {showActionTab && (
        <div
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-sm"
          onClick={() => dispatch(setActionShow(false))}
        />
      )}

      <TransactionDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        rowData={selectedData}
        mode={mode}
      />

      <ViewTransaction
        open={viewOpen}
        setOpen={setViewOpen}
        transaction={selectedData}
      />
    </>
  );
};

export default CommonToolbar;
