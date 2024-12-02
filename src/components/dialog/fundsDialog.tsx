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
import { expenseSchema, reccuringExpenseSchema } from "@/schema/schema";
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

type AddExpenseFormData = {
  category: Object;
  description: string;
  amount: number;
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
};

export function AddDialog({ type }: { type: string }) {
  const width = useScreenWidth();
  // RTK QUERY
  const { data: categoryData, isLoading: isLoadingCategory } =
    useGetCategoryQuery({
      type: type,
    });

  const { data: assetData, isLoading: isLoadingAsset } = useGetAssetQuery();

  // React Hook Form
  const form = useForm<AddExpenseFormData>({
    resolver: yupResolver(expenseSchema),
    mode: "onChange",
    defaultValues: {
      category: null,
      description: "",
      amount: 0,
      date: moment(),
      source: null,
    },
  });

  console.log(form.watch());

  const { handleSubmit, reset, formState } = form;

  const onSubmit = (data: AddExpenseFormData) => {
    console.log("Submitted data:", data);
    reset(); // Reset the form after successful submission
  };

  return width > 768 ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="sm:mr-2" />{" "}
          <span className="hidden sm:inline">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new expense
          </DialogDescription>
        </DialogHeader>

        {/* Wrap the form with FormProvider */}
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Category Field */}
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            console.log("Selected Date:", date); // Debugging log
                            field.onChange(date);
                          }}
                          initialFocus
                          disabled={(date) => {
                            const minDate = new Date("2000-01-01"); // Minimum date
                            const maxDate = new Date(); // Maximum date (today)
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
            </div>

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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Notify me about...</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="all" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          All new messages
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="mentions" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Direct messages and mentions
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="none" />
                        </FormControl>
                        <FormLabel className="font-normal">Nothing</FormLabel>
                      </FormItem>
                    </RadioGroup>
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
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter description"
                      className="input-class"
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
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      className="input-class"
                      onChange={(e) => numberInput(e, field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="sm:mr-2" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:min-w-md px-4">
        <DrawerHeader>
          <DrawerTitle>Add Expense</DrawerTitle>
          <DrawerDescription>
            Fill in the details to create a new expense
          </DrawerDescription>
        </DrawerHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="px-4">
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
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
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
                  <FormItem>
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
                  <FormItem>
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
                  <FormItem>
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
  );
}
