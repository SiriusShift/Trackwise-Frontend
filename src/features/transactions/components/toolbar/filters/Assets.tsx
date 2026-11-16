import { Account } from "@/features/accounts/types/account.types";
import { AssetData } from "@/shared/types";
import FilterChip from "./FilterChip";

const Assets = ({
  selectedAssets,
  assets,
  onChange,
}: {
  selectedAssets: AssetData[];
  assets: Account[];
  onChange: (asset: AssetData) => void;
}) => {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 flex w-full items-baseline justify-between text-sm font-semibold">
        Account
        {selectedAssets.length > 0 && (
          <span className="text-xs font-normal text-muted-foreground">
            {selectedAssets.length} selected
          </span>
        )}
      </legend>

      {assets?.length ? (
        <div className="flex flex-wrap gap-2">
          {assets.map((asset: Account) => (
            <FilterChip
              key={asset.id}
              selected={selectedAssets.some(
                (selected) => selected.id === asset.id,
              )}
              onToggle={() => onChange(asset)}
            >
              {asset.name}
            </FilterChip>
          ))}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">No accounts yet</span>
      )}
    </fieldset>
  );
};

export default Assets;
