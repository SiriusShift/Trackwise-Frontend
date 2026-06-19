import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { AssetData, AssetTemplate } from "@/shared/types";
import { ChevronDown } from "lucide-react";

const Assets = ({
  selectedAssets,
  assets,
  onChange,
}: {
  selectedAssets: AssetData[];
  assets: AssetTemplate;
  onChange: (asset: AssetData) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-sm font-semibold">Asset</h1>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full relative flex justify-between overflow-hidden items-center"
          >
            <div className="overflow-x-hidden flex w-4/5">
              <span>
                {selectedAssets.length > 0
                  ? selectedAssets.map((asset) => asset.name).join(", ")
                  : "Filter by Asset"}
              </span>
            </div>

            <ChevronDown className="absolute right-5 h-5 w-5" />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="flex flex-col gap-2 mt-1 p-2 max-h-[200px] overflow-y-auto">
            {assets?.data?.map((asset: AssetData) => (
              <div key={asset.id} className="flex items-center gap-2">
                <Checkbox
                  id={`asset-${asset.id}`}
                  checked={selectedAssets.some(
                    (selected) => selected.id === asset.id,
                  )}
                  onCheckedChange={() => onChange(asset)}
                />

                <label
                  htmlFor={`asset-${asset.id}`}
                  className="text-sm font-medium capitalize cursor-pointer"
                >
                  {asset.name}
                </label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Assets;
