import {
  Copy,
  Plus,
  CalendarDays,
  Calendar as CalendarIcon,
  Wallet,
  Pencil,
} from "lucide-react";

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
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  useGetFrequencyQuery,
  usePatchExpenseMutation,
} from "@/feature/expenses/api/expensesApi";
import { assetsApi, useGetAssetQuery } from "@/feature/assets/api/assetsApi";
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
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  usePostExpenseMutation,
  usePostRecurringExpenseMutation,
} from "@/feature/expenses/api/expensesApi";
import { toast } from "sonner";
import { frequencies } from "@/utils/Constants";
// import { date } from "yup";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import {
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";

type AddExpenseFormData = {
  userId: string;
  category: Object;
  description: string;
  amount: number;
  recipient: string;
  expenseId: string;
  endDate: Date;
  startDate: Date;
  frequency: string;
  date: Date;
  source: Object;
  status: string;
};

export function AddDialog({
  active,
  mode,
  rowData,
}: {
  // type: string;
  rowData: Object;
  active: string;
  mode: string;
}) {
  const [initialData, setInitialData] = useState<Object>({});
  const width = useScreenWidth();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state?.userDetails?.id);

  console.log(rowData);

  // RTK QUERY
  const { data: categoryData } = useGetCategoryQuery({
    type: "Expense"
  });
  const { data: frequencyData } = useGetFrequencyQuery();
  const { data: assetData } = useGetAssetQuery();
  console.log(assetData);
  const [postExpense, { isLoading }] = usePostExpenseMutation();
  const [postRecurring] = usePostRecurringExpenseMutation();
  const [triggerPatchExpense, { isLoading: patchLoading }] =
    usePatchExpenseMutation();

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

  console.log(errors, isValid);

  useEffect(() => {
    console.log("Dialog rendered");
    setValue("userId", userId);
  }, [userId]);

  useEffect(() => {
    if (rowData) {
      if (active === "Recurring") {
        setValue("startDate", rowData?.date);
        setValue("frequency", rowData?.frequency);
      } else if (active === "All") {
        setValue("date", rowData?.date);
        setValue("source", rowData?.asset);
      }
      setValue("expenseId", rowData?.id);
      setValue("description", rowData?.description);
      setValue("amount", rowData?.amount);
      setValue("category", rowData?.category);
      setValue("recipient", rowData?.recipient);
      setInitialData(watch());
    }
  }, [rowData]);

  const onSubmit = async (data: AddExpenseFormData) => {
    console.log("Submitted data:", data);
    try {
      if (mode === "edit") {
        await triggerPatchExpense({
          data,
          id: data?.expenseId,
        }).then(() => {
          dispatch(assetsApi.util.invalidateTags(["Assets"]));
        });
        reset({
          ...expenseSchema.defaultValues,
          userId: userId,
        }); // Reset the form after successful submission
        toast.success("Expense updated successfully");
      } else {
        if (active === "Recurring") {
          await postRecurring({
            ...data,
            userId: parseInt(data?.userId),
            freqId: data?.frequency?.id,
            category: data?.category?.id,
            startDate: moment(data?.startDate).utc().format(),
          });
          reset({
            ...expenseSchema.defaultValues,
            userId: userId,
          }); // Reset the form after successful submission
        } else {
          await postExpense({
            ...data,
            status: active === "All" && "Paid",
            recurring: active === "Recurring" ? true : false,
            source: data?.source?.id || "",
            category: data?.category?.id || "",
            userId: parseInt(data?.userId),
            amount: parseFloat(data?.amount),
            date: moment(data?.date).utc().format(),
            assetBalance: watch("source")?.remainingBalance,
          }).then(() => {
            dispatch(assetsApi.util.invalidateTags(["Assets"]));
          });
          reset({
            ...recurringExpense.defaultValues,
            userId: userId,
          }); // Reset the form after successful submission
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("error");
    }
  };

  return (
    <>
      {width > 640 ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {mode === "add" ? (
              <Button size="sm" variant="outline">
                <Plus className="lg:mr-2" />
                <span className="inline sm:hidden lg:inline">Add</span>
              </Button>
            ) : (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  // setDropdownOpen(false); // Close the dropdown
                }}
              >
                <Pencil /> Edit
              </DropdownMenuItem>
            )}
          </AlertDialogTrigger>

          <AlertDialogContent className="sm:min-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {mode === "add" ? "Add" : "Edit"}{" "}
                {active === "Recurring" ? "recurring " : ""} expense
              </AlertDialogTitle>
              <AlertDialogDescription>
                Fill in the details to create a new{" "}
                {active === "Recurring" ? "recurring " : ""} expense
              </AlertDialogDescription>
            </AlertDialogHeader>

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
                      <FormField
                        name="amount"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                  ₱
                                </span>
                                <Input
                                  {...field}
                                  min={0}
                                  type="number"
                                  step="0.01"
                                  placeholder="Enter amount"
                                  className="input-class text-sm pl-7"
                                  disabled={
                                    active === "All" && !watch("source")
                                  }
                                  onChange={(e) => {
                                    const value = Number(e.target.value);
                                    const balance =
                                      watch("source")?.remainingBalance;
                                    console.log(balance);

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
                              </div>
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
                            <Popover modal={true}>
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
                                      className="border text-muted-foreground rounded-md px-2 py-1 text-sm"
                                      value={
                                        field.value
                                          ? moment(field.value).format("HH:mm")
                                          : ""
                                      }
                                      onSelect={(date) => {
                                        const newDate = new Date(
                                          date.setHours(
                                            field.value
                                              ? new Date(field.value).getHours()
                                              : 0,
                                            field.value
                                              ? new Date(
                                                  field.value
                                                ).getMinutes()
                                              : 0
                                          )
                                        );
                                        console.log("Selected Date:", newDate);
                                        field.onChange(newDate); // Update date with time preserved
                                      }}
                                      onChange={(e) => {
                                        const [hours, minutes] = e.target.value
                                          .split(":")
                                          .map(Number);
                                        const updatedDate = field.value
                                          ? new Date(field.value)
                                          : new Date(); // Use the selected date or default to now
                                        updatedDate.setHours(hours, minutes);
                                        console.log(
                                          "Updated Time:",
                                          updatedDate
                                        );
                                        field.onChange(updatedDate); // Update time with the correct date preserved
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
                                    const selectedSource = assetData?.find(
                                      (source) => source.name === value
                                    );
                                    field.onChange(selectedSource); // Set the entire object in the form state
                                  }}
                                  value={field.value?.name}
                                >
                                  <SelectTrigger className="capitalize">
                                    <SelectValue placeholder="Select source" />
                                  </SelectTrigger>
                                  <SelectContent
                                    portal={false}
                                    className="max-h-[200px]"
                                  >
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
                      <div className="grid grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Popover modal={true}>
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
                                        moment(field.value).format(
                                          "MMM DD, YYYY"
                                        ) // Ensure value is parsed
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
                                    const selectedCategory =
                                      frequencyData?.find(
                                        (frequency) => frequency.name === value
                                      );
                                    field.onChange(selectedCategory);
                                  }}
                                  value={field.value?.name}
                                >
                                  <SelectTrigger className="capitalize">
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                  <SelectContent
                                    portal={false}
                                    className="max-h-[200px]"
                                  >
                                    {frequencyData?.map((frequency) => (
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
                      </div>
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
                    </>
                  )}
                </div>

                {/* Footer Buttons */}
                <AlertDialogFooter>
                  <AlertDialogAction asChild>
                    <Button
                      type="submit"
                      disabled={
                        !isValid ||
                        (JSON.stringify(initialData) ===
                          JSON.stringify(watch()) &&
                          mode === "edit")
                      }
                    >
                      {mode === "edit" ? "Update" : "Add"}
                    </Button>
                  </AlertDialogAction>

                  <AlertDialogCancel asChild>
                    <Button
                      type="button"
                      // onClick={() => form.reset()}
                      variant="secondary"
                    >
                      Close
                    </Button>
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </form>
            </FormProvider>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Drawer>
          <DrawerTrigger asChild>
            {mode === "add" ? (
              <Button size="sm" variant="outline">
                <Plus className="lg:mr-2" />{" "}
                <span className="inline sm:hidden lg:inline">Add</span>
              </Button>
            ) : (
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil /> Edit
              </DropdownMenuItem>
            )}
          </DrawerTrigger>
          <DrawerContent className="sm:min-w-md px-8">
            <DrawerHeader>
              <DrawerTitle>
                {mode === "add" ? "Add" : "Edit"}{" "}
                {active === "Recurring" ? "recurring " : ""} expense
              </DrawerTitle>
              <DrawerDescription>
                Fill in the details to create a new expense
              </DrawerDescription>
            </DrawerHeader>

            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="pb-5">
                <div className="flex flex-col py-3 gap-2">
                  <div className={`${active === "All" ? "order-1" : ""}`}>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="hidden sm-inline">
                              Category
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                {" "}
                                <Select
                                  onValueChange={(value) => {
                                    const selectedCategory = categoryData?.find(
                                      (category) => category.name === value
                                    );
                                    field.onChange(selectedCategory); // Update the field state
                                  }}
                                  value={field.value?.name} // Use defaultValue instead of value
                                >
                                  <SelectTrigger className="capitalize">
                                    {/* Display the name of the selected category */}
                                    <SelectValue placeholder="Select category" />
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
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="amount"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="hidden sm-inline">
                              Amount
                            </FormLabel>
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
                          <FormLabel className="hidden sm-inline">
                            Description
                          </FormLabel>
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
                            {/* <FormLabel>Date & Time</FormLabel> */}
                            <Popover modal={true}>
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
                                    onChange={(e) => {
                                      const [hours, minutes] = e.target.value
                                        .split(":")
                                        .map(Number);
                                      const updatedDate = field.value
                                        ? new Date(field.value)
                                        : new Date(); // Use the selected date or default to now
                                      updatedDate.setHours(hours, minutes);
                                      console.log("Updated Time:", updatedDate);
                                      field.onChange(updatedDate); // Update time with the correct date preserved
                                    }}
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                            <FormMessage>{errors.date?.message}</FormMessage>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          name="source"
                          control={control}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormLabel className="hidden sm-inline">
                                Source
                              </FormLabel>
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
                                  <SelectContent
                                    portal={false}
                                    className="max-h-[200px]"
                                  >
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
                            <FormItem className="space-y-0">
                              <FormLabel className="hidden sm-inline">
                                Recipient
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Enter Recipient"
                                  className="input-class text-sm"
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
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Popover modal={true}>
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
                                        moment(field.value).format(
                                          "MMM DD, YYYY"
                                        ) // Ensure value is parsed
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
                      </div>
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
                    </>
                  )}
                </div>

                {/* Footer Buttons */}
                <DrawerFooter className="px-0">
                  <Button type="submit" disabled={!isValid}>
                    {mode === "edit" ? "Update" : "Add"}
                  </Button>
                  <DrawerClose asChild>
                    <Button
                      type="button"
                      onClick={() =>
                        reset({
                          ...expenseSchema.defaultValues,
                          userId: userId,
                        })
                      }
                      variant="secondary"
                    >
                      Close
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </FormProvider>
          </DrawerContent>
        </Drawer>
      )}{" "}
    </>
  );
}
