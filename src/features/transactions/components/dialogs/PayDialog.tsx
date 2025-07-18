import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { CreditCard, Loader, Pencil, Plus } from "lucide-react";
import React from "react";
import { Button } from "../../../../shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
} from "../../../../shared/components/ui/alert-dialog";
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
import { payRecurringSchema } from "@/schema/schema";
import { payRecurringForm } from "@/shared/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../shared/components/ui/form";
import { Input } from "../../../../shared/components/ui/input";
import { numberInput } from "@/shared/utils/CustomFunctions";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useGetAssetQuery } from "@/shared/api/assetsApi";
import { useDispatch } from "react-redux";
import { usePostRecurringPaymentMutation } from "@/features/transactions/api/expensesApi";

function PayDialog({ rowData, mode }: { rowData: Object; mode: string }) {
  const width = useScreenWidth();
  const dispatch = useDispatch();
  console.log(rowData);

  let { data: assetData } = useGetAssetQuery();
  assetData = assetData?.data;
  const [triggerPayment, { isLoading }] = usePostRecurringPaymentMutation();

  const form = useForm<payRecurringForm>({
    resolver: yupResolver(payRecurringSchema.schema),
    mode: "onChange",
    defaultValues: payRecurringSchema.defaultValues,
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = form;

  console.log(watch());

  const onSubmit = async (data: payRecurringForm) => {
    try {
      console.log("Submitted:", data);
      const response = await triggerPayment({
        body: { ...data, amount: rowData?.amount },
        id: rowData?.id,
      });
  
      // Ensure response is valid before showing success toast
      if (response?.error) {
        throw new Error(response.error); // Force it to go to the catch block
      }
  
      toast.success("Payment successful");
      reset();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Error processing payment");
    }
  };
  

  // Define the form UI
  const formContent = (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-full flex flex-col px-1 justify-between gap-2 overflow-auto"
      >
        <div className="flex flex-col gap-2">
          {/* Amount Field */}

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
                    <SelectContent portal={false} className="max-h-[200px]">
                      {assetData?.map((source) => (
                        <SelectItem key={source.id} value={source.name}>
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
          {/* <FormField
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
                      type="number"
                      min={0}
                      disabled={watch("source") === ""}
                      step="0.01"
                      placeholder="Enter amount"
                      className="pl-7"
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        const balance = watch("source")?.remainingBalance;

                        if (balance && value > balance) {
                          toast.error("Insufficient balance");
                          e.target.value = balance; // Reset to the maximum allowed value
                        } else if(value > rowData?.balance){
                          toast.error("Exceeded the remaining balance");
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
          /> */}
        </div>

        {/* Buttons */}
        {width > 640 ? (
          <AlertDialogFooter className="px-0 py-1">
            <AlertDialogCancel asChild>
              <Button
                type="button"
                onClick={() => form.reset()}
                variant="secondary"
              >
                Close
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit" disabled={!isValid}>
                {mode === "edit" ? "Update" : "Pay"} Now
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        ) : (
          <SheetFooter className="flex py-1 justify-end gap-2 px-0">
            <SheetClose asChild>
              <Button type="submit" disabled={!isValid}>
              {isSubmitting ? <Loader className="animate-spin w-4 h-4 mr-2" /> : mode === "edit" ? "Update Now" : "Pay Now"}
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
            <DropdownMenuItem disabled={rowData?.status === "Paid"} onSelect={(e) => e.preventDefault()}>
              <CreditCard />
              Pay
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:min-w-[550px]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className="flex gap-2">
                  <CreditCard />
                  <span>Pay {rowData?.category?.name}</span>
                </div>{" "}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Scheduled {rowData?.frequency?.name} payments for{" "}
                {rowData?.category?.name}
              </AlertDialogDescription>
            </AlertDialogHeader>
            {formContent}
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <DropdownMenuItem disabled={rowData?.status === "Paid"} onSelect={(e) => e.preventDefault()}>
              <CreditCard />
              Pay
            </DropdownMenuItem>
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
                  {mode === "add" ? "Add" : "Edit"} Payment
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

export default PayDialog;
