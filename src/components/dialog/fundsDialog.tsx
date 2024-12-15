import {
  Copy,
  Plus,
  CalendarDays,
  Calendar as CalendarIcon,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import { expenseSchema, recurringExpense } from "@/schema/schema";
import { FormProvider, useForm } from "react-hook-form";
import { useGetCategoryQuery } from "@/feature/category/api/categoryApi";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import moment from "moment";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useGetAssetQuery } from "@/feature/assets/api/assetsApi";
import { numberInput } from "@/utils/CustomFunctions";
import useScreenWidth from "@/hooks/useScreenWidth";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
  DrawerFooter,
} from "../ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  usePostExpenseMutation,
  usePostRecurringExpenseMutation,
} from "@/feature/expenses/api/expensesApi";
import { toast, Toaster } from "sonner";
import { frequencies } from "@/utils/Constants";

type AddExpenseFormData = {
  userId: string;
  category: Object;
  description: string;
  amount: number;
  endDate: Date;
  startDate: Date;
  frequency: string;
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * A dialog component for adding a new expense.
   * It accepts a type prop which can be either "income" or "expense".
   * The dialog component renders a form with fields for date, category, source, description, and amount.
   * The form is validated using the `expenseSchema` schema.
   * The onSubmit handler is called when the form is submitted with valid data.
   * The component renders a different UI based on the screen width.
   * If the screen width is greater than 768px, it renders a Dialog component.
   * Otherwise, it renders a Drawer component.
   */
  /******  6b4ca4a7-dace-472e-9f44-c8ea54efafed  *******/ date: Date;
  source: Object;
  status: string;
};

