import { transactionConfig } from "../../config/transactionConfig";
import { useTriggerFetch } from "@/shared/hooks/useLazyFetch";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { expenseSchema } from "@/schema/schema";
import { categoryApi, useGetCategoryQuery } from "@/shared/api/categoryApi";
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

export function TransactionDialog({ open, type, mode, rowData, setOpen }) {
  const [openFrequency, setOpenFrequency] = useState(false);
  const dispatch = useDispatch();
  const { confirm } = useConfirm();

  const { data: categoryData } = useGetCategoryQuery({ type });
  let { data: assetData } = useGetAssetQuery();
  assetData = assetData?.data;

  const { postTrigger, editTrigger } = transactionConfig[type] || {};

  const { fetchData, isFetching } = useTriggerFetch(
    mode === "edit" ? editTrigger : postTrigger
  );

  const form = useForm({
    resolver: yupResolver(expenseSchema.schema),
    mode: "onChange",
    defaultValues: expenseSchema.defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, isValid },
  } = form;

  console.log(watch())
  useEffect(() => {
    if (rowData && type === "Expense") {
      reset({
        date: rowData?.date,
        source: rowData?.asset,
        id: rowData?.id,
        description: rowData?.description,
        amount: rowData?.amount,
        category: rowData?.category,
        image: rowData?.image,
      });
    }
  }, [rowData, reset, type]);

  const handleCustomOpen = () => {
    setOpenFrequency(true);
    setOpen(false);
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
    console.log(data);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (key === "date") {
        formData.append("date", moment(value).utc().format());
      } else if (key === "category") {
        formData.append("category", value.id);
      } else if (key === "source") {
        formData.append("source", value.id);
      } else {
        formData.append(key, value);
      }
    });

    confirm({
      title: mode === "edit" ? "Update Expense" : "Add Expense",
      showLoadingOnConfirm: true,
      description:
        mode === "edit"
          ? "Are you sure you want to update this expense?"
          : "Are you sure you want to add this expense?",
      variant: "info",
      confirmText: mode === "edit" ? "Update" : "Add",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          if (mode === "edit") {
            await fetchData({ data: formData, id: data?.id }).unwrap();
          } else {
            await fetchData(formData).unwrap();
          }

          dispatch(assetsApi.util.invalidateTags(["Assets"]));
          dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
          reset();
          setOpen(false);
          toast.success(
            `${type} ${mode === "edit" ? "updated" : "added"} successfully`
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
              {mode === "add" ? "Add" : "Edit"} {type}
            </DialogTitle>
            <DialogDescription>
              Fill in the details to {mode === "add" ? "create" : "update"} this{" "}
              {type.toLowerCase()}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4 px-6 overflow-auto p-1">
            <TransactionForm
              type={type}
              assetData={assetData}
              setOpenFrequency={handleCustomOpen}
              categoryData={categoryData}
            />
          </form>

          <DialogFooter className="flex flex-col px-6 sm:flex-row gap-2">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid || !isDirty}
            >
              {mode === "edit" ? "Update" : "Add"}
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
