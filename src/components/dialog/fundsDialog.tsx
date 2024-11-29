import { Copy, Plus, CalendarDays, Calendar } from "lucide-react";

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
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Popover, PopoverContent } from "../ui/popover";
import moment from "moment";

type AddExpenseFormData = {
  category: string;
  description: string;
  amount: number;
};

export function AddDialog({ type }: { type: string }) {
  // RTK QUERY
  const { data: categoryData, isLoading: isLoadingCategory } =
    useGetCategoryQuery({
      type: type,
    });

  console.log(categoryData);
  // React Hook Form
  const form = useForm<AddExpenseFormData>({
    resolver: yupResolver(expenseSchema),
    mode: "onSubmit",
    defaultValues: {
      category: "",
      description: "",
      amount: 0,
      date: moment
    },
  });

  const { handleSubmit, reset, formState } = form;

  const onSubmit = (data: AddExpenseFormData) => {
    console.log("Submitted data:", data);
    reset(); // Reset the form after successful submission
  };

  return (
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
            <FormField
              name="date"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <div className="flex relative space-x-2">
                      <Input placeholder="" type="date" />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className="absolute right-0"
                            variant={"ghost"}
                          >
                            <CalendarDays />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar mode={"single"} onSelect={form.setValue("amount")} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="category"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a category" />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer Buttons */}
            <DialogFooter className="sm:justify-start">
              <Button type="submit" disabled={!formState.isValid}>
                Add Expense
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
