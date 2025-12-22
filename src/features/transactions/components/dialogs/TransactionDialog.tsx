import { transactionConfig } from "../../config/transactionConfig";
import { useTriggerFetch } from "@/shared/hooks/useLazyFetch";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { expenseSchema } from "@/schema/schema";
import {
  categoryApi,
  useGetCategoryLimitQuery,
  useGetCategoryQuery,
} from "@/shared/api/categoryApi";
import { assetsApi, useGetAssetQuery } from "@/shared/api/assetsApi";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/shared/components/ui/dialog";
import Repeat from "@/shared/components/dialog/DateRepeat/Repeat";
import TransactionForm from "./forms/TransactionForm";
import { IRootState } from "@/app/store";
import {
  transactionApi,
  useUpdateTransactionHistoryMutation,
} from "../../api/transaction";
import { frequencies } from "@/shared/constants/dateConstants";
import { expensesApi } from "../../api/transaction/expensesApi";
import { incomeApi } from "../../api/transaction/incomeApi";
import { transferApi } from "../../api/transaction/transferApi";

export function TransactionDialog({ open, history, mode, rowData, setOpen }) {
  console.log(mode, "mode");
  const [openFrequency, setOpenFrequency] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const startDate = useSelector(
    (state: IRootState) => state.active.active.from
  );
  const endDate = useSelector((state: IRootState) => state.active.active.to);
  const dispatch = useDispatch();
  const { confirm } = useConfirm();
  const type = useSelector((state: IRootState) => state.active.type);

  const [editHistory, { isLoading }] = useUpdateTransactionHistoryMutation();
  const { data: categoryData } = useGetCategoryQuery({ type });
  let { data: assetData } = useGetAssetQuery();
  const { data: categoryLimit, isLoading: categoryLimitLoading } =
    useGetCategoryLimitQuery({
      startDate: startDate,
      endDate: endDate,
    });

  console.log(rowData);

  assetData = assetData?.data;

  const {
    postTrigger,
    editTrigger,
    schema,
    transactTrigger,
    postRecurringTrigger,
  } = transactionConfig[type] || {};

  const { fetchData, isFetching } = useTriggerFetch(
    mode === "edit"
      ? editTrigger
      : mode === "transact"
      ? transactTrigger
      : recurring === true
      ? postRecurringTrigger
      : postTrigger
  );

  const form = useForm({
    resolver: yupResolver(schema?.schema),
    mode: "onChange",
    defaultValues: schema?.defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty, isValid, errors },
  } = form;

  useEffect(() => {
    if (rowData && open) {
      if (type === "Expense") {
        console.log("test recurring1 ");
        if (rowData?.recurringTemplate) {
          console.log("template");
          reset({
            date: rowData?.date,
            id: rowData?.id,
            description: "",
            amount: rowData?.remainingBalance,
            category: rowData?.category,
            balance: rowData?.remainingBalance ?? null,
            recurring: false,
            image: rowData?.image,
            from: rowData?.asset,
          });
        } else if (rowData?.interval) {
          console.log("test recurring!");
          reset({
            date: rowData?.startDate,
            id: rowData?.id,
            description: rowData?.description,
            amount: rowData?.amount,
            endDate: rowData?.endDate,
            recurring: true,
            category: rowData?.category,
            repeat: frequencies?.find(
              (item) =>
                item?.interval === rowData?.interval &&
                item?.unit === rowData?.unit
            ) ?? {
              id: 9,
              interval: rowData?.interval,
              name: "Custom",
              unit: rowData?.unit,
            },
            ...(rowData?.fromAssetId && { from: rowData?.fromAssetId }),
            ...(rowData?.toAssetId && { to: rowData?.toAssetId }),
            auto: rowData?.auto,
          });
          // } else if (mode === "transact") {
          //   console.log("test Transact!");
          //   reset({
          //     date: moment(),
          //     transactMode: "transact",
          //     id: rowData?.id,
          //     description: rowData?.description,
          //     amount: rowData?.remainingBalance,
          //     category: rowData?.category,
          //     image: rowData?.image,
          //     balance: rowData?.remainingBalance ?? null,
          //     from: rowData?.asset,
          //   });
        } else if (mode === "transact") {
          console.log("mode!", mode);
          reset({
            date: moment(),
            id: rowData?.id,
            description: "",
            amount: rowData?.remainingBalance,
            category: rowData?.category,
            image: rowData?.image,
            balance: rowData?.remainingBalance ?? null,
            initialAmount: mode === "transact" ? 0 : rowData?.amount,
          });
        } else {
          console.log("mode!", mode);
          reset({
            date: rowData?.date,
            id: rowData?.id,
            description: rowData?.description,
            amount:
              mode === "transact" ? rowData?.remainingBalance : rowData?.amount,
            category: rowData?.category,
            image: rowData?.image,
            from: rowData?.asset || rowData?.fromAsset || null,
            balance: rowData?.remainingBalance ?? null,
            initialAmount: mode === "transact" ? 0 : rowData?.amount,
          });
        }
      } else if (type === "Income") {
        reset({
          date: rowData?.date,
          id: rowData?.id,
          description: rowData?.description,
          amount: rowData?.amount,
          category: rowData?.category,
          image: rowData?.image,
          to: rowData?.asset,
        });
      }
    }
  }, [open]);

  const handleCustomOpen = () => {
    setOpenFrequency(true);
    setOpen(false);
  };

  const getTransactMode = (type) => {
    switch (type?.toLowerCase()) {
      case "expense":
        return "Pay";
      case "income":
        return "Receive";
      case "transfer":
        return "Transfer";
    }
  };

  const handleClose = () => {
    confirm({
      description:
        "Are you sure you want to close this dialog? All unsaved input will be lost.",
      title: "Close Dialog",
      variant: "destructive",
      confirmText: "Close",
      cancelText: "Cancel",
      onConfirm: () => {
        setOpen(false);
        reset();
      },
    });
  };

  const onSubmit = async (data) => {
    // Build formData
    const formData = new FormData();
    const formatDate = (date) => moment(date).utc().format();

    Object.entries(data).forEach(([key, value]) => {
      switch (key) {
        case "date":
          formData.append("date", formatDate(value));
          break;
        case "category":
          formData.append("category", value?.id);
          break;
        case "from":
          if (type !== "Income") formData.append("from", value?.id);
          break;
        case "to":
          if (type !== "Expense") formData.append("to", value?.id);
          break;
        default:
          formData.append(key, value);
      }
    });

    if (watch("recurring")) {
      formData.append("type", type);
    }

    // Prepare formattedData (for recurring)
    const formattedData = watch("recurring")
      ? {
          ...data,
          category: data?.category?.id,
          ...(data?.from && { from: data?.from?.id }),
          ...(data?.to && { to: data?.to?.id }),
          // isVariable: data?.mode === "variable",
          type,
        }
      : formData;

    // Budget warning
    const warning =
      (type === "Expense" || type === "Transfer") &&
      categoryLimit?.some(
        (item) =>
          Number(watch("amount")) + Number(item?.total) > item?.value &&
          watch("category")?.name === item?.category?.name
      )
        ? "This will go over the budget"
        : "";

    console.log(formattedData)

    // Confirmation modal
    confirm({
      title: `${
        mode === "edit"
          ? "Update"
          : mode === "transact"
          ? getTransactMode(type)
          : "Add"
      } ${type}`,
      showLoadingOnConfirm: true,
      description: `Are you sure you want to ${
        mode === "edit"
          ? "update"
          : mode === "transact"
          ? getTransactMode(type)?.toLowerCase()
          : "add"
      } this ${
        watch("recurring") ? "recurring " : ""
      }${type.toLowerCase()}? ${warning}`,
      variant: warning ? "warning" : "info",
      confirmText: mode === "edit" ? "Update" : "Add",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          if (history) {
            await editHistory({ data: formattedData, id: data?.id }).unwrap();
          } else if (["edit", "transact"].includes(mode)) {
            await fetchData({ data: formattedData, id: data?.id }).unwrap();
          } else {
            await fetchData(formattedData).unwrap();
          }

          if (type === "Expense") {
            dispatch(
              expensesApi.util.invalidateTags(["Expenses", "Recurring"])
            );
          } else if (type === "Income") {
            dispatch(incomeApi.util.invalidateTags(["Income", "Recurring"]));
          } else if (type === "Transfer") {
            dispatch(
              transferApi.util.invalidateTags(["Transfer", "Recurring"])
            );
          }
          dispatch(assetsApi.util.invalidateTags(["Assets"]));
          dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
          dispatch(transactionApi.util.invalidateTags(["History"]));

          reset();
          setOpen(false);
          toast.success(
            `${type} ${
              mode === "edit"
                ? "updated"
                : mode === "transact"
                ? type === "Expense"
                  ? "paid"
                  : type === "Income"
                  ? "received"
                  : "transfered"
                : "added"
            } successfully`
          );
        } catch (err) {
          toast.error(err?.data?.error || "Something went wrong");
        }
      },
    });
  };

  return (
    <FormProvider {...form}>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o && isDirty) {
            handleClose();
          } else {
            setOpen(o);
          }
        }}
      >
        <DialogContent
          onInteractOutside={(e) => isDirty && e.preventDefault()}
          className="w-full flex flex-col max-w-full h-dvh sm:max-w-lg sm:h-auto px-0 sm:max-h-[90%] p sm:min-h-lg sm:w-md"
        >
          <DialogHeader className="px-6">
            <DialogTitle>
              {mode === "add"
                ? `Add ${type}`
                : mode === "transact"
                ? `Pay ${type}`
                : `Edit ${type}`}
            </DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? `Fill in the details to create a new ${
                    watch("recurring") ? "recurring " : ""
                  }${type.toLowerCase()}.`
                : mode === "transact"
                ? `Confirm and complete payment for this ${
                    watch("recurring") ? "recurring " : ""
                  }${type.toLowerCase()}.`
                : `Update the details of this ${
                    watch("recurring") ? "recurring " : ""
                  }${type.toLowerCase()}.`}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4 px-6 overflow-auto p-1">
            <TransactionForm
              type={type}
              assetData={assetData}
              setRecurring={setRecurring}
              mode={mode}
              history={history}
              setOpenFrequency={handleCustomOpen}
              categoryData={categoryData}
            />
          </form>

          <DialogFooter className="flex flex-col px-6 sm:flex-row gap-2">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={(!isDirty && mode !== "transact") || !isValid}
            >
              {mode === "edit"
                ? "Update"
                : mode === "transact"
                ? getTransactMode(type)
                : "Add"}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                onClick={() => (isDirty ? handleClose() : setOpen(false))}
                variant="secondary"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Repeat
        open={openFrequency}
        setParentDialogOpen={setOpen}
        setOpen={setOpenFrequency}
      />
    </FormProvider>
  );
}
