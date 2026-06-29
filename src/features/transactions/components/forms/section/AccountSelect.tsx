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
import { Check, ChevronsUpDown } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  remainingBalance: number;
}

interface AccountSelectProps {
  name: string;
  label: string;
  assets: Asset[];
  control: any;
  disabled?: boolean;
  excludeId?: string; // filters out one asset (e.g. the "from" account in a transfer)
}

export const AccountSelect = ({
  name,
  label,
  assets,
  control,
  disabled,
  excludeId,
}: AccountSelectProps) => {
  const filtered = excludeId
    ? assets.filter((a) => a.id !== excludeId)
    : assets;

  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
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
                        {filtered.find((a) => a.id === value?.id)?.name ??
                          assets.find((a) => a.id === value?.id)?.name}
                      </span>
                      <span className="text-muted-foreground shrink-0">
                        ₱
                        {(
                          filtered.find((a) => a.id === value?.id) ??
                          assets.find((a) => a.id === value?.id)
                        )?.remainingBalance.toFixed(2)}
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
                    {filtered.map((asset) => (
                      <CommandItem
                        value={asset}
                        key={asset.id}
                        onSelect={() => onChange(asset)}
                        className="flex justify-between flex-row items-center"
                      >
                        <span>{asset.name}</span>
                        <div className="flex flex-row">
                          <span className="text-muted-foreground text-xs mr-2">
                            ₱{asset.remainingBalance.toFixed(2)}
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
  );
};
