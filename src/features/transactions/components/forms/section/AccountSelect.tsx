import { Combobox } from "@/shared/components/Combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { formatCurrency } from "@/shared/utils/CustomFunctions";

const ALLOWED_CATEGORIES = ["CASH", "BANK", "CREDIT", "INVESTMENT"];

const getBalance = (asset: Asset) =>
  (asset.category === "CREDIT"
    ? asset.remainingCredit
    : asset.remainingBalance) ?? 0;

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
        return (
          <FormItem className="flex flex-col">
            <FormLabel>
              {label} <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Combobox
                modal
                contentFull
                disabled={disabled}
                className="w-full"
                items={filtered}
                value={value}
                onChange={onChange}
                getKey={(asset) => asset.id}
                getLabel={(asset) => asset.name}
                placeholder="Select account..."
                searchPlaceholder="Search account..."
                emptyText="No accounts found."
                renderValue={(asset) => {
                  // value may be an account outside the filtered list
                  const inList = filtered.some((a) => a.id === asset.id);
                  return (
                    <span className="flex gap-2 min-w-0">
                      <span className="truncate">
                        {asset.name ??
                          assets.find((a) => a.id === asset.id)?.name}
                      </span>
                      {inList && (
                        <span className="text-muted-foreground shrink-0">
                          {formatCurrency(
                            getBalance(asset),
                            asset.currency,
                            "symbol",
                          )}
                        </span>
                      )}
                    </span>
                  );
                }}
                renderItem={(asset) => (
                  <span className="flex flex-1 justify-between items-center gap-2 min-w-0">
                    <span className="truncate">{asset.name}</span>
                    <span className="text-muted-foreground text-xs shrink-0">
                      {formatCurrency(
                        getBalance(asset),
                        asset.currency,
                        "symbol",
                      )}
                    </span>
                  </span>
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