export function AddDialog({ type, active }: { type: string; active: string }) {
  const [open, setOpen] = useState(false);
  const width = useScreenWidth();
  const userId = useSelector((state) => state?.userDetails?.id);

  console.log("is open?", open);

  // RTK QUERY
  const { data: categoryData, isLoading: isLoadingCategory } =
    useGetCategoryQuery({
      type: type,
    });

  const { data: assetData, isLoading: isLoadingAsset } = useGetAssetQuery();
  console.log(assetData);
  const [postExpense, { isLoading }] = usePostExpenseMutation();
  const [postRecurring] = usePostRecurringExpenseMutation();

  // React Hook Form
  const form = useForm<AddExpenseFormData>({
    resolver: yupResolver(
      active === "Recurring" ? recurringExpense.schema : expenseSchema.schema
    ),
    mode: "onChange",
    defaultValues:
      active === "Recurring"
        ? recurringExpense.defaultValues
        : expenseSchema.defaultValues,
  });

  console.log(form.watch());

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors, isValid },
  } = form;

  console.log(errors);

  useEffect(() => {
    setValue("userId", userId);
  }, [userId]);

  const onSubmit = async (data: AddExpenseFormData) => {
    console.log("Submitted data:", data);
    try {
      if (active === "Recurring") {
        await postRecurring({
          ...data,
          userId: parseInt(data?.userId),
          frequency: data?.frequency?.name,
          category: data?.category?.id,
        });
      } else {
        await postExpense({
          ...data,
          status: active === "All" && "Paid",
          recurring: active === "Recurring" ? true : false,
          source: data?.source?.id || "",
          category: data?.category?.id || "",
          userId: parseInt(data?.userId),
        });
      }
      reset({
        userId: userId,
      }); // Reset the form after successful submission
      setOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("error");
    }
  };

  return (
    <>
      {width > 640 ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setOpen(true)} variant="outline">
              <Plus className="sm:mr-2" />{" "}
              <span className="hidden sm:inline">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:min-w-md">
            <DialogHeader>
              <DialogTitle>
                Add {active === "Recurring" ? "recurring " : ""} expense
              </DialogTitle>
              <DialogDescription>
                Fill in the details to create a new{" "}
                {active === "Recurring" ? "recurring " : ""} expense
              </DialogDescription>
            </DialogHeader>

            {/* Wrap the form with FormProvider */}
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex gap-4 flex-col">
                  <div
                    className={`${active === "All" ? "order-1" : ""} space-y-4`}
                  >
                    <div className="grid grid-cols-2 gap-5">
                      <FormField
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  // Find the selected category object based on the value (category name)
                                  const selectedCategory = categoryData?.find(
                                    (category) => category.name === value
                                  );
                                  field.onChange(selectedCategory); // Set the entire object in the form state
                                }}
                                value={field.value?.name} // Set the category name as the value for display
                              >
                                <SelectTrigger className="capitalize">
                                  {/* Display the name of the selected category */}
                                  <SelectValue placeholder="Select a category">
                                    {field.value?.name || "Select a category"}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
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
                      <FormField
                        name="amount"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                min={0}
                                type="number"
                                step="0.01"
                                placeholder="Enter amount"
                                className="input-class text-sm"
                                disabled={active === "All" && !watch("source")}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  const balance = watch("source")?.balance;

                                  if (
                                    active === "All" &&
                                    balance &&
                                    value > balance
                                  ) {
                                    toast.error("Insufficient balance");
                                    e.target.value = balance; // Reset to the maximum allowed value
                                  } else {
                                    numberInput(e, field); // Proceed with normal input handling
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter description"
                              className="input-class text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {active === "All" ? (
                    <>
                      <FormField
                        control={control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date & Time</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      `${moment(field.value).format(
                                        "MMM DD, YYYY hh:mm A"
                                      )}` // Format date & time
                                    ) : (
                                      <span>Pick a date & time</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-4"
                                align="start"
                              >
                                <div className="flex flex-col space-y-4">
                                  {/* Calendar for Date Selection */}
                                  <Calendar
                                    mode="single"
                                    selected={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
                                    }
                                    onSelect={(date) => {
                                      const newDate = new Date(
                                        date.setHours(
                                          field.value
                                            ? new Date(field.value).getHours()
                                            : 0,
                                          field.value
                                            ? new Date(field.value).getMinutes()
                                            : 0
                                        )
                                      );
                                      console.log("Selected Date:", newDate);
                                      field.onChange(newDate); // Update date with time preserved
                                    }}
                                    initialFocus
                                    disabled={(date) => {
                                      const minDate = new Date("2000-01-01"); // Minimum date
                                      const maxDate =
                                        active === "Recurring"
                                          ? null
                                          : new Date(); // Maximum date only for "Recurring"
                                      return (
                                        date < minDate ||
                                        (maxDate && date > maxDate)
                                      ); // Only check maxDate if it exists
                                    }}
                                  />
                                  {/* Time Picker for Time Selection */}
                                  <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">
                                      Time:
                                    </label>
                                    <input
                                      type="time"
                                      className="border rounded-md px-2 py-1 text-sm"
                                      value={
                                        field.value
                                          ? moment(field.value).format("HH:mm")
                                          : ""
                                      }
                                      onChange={(e) => {
                                        const [hours, minutes] = e.target.value
                                          .split(":")
                                          .map(Number);
                                        const updatedDate = new Date(
                                          field.value || new Date()
                                        );
                                        updatedDate.setHours(hours, minutes);
                                        console.log(
                                          "Selected Time:",
                                          updatedDate
                                        );
                                        field.onChange(updatedDate); // Update time with date preserved
                                      }}
                                    />
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                            <FormMessage>{errors.date?.message}</FormMessage>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-5">
                        <FormField
                          name="source"
                          control={control}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Source</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(value) => {
                                    // Find the selected category object based on the value (category name)
                                    console.log(value);
                                    const selectedSource = assetData?.find(
                                      (source) => source.name === value
                                    );
                                    field.onChange(selectedSource); // Set the entire object in the form state
                                  }}
                                  defaultValue={field.value?.name}
                                >
                                  <SelectTrigger className="capitalize">
                                    <SelectValue placeholder="Select source" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[200px]">
                                    {assetData?.map((source) => (
                                      <SelectItem
                                        key={source.id}
                                        value={source.name}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span>{source.name}</span>
                                          <span className="text-sm ml-2 text-gray-500">
                                            ₱{source?.remainingBalance}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="recipient"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Recipient</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Enter Recipient"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      moment(field.value).format("MMM DD, YYYY") // Ensure value is parsed
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    console.log("Selected Date:", date); // Debugging log
                                    field.onChange(date);
                                  }}
                                  initialFocus
                                  disabled={(date) => {
                                    const minDate = new Date("2000-01-01"); // Minimum date
                                    const maxDate =
                                      active === "Recurring"
                                        ? null
                                        : new Date(); // Maximum date only for "Recurring"
                                    return (
                                      date < minDate ||
                                      (maxDate && date > maxDate)
                                    ); // Only check maxDate if it exists
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage>{errors.date?.message}</FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="frequency"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Frequency</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  const selectedCategory = frequencies?.find(
                                    (frequency) => frequency.name === value
                                  );
                                  field.onChange(selectedCategory);
                                }}
                                value={field.value?.name}
                              >
                                <SelectTrigger className="capitalize">
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {frequencies?.map((frequency) => (
                                    <SelectItem
                                      key={frequency.id}
                                      value={frequency.name}
                                    >
                                      {frequency.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="sm:justify-start space-x-2">
                  <Button type="submit" disabled={!isValid}>
                    Add
                  </Button>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      onClick={() => form.reset()}
                      variant="secondary"
                    >
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button size="sm" onClick={() => setOpen(true)} variant="outline">
              <Plus className="sm:mr-2" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="sm:min-w-md px-8 pb-5">
            <DrawerHeader>
              <DrawerTitle>
                Add {active === "Recurring" ? "recurring " : ""} expense
              </DrawerTitle>
              <DrawerDescription>
                Fill in the details to create a new expense
              </DrawerDescription>
            </DrawerHeader>

            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex gap-4 flex-col">
                  <div
                    className={`${active === "All" ? "order-1" : ""} space-y-4`}
                  >
                    <div className="grid grid-cols-2 gap-5">
                      <FormField
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  // Find the selected category object based on the value (category name)
                                  const selectedCategory = categoryData?.find(
                                    (category) => category.name === value
                                  );
                                  field.onChange(selectedCategory); // Set the entire object in the form state
                                }}
                                value={field.value?.name} // Set the category name as the value for display
                              >
                                <SelectTrigger className="capitalize">
                                  {/* Display the name of the selected category */}
                                  <SelectValue placeholder="Select a category">
                                    {field.value?.name || "Select a category"}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
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
                      <FormField
                        name="amount"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                min={0}
                                type="number"
                                step="0.01"
                                placeholder="Enter amount"
                                className="input-class text-sm"
                                disabled={active === "All" && !watch("source")}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  const balance = watch("source")?.balance;

                                  if (
                                    active === "All" &&
                                    balance &&
                                    value > balance
                                  ) {
                                    toast.error("Insufficient balance");
                                    e.target.value = balance; // Reset to the maximum allowed value
                                  } else {
                                    numberInput(e, field); // Proceed with normal input handling
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter description"
                              className="input-class text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {active === "All" ? (
                    <>
                      <FormField
                        control={control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      moment(field.value).format("MMM DD, YYYY") // Ensure value is parsed
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    console.log("Selected Date:", date); // Debugging log
                                    field.onChange(date);
                                  }}
                                  initialFocus
                                  disabled={(date) => {
                                    const minDate = new Date("2000-01-01"); // Minimum date
                                    const maxDate =
                                      active === "Recurring"
                                        ? null
                                        : new Date(); // Maximum date only for "Recurring"
                                    return (
                                      date < minDate ||
                                      (maxDate && date > maxDate)
                                    ); // Only check maxDate if it exists
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage>{errors.date?.message}</FormMessage>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-5">
                        <FormField
                          name="source"
                          control={control}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Source</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(value) => {
                                    // Find the selected category object based on the value (category name)
                                    console.log(value);
                                    const selectedSource = assetData?.find(
                                      (source) => source.name === value
                                    );
                                    field.onChange(selectedSource); // Set the entire object in the form state
                                  }}
                                  defaultValue={field.value?.name}
                                >
                                  <SelectTrigger className="capitalize">
                                    <SelectValue placeholder="Select source" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[200px]">
                                    {assetData?.map((source) => (
                                      <SelectItem
                                        key={source.id}
                                        value={source.name}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span>{source.name}</span>
                                          <span className="text-sm ml-2 text-gray-500">
                                            ₱{source?.remainingBalance}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="recipient"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Recipient</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Enter Recipient"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      moment(field.value).format("MMM DD, YYYY") // Ensure value is parsed
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    console.log("Selected Date:", date); // Debugging log
                                    field.onChange(date);
                                  }}
                                  initialFocus
                                  disabled={(date) => {
                                    const minDate = new Date("2000-01-01"); // Minimum date
                                    const maxDate =
                                      active === "Recurring"
                                        ? null
                                        : new Date(); // Maximum date only for "Recurring"
                                    return (
                                      date < minDate ||
                                      (maxDate && date > maxDate)
                                    ); // Only check maxDate if it exists
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage>{errors.date?.message}</FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="frequency"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Frequency</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  const selectedCategory = frequencies?.find(
                                    (frequency) => frequency.name === value
                                  );
                                  field.onChange(selectedCategory);
                                }}
                                value={field.value?.name}
                              >
                                <SelectTrigger className="capitalize">
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {frequencies?.map((frequency) => (
                                    <SelectItem
                                      key={frequency.id}
                                      value={frequency.name}
                                    >
                                      {frequency.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="sm:justify-start space-x-2">
                  <Button type="submit" disabled={!isValid}>
                    Add
                  </Button>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      onClick={() => form.reset()}
                      variant="secondary"
                    >
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </FormProvider>
          </DrawerContent>
        </Drawer>
      )}{" "}
      <Toaster />
    </>
  );
}
