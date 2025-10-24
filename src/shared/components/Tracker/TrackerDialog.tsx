import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { Pencil, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
} from "../ui/alert-dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetClose,
} from "@/shared/components/ui/sheet";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { trackerSchema } from "@/schema/schema";
import { trackerFormType } from "@/shared/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../ui/select";
import {
  useGetCategoryQuery,
  usePatchCategoryLimitMutation,
  usePostCategoryLimitMutation,
} from "@/shared/api/categoryApi";
import { Input } from "../ui/input";
import { numberInput } from "@/shared/utils/CustomFunctions";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { IRootState } from "@/app/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useConfirm } from "@/shared/provider/ConfirmProvider";

function TrackerDialog({
  title,
  mode,
  onSubmit,
  isLoading,
  open,
  setOpen,
  description,
  data,
}: {
  title: string;
  mode: string;
  description: string;
  isLoading: boolean;
  setOpen: (open: boolean) => void;
  open: boolean;
  onSubmit: (data: any) => void;
  data?: Object;
}) {
  //STATE
  // const [open, setOpen] = useState(false);
  //HOOKS
  const width = useScreenWidth();
  const { confirm } = useConfirm(1);
  const type = useSelector((state: IRootState) => state.active.type);
  // RTK Query
  const { data: categoryData } = useGetCategoryQuery({
    type: type,
  });

  const form = useForm<trackerFormType>({
    resolver: yupResolver(trackerSchema.schema),
    mode: "onChange",
    defaultValues: trackerSchema.defaultValues,
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = form;

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

  useEffect(() => {
    if (open && data) {
      setValue("category", data?.category);
      setValue("amount", data?.value);
      setValue("id", data?.id);
    }
    return () => {
      if (!open) {
        reset(trackerSchema.defaultValues); // Reset when dialog closes
      }
    };
  }, [open, data, setValue, reset]);
  return (
    <>
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
            className="sm:min-w-[550px]"
          >
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="h-full flex flex-col justify-between p-1 gap-2 overflow-auto"
            >
              <div className="flex flex-col gap-5">
                {/* Category Field */}
                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            const selectedCategory = categoryData?.find(
                              (category) => category.name === value
                            );
                            field.onChange(selectedCategory);
                          }}
                          value={field.value?.name}
                          disabled={mode === "edit"}
                        >
                          <SelectTrigger className="capitalize">
                            <SelectValue placeholder="Select a category">
                              {field.value?.name || "Select a category"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent
                            portal={false}
                            className="max-h-[200px]"
                          >
                            {categoryData?.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.name}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount Field */}
                <FormField
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Monthly limit</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            ₱
                          </span>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0.00"
                            className="pl-7"
                            onChange={(e) => numberInput(e, field)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="px-0">
                <DialogClose asChild>
                  <Button
                    type="button"
                    onClick={() => (isDirty ? handleClose() : setOpen(false))}
                    variant="secondary"
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={!isValid || !isDirty}>
                  {mode === "edit" ? "Update" : "Set"} budget
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </FormProvider>
    </>
  );
}

export default TrackerDialog;
