import { Check, ChevronsUpDown } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { numberInput } from "@/shared/utils/CustomFunctions";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface CategoryAmountSectionProps {
  categoryData: Category[];
  type: string;
  mode: string;
  history?: boolean;
}

export const CategoryAmountSection = ({
  categoryData,
  type,
  mode,
  history,
}: CategoryAmountSectionProps) => {
  const { control, watch, setValue } = useFormContext();

  // Amount is disabled until an account is chosen (for non-recurring past/present transactions)
  const isAmountDisabled =
    !watch("recurring") && !watch("account") && watch("date") <= new Date();

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any,
  ) => {
    const value = Number(e.target.value);
    const accountBalance = watch("account")?.remainingBalance;
    const remainingBalance =
      Number(watch("balance") || 0) + Number(watch("initialAmount") || 0);

    if (
      accountBalance &&
      type !== "Income" &&
      !watch("recurring") &&
      value > accountBalance
    ) {
      toast.error("Insufficient balance");
      e.target.value = String(accountBalance);
      return;
    }

    if (value > remainingBalance && (mode === "transact" || history)) {
      toast.error(`Amount exceeds the total balance of ${remainingBalance}`);
      e.target.value = String(accountBalance ?? "");
      return;
    }

    numberInput(e, field);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <FormItem className="flex flex-col">
            <FormLabel>
              Category <span className="text-destructive">*</span>
            </FormLabel>
            <Popover modal>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={history}
                    className={cn(
                      "justify-between",
                      !value && "text-muted-foreground",
                    )}
                  >
                    {value
                      ? categoryData?.find((c) => c.id === value?.id)?.name
                      : "Select category"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent full className="w-[200px] h-52 p-0">
                <Command>
                  <CommandInput placeholder="Search category..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categoryData?.map((category) => (
                        <CommandItem
                          value={category}
                          key={category.id}
                          onSelect={() => {
                            if (type === "Transfer") setValue("to", null);
                            onChange(category);
                          }}
                        >
                          {category.name}
                          <Check
                            className={cn(
                              "ml-auto",
                              category.id === value?.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="amount"
        control={control}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>
              Amount <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  ₱
                </span>
                <Input
                  {...field}
                  min={0}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-7 text-sm"
                  disabled={isAmountDisabled}
                  onChange={(e) => handleAmountChange(e, field)}
                />
              </div>
            </FormControl>
            {(mode === "transact" || history) && (
              <p className="text-xs text-muted-foreground">
                Balance: ₱{Number(watch("balance") ?? 0).toFixed(2)}
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};