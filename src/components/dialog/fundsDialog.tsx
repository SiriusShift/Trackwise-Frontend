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
import { usePostExpenseMutation } from "@/feature/expenses/api/expensesApi";
import { toast, Toaster } from "sonner";

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
  const [postExpense, { isLoading }] = usePostExpenseMutation();

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

  const { handleSubmit, setValue, reset, formState } = form;

  useEffect(() => {
    setValue("userId", userId);
  }, [userId]);

  const onSubmit = async (data: AddExpenseFormData) => {
    console.log("Submitted data:", data);
    try {
      await postExpense({
        ...data,
        recurring: active === "Recurring" ? true : false,
        source: data?.source?.id || "",
        category: data?.category?.id || "",
        userId: parseInt(data?.userId),
      });
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
                    className={`${
                      active === "Recurring" ? "order-1" : ""
                    } space-y-4`}
                  >
                    <div className="grid grid-cols-2 gap-5">
                      <FormField
                        name="category"
                        control={form.control}
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
                                <SelectContent>
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
                        control={form.control}
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
                                disabled={
                                  active === "Regular" && !form.watch("source")
                                }
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  const balance = form.watch("source")?.balance;

                                  if (
                                    active === "Regular" &&
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
                      control={form.control}
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

                  {active === "Regular" ? (
                    <div>
                      <FormField
                        control={form.control}
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
                            <FormMessage>
                              {form.formState.errors.date?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="source"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
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
                                <SelectContent>
                                  {assetData?.map((source) => (
                                    <SelectItem
                                      key={source.id}
                                      value={source.name}
                                    >
                                      <div className="flex justify-between items-center">
                                        <span>{source.name}</span>
                                        <span className="text-sm ml-2 text-gray-500">
                                          ₱{source?.balance}
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
                      {/* Description Field */}

                      {/* Amount Field */}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-5">
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
                              <FormMessage>
                                {form.formState.errors.date?.message}
                              </FormMessage>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>End Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      disabled={!form.watch("startDate")}
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
                                      field.onChange(date); // Update the form with the selected end date
                                    }}
                                    initialFocus
                                    disabled={(date) => {
                                      const minDate = form.watch("startDate"); // Get the start date
                                      // Check if minDate exists and return true to disable dates before it
                                      return minDate
                                        ? date < new Date(minDate)
                                        : false;
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem className="space-y-2 flex flex-col">
                              <FormLabel>Status</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex"
                                >
                                  <FormItem className="flex w-1/2 items-center border px-3 border-warning  py-2 rounded-md space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="Unpaid" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Unpaid
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex w-1/2 items-center border px-3 border-success py-2 rounded-md space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="Paid" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Paid
                                    </FormLabel>
                                  </FormItem>
                                  {/* <FormItem className="flex items-center border px-3 border-destructive py-2 rounded-md space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Overdue" />
                            </FormControl>
                            <FormLabel className="font-normal">Overdue</FormLabel>
                          </FormItem> */}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
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
                                    const selectedCategory = categoryData?.find(
                                      (category) => category.name === value
                                    );
                                    field.onChange(selectedCategory);
                                  }}
                                  value={field.value?.name}
                                >
                                  <SelectTrigger className="capitalize">
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                  <SelectContent>
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
                      </div>
                    </>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="sm:justify-start space-x-2">
                  <Button type="submit" disabled={!formState.isValid}>
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
          <DrawerContent className="sm:min-w-md px-2">
            <DrawerHeader>
              <DrawerTitle>
                Add {active === "Recurring" ? "recurring " : ""} expense
              </DrawerTitle>
              <DrawerDescription>
                Fill in the details to create a new expense
              </DrawerDescription>
            </DrawerHeader>

            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-4 space-y-3">
                  {/* Category and Date Fields */}
                  <div className="grid grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    moment(field.value).format("MMM DD, YYYY")
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
                                onSelect={(date) => field.onChange(date)}
                                initialFocus
                                disabled={(date) => {
                                  const minDate = new Date("2000-01-01");
                                  const maxDate = new Date();
                                  return date < minDate || date > maxDate;
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage>
                            {form.formState.errors.date?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="category"
                      control={form.control}
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
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
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
                  </div>

                  {/* Source Field */}
                  <FormField
                    name="source"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Source</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              const selectedSource = assetData?.find(
                                (source) => source.name === value
                              );
                              field.onChange(selectedSource);
                            }}
                            value={field.value?.name}
                          >
                            <SelectTrigger className="capitalize">
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent>
                              {assetData?.map((source) => (
                                <SelectItem key={source.id} value={source.name}>
                                  <div className="flex justify-between items-center">
                                    <span>{source.name}</span>
                                    <span className="text-sm ml-2 text-gray-500">
                                      ₱{source?.balance}
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

                  {/* Description Field */}
                  <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Amount Field */}
                  <FormField
                    name="amount"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="Enter amount"
                            onChange={(e) => numberInput(e, field)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {active === "Recurring" ? (
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex"
                            >
                              <FormItem className="flex items-center border px-3 border-warning  py-2 rounded-md space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Unpaid" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Unpaid
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center border px-3 border-success py-2 rounded-md space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Paid" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Pending
                                </FormLabel>
                              </FormItem>
                              {/* <FormItem className="flex items-center border px-3 border-destructive py-2 rounded-md space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Overdue" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Overdue
                            </FormLabel>
                          </FormItem> */}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    ""
                  )}
                </div>
                {/* Footer Buttons */}
                <DrawerFooter className="sm:justify-start">
                  <Button type="submit" disabled={!formState.isValid}>
                    Add
                  </Button>
                  <DrawerClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </FormProvider>
          </DrawerContent>
        </Drawer>
      )}{" "}
      <Toaster />
    </>
  );
}
