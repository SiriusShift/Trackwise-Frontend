import useScreenWidth from "@/hooks/useScreenWidth";
import { Pencil, Plus } from "lucide-react";
import React from "react";
import { Button } from "../../ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
} from "../../ui/alert-dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { trackerSchema } from "@/schema/schema";
import { trackerFormType } from "@/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../../ui/select";
import {
  useGetCategoryQuery,
  usePatchCategoryLimitMutation,
} from "@/feature/category/api/categoryApi";
import { Input } from "../../ui/input";
import { numberInput } from "@/utils/CustomFunctions";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { toast } from "sonner";

function TrackerDialog({
  title,
  mode,
  description,
}: {
  title: string;
  mode: string;
  description: string;
}) {
  const width = useScreenWidth();

  // RTK Query
  const { data: categoryData } = useGetCategoryQuery({
    type: "Expense",
  });

  const [trigger] = usePatchCategoryLimitMutation();

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
    formState: { errors, isValid },
  } = form;

  console.log(watch());

  const onSubmit = async (data: trackerFormType) => {
    try {
      await trigger({
        categoryId: data?.category?.id,
        amount: {
          amount: data?.amount,
        },
      });
      reset();
      console.log(data);
    } catch (err) {
      console.log(err);
      toast.error("error");
    }
  };

  // Define the form UI
  const formContent = (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-full flex flex-col justify-between px-1 gap-2 overflow-auto"
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
                onClick={() => form.reset()}
                variant="secondary"
              >
                Close
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction>
              <Button type="submit" disabled={!isValid}>
                {mode === "edit" ? "Update" : "Set"} Budget Limit
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
                onClick={() => form.reset()}
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
            <Button
              variant={"outline"}
              size={"icon"}
              className="h-11 w-11 rounded-full border-primary border-2"
            >
              <Plus size={30} />
            </Button>
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
              className="h-11 w-11 rounded-full border-primary border-2"
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
                <SheetTitle>
                  {mode === "add" ? "Add" : "Edit"}{" "}
                  {/* {active === "Recurring" ? "recurring " : ""} expense */}
                </SheetTitle>
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
