import { Plus, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  categoryApi,
  useGetCategoryQuery,
} from "@/feature/category/api/categoryApi";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import moment from "moment";
import { usePatchExpenseMutation } from "@/feature/expenses/api/expensesApi";
import { assetsApi, useGetAssetQuery } from "@/feature/assets/api/assetsApi";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { usePostExpenseMutation } from "@/feature/expenses/api/expensesApi";
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
} from "@/components/ui/dialog";
import { useConfirm } from "@/context/ConfirmContext";

import ExpenseForm from "@/components/page-components/expense/expenseForm";

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
  type,
  mode,
  rowData,
}: {
  // type: string;
  rowData: Object;
  type: string;
  mode: string;
}) {
  const [open, setOpen] = useState(false);
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
    formState: { errors, isDirty, isValid },
  } = form;

  console.log(watch(), isValid);

  useEffect(() => {
    if (rowData) {
      setValue("date", rowData?.date);
      setValue("source", rowData?.asset);
      setValue("expenseId", rowData?.id);
      setValue("description", rowData?.description);
      setValue("amount", rowData?.amount);
      setValue("category", rowData?.category);
      setValue("image", rowData?.image);
      // setInitialData(watch());
    }
  }, [rowData]);

  const onSubmit = async (data: AddExpenseFormData) => {
    try {
      if (mode === "edit") {
        // await confirm({
        //   message: "Are you sure you want to update this expense?",
        // })
        await triggerPatchExpense({
          data,
          id: data?.expenseId,
        })
          .unwrap()
          .then(() => {
            dispatch(assetsApi.util.invalidateTags(["Assets"]));
            dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
          });

        reset({
          ...expenseSchema.defaultValues,
        }); // Reset the form after successful submission
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
              await postExpense({
                ...data,
                recurring: data?.recurring,
                source: data?.source?.id || "",
                category: data?.category?.id || "",
                amount: parseFloat(data?.amount),
                date: moment(data?.date).utc().format(),
                assetBalance: watch("source")?.remainingBalance,
                ...(data?.image && { image: data?.image }),
              }).unwrap();

              dispatch(assetsApi.util.invalidateTags(["Assets"]));
              dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
              reset({
                ...expenseSchema.defaultValues,
              });
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

  const handleClose = () => {
    confirm({
      description: "Are you sure you want to close this dialog?",
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
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
                // setDropdownOpen(false); // Close the dropdown
              }}
              // disabled={rowData?.status === "Paid"}
            >
              <Pencil /> Edit
            </DropdownMenuItem>
          )}
        </DialogTrigger>

        <DialogContent
          onInteractOutside={(e) => isDirty && e.preventDefault()}
          className="w-full flex flex-col max-w-full h-dvh sm:max-w-lg sm:h-auto sm:max-h-[90%] sm:min-h-lg sm:w-md"
        >
          <DialogHeader>
            <DialogTitle>{mode === "add" ? "Add" : "Edit"} expense</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new expense
            </DialogDescription>
          </DialogHeader>

          {/* Wrap the form with FormProvider */}
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 overflow-auto p-1"
            >
              <ExpenseForm
                assetData={assetData}
                control={control}
                categoryData={categoryData}
                watch={watch}
              />
            </form>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" disabled={!isValid}>
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
    </>
  );
}
