import { cn } from "@/lib/utils";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { Check, ChevronsUpDown } from "lucide-react";

const ALLOWED_CATEGORIES = ["CASH", "BANK", "CREDIT", "INVESTMENT"];

interface Asset {
  currency: string | undefined;
  id: number;
  name: string;
  remainingBalance: number;
  remainingCredit?: number;
  category: string;
}

interface AccountSelectProps {
  name: string;
  label: string;
  assets: Asset[];
  control: any;
  disabled?: boolean;
  excludeId?: number; // filters out one asset (e.g. the "from" account in a transfer)
  categories?: string[]; // narrows the selectable account categories
}

export const AccountSelect = ({
  name,
  label,
  assets,
  control,
  disabled,
  excludeId,
  categories = ALLOWED_CATEGORIES,
}: AccountSelectProps) => {
  const filtered = assets.filter(
    (asset) => categories.includes(asset.category) && asset.id !== excludeId,
  );

  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => {
        const account = filtered.find((a) => a.id === value?.id);
        const balance =
          (account?.category === "CREDIT"
            ? account.remainingCredit
            : account?.remainingBalance) ?? 0;
        return (
          <FormItem className="flex flex-col">
            <FormLabel>
              {label} <span className="text-destructive">*</span>
            </FormLabel>
            <Popover modal>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn(
                      "justify-between w-full font-normal",
                      !value && "text-muted-foreground",
                    )}
                  >
                    {value ? (
                      <span className="flex gap-2 min-w-0">
                        <span className="truncate">
                          {account?.name ??
                            assets.find((a) => a.id === value?.id)?.name}
                        </span>
                        <span className="text-muted-foreground shrink-0">
                          {account &&
                            formatCurrency(
                              balance,
                              account.currency,
                              "symbol",
                            )}
                        </span>
                      </span>
                    ) : (
                      "Select account..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent full className="p-0">
                <Command>
                  <CommandInput placeholder="Search account..." />
                  <CommandList>
                    <CommandEmpty>No accounts found.</CommandEmpty>
                    <CommandGroup>
                      {filtered.map((asset) => {
                        const balance =
                          (asset.category === "CREDIT"
                            ? asset.remainingCredit
                            : asset.remainingBalance) ?? 0;
                        return (
                          <CommandItem
                            value={asset.name}
                            key={asset.id}
                            onSelect={() => onChange(asset)}
                            className="flex justify-between flex-row items-center"
                          >
                            <span>{asset.name}</span>
                            <div className="flex flex-row">
                              <span className="text-muted-foreground text-xs mr-2">
                                {formatCurrency(
                                  balance,
                                  asset.currency,
                                  "symbol",
                                )}
                                {/* ₱{asset.remainingBalance.toFixed(2)} */}
                              </span>
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  asset.id === value?.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
