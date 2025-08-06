import { Plus, Pencil } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import { expenseSchema } from "@/schema/schema";
import { FormProvider, useForm } from "react-hook-form";
import { categoryApi, useGetCategoryQuery } from "@/shared/api/categoryApi";
import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";
import moment from "moment";
import { usePatchExpenseMutation } from "@/features/transactions/api/expensesApi";
import { assetsApi, useGetAssetQuery } from "@/shared/api/assetsApi";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { usePostExpenseMutation } from "@/features/transactions/api/expensesApi";
import { toast } from "sonner";
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
import { useConfirm } from "@/shared/provider/ConfirmProvider";

import ExpenseForm from "@/features/transactions/components/dialogs/forms/ExpenseForm";
import Repeat from "@/shared/components/dialog/DateRepeat/Repeat";

type AddExpenseFormData = {
  category: Object;
  description: string;
  amount: number;
  mode: string;
  repeat: Object;
  date: Date;
  image: File;
  source: Object;
  months: number;
};

export function TransactionDialog({
  open,
  type,
  mode,
  rowData,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  rowData?: Object;
  type: string;
  mode: string;
}) {
  const [openFrequency, setOpenFrequency] = useState(false);
  const dispatch = useDispatch();
  const { confirm } = useConfirm();
  console.log(rowData);

  // RTK QUERY
  const { data: categoryData } = useGetCategoryQuery({
    type: type,
  });
  let { data: assetData } = useGetAssetQuery();
  assetData = assetData?.data;
  const [postExpense, { isLoading }] = usePostExpenseMutation();
  const [triggerPatchExpense, { isLoading: patchLoading }] =
    usePatchExpenseMutation();

  // React Hook Form
  const form = useForm<AddExpenseFormData>({
    resolver: yupResolver(expenseSchema.schema),
    mode: "onChange",
    defaultValues: expenseSchema.defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { isDirty, isValid },
  } = form;

  console.log(watch(), rowData);

  useEffect(() => {
    if (rowData) {
      reset({
        date: rowData?.date,
        source: rowData?.asset,
        expenseId: rowData?.id,
        description: rowData?.description,
        amount: rowData?.amount,
        category: rowData?.category,
        image: rowData?.image,
      });
      // setInitialData(watch());
    }
  }, [rowData]);

  const onSubmit = async (data: AddExpenseFormData) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key];

      if (key === "date") {
        formData.append("date", moment(value).utc().format());
      } else {
        // fallback for any other field
        formData.append(key, value);
      }
    });

    console.log(formData);

    try {
      if (mode === "edit") {
        // await confirm({
        //   message: "Are you sure you want to update this expense?",
        // })
        await confirm({
          description: "Are you sure you want to update this expense?",
          title: "Update Expense",
          variant: "info",
          confirmText: "Add",
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              await triggerPatchExpense({
                data: formData,
                id: data?.expenseId,
              })
                .unwrap()
                .then(() => {
                  dispatch(assetsApi.util.invalidateTags(["Assets"]));
                  dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
                });

              reset();
              setOpen(false);
            } catch (err) {
              console.log(err);
              toast.error(err?.data?.error);
            }
          },
        });

        reset(); // Reset the form after successful submission
        setOpen(false);
        toast.success("Expense updated successfully");
      } else {
        await confirm({
          description: "Are you sure you want to add this expense?",
          title: "Add Expense",
          variant: "info",
          confirmText: "Add",
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              await postExpense(formData).unwrap();

              dispatch(assetsApi.util.invalidateTags(["Assets"]));
              dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
              reset();
              setOpen(false);
            } catch (err) {
              console.log(err);
              toast.error(err?.data?.error);
            }
          },
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("error");
    }
  };

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

  return (
    <>
      <Dialog
        open={open}
        // modal={false}
        onOpenChange={async (open) => {
          if (!open) {
            if (isDirty) {
              handleClose();
            } else {
              setOpen(false);
            }
          }
        }}
      >
        {/* <DialogTrigger asChild>
          {mode === "add" ? (
            <Button onClick={() => setOpen(true)} size="sm" variant="outline">
              <Plus className="lg:mr-2" />
              <span className="hidden md:inline">Add</span>
            </Button>
          ) : (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setOpen(true);
                setDropdownOpen(false);
              }}
              // disabled={rowData?.status === "Paid"}
            >
              <Pencil /> Edit
            </DropdownMenuItem>
          )}
        </DialogTrigger> */}

        <DialogContent
          onInteractOutside={(e) => isDirty && e.preventDefault()}
          className="w-full flex flex-col max-w-full h-dvh sm:max-w-lg sm:h-auto sm:max-h-[90%] sm:min-h-lg sm:w-md"
        >
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Add" : "Edit"} {type}
            </DialogTitle>
            <DialogDescription>
              Fill in the details to create a new {type.toLocaleLowerCase()}
            </DialogDescription>
          </DialogHeader>

          {/* Wrap the form with FormProvider */}
          <FormProvider {...form}>
            <form
              // onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 overflow-auto p-1"
            >
              <ExpenseForm
                type={type}
                assetData={assetData}
                setOpenFrequency={handleCustomOpen}
                categoryData={categoryData}
              />
            </form>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
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
          </FormProvider>
        </DialogContent>
      </Dialog>
      {/* Form for custom frequency*/}
      <FormProvider {...form}>
        <Repeat
          open={openFrequency}
          setParentDialogOpen={setOpen}
          setOpen={setOpenFrequency}
        />
      </FormProvider>
    </>
  );
}
