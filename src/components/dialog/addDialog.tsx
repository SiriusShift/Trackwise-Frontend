import { Copy, Plus } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { yupResolver } from "@hookform/resolvers/yup";
import { addExpenseSchema } from "@/schema/schema";
import { useForm } from "react-hook-form";
import { useGetCategoryQuery } from "@/feature/category/api/categoryApi";

type AddExpenseFormData = {
  category: string;
  description: string;
  amount: number;
};

export function AddDialog() {

  //RTK QUERY
  const {data: categoryData, isLoading: isLoadingCategory} = useGetCategoryQuery();
  //React hook Form
  console.log(categoryData);
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
  } = useForm<AddExpenseFormData>({
    resolver: yupResolver(addExpenseSchema),
    mode: "onSubmit",
    defaultValues: {
      category: "",
      description: "",
      amount: 0,
    },
  });

  const onSubmit = (data: AddExpenseFormData) => {
    console.log("Submitted data:", data);
    reset(); // Reset the form after successful submission
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-2" /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new expense
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Category Field */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              type="text"
              placeholder="Enter category"
              {...register("category")}
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="Enter description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Amount Field */}
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="sm:justify-start">
            <Button type="submit" disabled={!isValid}>
              Add Expense
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
