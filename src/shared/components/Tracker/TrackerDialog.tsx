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

function TrackerDialog({
  title,
  mode,
  onSubmit,
  isLoading,
  description,
  data,
}: {
  title: string;
  mode: string;
  description: string;
  isLoading: boolean;
  onSubmit: (data: any) => void;
  data?: Object;
}) {
  //STATE
  const [open, setOpen] = useState(false);
  //HOOKS
  const width = useScreenWidth();
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

  console.log(watch());

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

  // Define the form UI
  const formContent = (
    <FormProvider {...form}>
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
                    <SelectContent portal={false} className="max-h-[200px]">
                      {categoryData?.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
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
        {/* Buttons */}
        {width > 640 ? (
          <AlertDialogFooter className="px-0">
            <AlertDialogCancel asChild>
              <Button
                type="button"
                onClick={() => {
                  mode === "edit" ? setOpen(false) : form.reset();
                }}
                variant="secondary"
              >
                Close
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit" disabled={!isValid || !isDirty}>
                {mode === "edit" ? "Update" : "Set"} budget
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        ) : (
          <SheetFooter className="flex justify-end gap-2 px-0">
            <SheetClose asChild>
              <Button type="submit" disabled={!isValid}>
                {mode === "edit" ? "Update" : "Set"} Budget Limit
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                type="button"
                onClick={() => {
                  mode === "edit" ? setOpen(false) : form.reset();
                }}
                variant="secondary"
              >
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </form>
    </FormProvider>
  );

  return (
    <>
      {width > 640 ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {mode === "edit" ? (
              <DropdownMenuItem
                onSelect={(e) => {
                  setOpen(true);
                  e.preventDefault();
                  // setDropdownOpen(false); // Close the dropdown
                }}
              >
                <Pencil size={30} />
                Edit
              </DropdownMenuItem>
            ) : (
              <Button
                variant={"outline"}
                size={"icon"}
                className="h-11 bg-card w-11 rounded-full border-primary border-2"
              >
                <Plus className="text-primary" size={30} />
              </Button>
            )}
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:min-w-[550px]">
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            {formContent}
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-full bg-card border-primary border-2"
            >
              <Plus size={30} />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full max-w-full sm:max-w-[18rem] p-5 h-screen flex flex-col"
          >
            <SheetHeader>
              <div className="flex items-center gap-2">
                {mode === "add" ? (
                  <Plus className="h-5 w-5" />
                ) : (
                  <Pencil className="h-5 w-5" />
                )}
                <SheetTitle>{mode === "add" ? "Add" : "Edit"} </SheetTitle>
              </div>
              <hr />
            </SheetHeader>
            {formContent}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

export default TrackerDialog;
