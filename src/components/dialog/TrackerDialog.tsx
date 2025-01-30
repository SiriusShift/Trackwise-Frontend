import useScreenWidth from "@/hooks/useScreenWidth";
import { Plus } from "lucide-react";
import React from "react";
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
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerClose,
} from "../ui/drawer";
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
} from "../ui/form";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../ui/select";
import { useGetCategoryQuery } from "@/feature/category/api/categoryApi";
import { Input } from "../ui/input";
import { numberInput } from "@/utils/CustomFunctions";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";

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
  const { data: categoryData } = useGetCategoryQuery();

  const form = useForm<trackerFormType>({
    resolver: yupResolver(trackerSchema.schema),
    mode: "onChange",
    defaultValues: trackerSchema.defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = form;

  const onSubmit = async (data: trackerFormType) => {
    console.log(data);
  };

  // Define the form UI
  const formContent = (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 ${width > 675 ? "px-0" : "px-4"}`}>
        {/* Category Field */}
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
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
                  <SelectContent className="max-h-[200px]">
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
            <FormItem>
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
            <Button type="submit" disabled={!isValid}>
              {mode === "edit" ? "Update" : "Set"} Budget Limit
            </Button>
          </AlertDialogFooter>
        ) : (
          <DrawerFooter className="flex justify-end gap-2 px-0">
              <Button
                type="button"
                onClick={() => form.reset()}
                variant="secondary"
              >
                Close
              </Button>
            <Button type="submit" disabled={!isValid}>
              {mode === "edit" ? "Update" : "Set"} Budget Limit
            </Button>
          </DrawerFooter>
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
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant={"outline"}
              size={"icon"}
              className="h-11 w-11 rounded-full border-primary border-2"
            >
              <Plus size={30} />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <DrawerHeader>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-gray-500">{description}</p>
            </DrawerHeader>
            {formContent}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

export default TrackerDialog;
