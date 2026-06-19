import { IRootState } from "@/app/store";
import { useGetAssetQuery } from "@/shared/api/assetsApi";
import { useGetCategoryQuery } from "@/shared/api/categoryApi";
import { FilterSheet } from "@/shared/components/FilterSheet";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { AssetData, Category, categoryType } from "@/shared/types";
import { ChevronDown, Download, Filter, Plus } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { TransactionDialog } from "../dialogs/TransactionDialog";
import Assets from "./filters/Assets";
import Status from "./filters/Status";
import TypeSelect from "./TypeSelect";
const TransactionToolbar = ({
  onSubmit,
  onClear,
}: {
  onSubmit: ({
    search,
    status,
    selectedCategories,
    selectedAssets,
  }: {
    search: string;
    status: string;
    selectedCategories: categoryType[];
    selectedAssets: any[];
  }) => void;
  onClear: () => void;

  // search: String;
  // status: String;
  // recurring: Boolean;
  // setRecurring: (recurring: Boolean) => void;
  // setStatus: (search: String) => void;
  // setSearch: (search: String) => void;
  // selectedCategories: Array<any>;
  // setSelectedCategories: (selectedCategories: any) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");

  const type = useSelector((state: IRootState) => state.active.type);

  const { data: assets } = useGetAssetQuery();
  const { data: categoryData } = useGetCategoryQuery({
    type,
  });

  const clearFilter = () => {
    setSearch("");
    setSelectedCategories([]);
    setStatus("");
    onClear();
  };

  const handleCheckboxChange = (category: any) => {
    setSelectedCategories((prevSelected) => {
      // If category already exists in selected, remove it (uncheck)
      if (prevSelected.some((selected) => selected.id === category.id)) {
        return prevSelected.filter((selected) => selected.id !== category.id);
      }
      // Otherwise, add it to selected categories (check)
      return [...prevSelected, category];
    });
  };

  const handleAssetChange = (asset: AssetData) => {
    setSelectedAssets((prevSelected) => {
      if (prevSelected.some((selected) => selected.id === asset.id)) {
        return prevSelected.filter((selected) => selected.id !== asset.id);
      }

      return [...prevSelected, asset];
    });
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="p-1 flex gap-2 overflow-x-auto items-center justify-between">
          <div className="flex gap-2">
            <TypeSelect />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setDialogOpen(true)}
              size="sm"
              variant="outline"
            >
              <Plus className="lg:mr-2" />
              <span className="hidden md:inline">Add</span>
            </Button>
            <Button size="sm" variant="outline">
              <Download className="lg:mr-2" />
              <span className="hidden md:inline">Export</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setFilterOpen(true)}
            >
              <Filter />
              <span className="hidden md:inline">Filter</span>
            </Button>
            <FilterSheet
              setClear={clearFilter}
              setOpen={setFilterOpen}
              onSubmit={() =>
                onSubmit({
                  search: search,
                  status: status,
                  selectedCategories: selectedCategories,
                  selectedAssets: selectedAssets,
                })
              }
              title="Filter"
              icon={"Filter"}
              open={filterOpen}
            >
              <div className="flex flex-col py-3 gap-5">
                <div className="flex flex-col gap-2">
                  <h1 className="text-sm font-semibold">
                    Search by description
                  </h1>
                  <Input
                    value={search}
                    placeholder="Search.."
                    className="w-full"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Separator />

                <div className="flex flex-col gap-2">
                  <h1 className="text-sm font-semibold">Category</h1>
                  <Collapsible>
                    {/* Trigger */}
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full relative flex justify-between overflow-hidden items-center"
                      >
                        <div className="overflow-x-hidden flex w-4/5">
                          <span>
                            {/* Display selected categories or default text */}
                            {selectedCategories.length > 0
                              ? `${selectedCategories
                                  .map((category) => category.name)
                                  .join(", ")}`
                              : "Filter by Category"}
                          </span>
                        </div>
                        <ChevronDown className="absolute right-5 h-5 w-5" />
                      </Button>
                    </CollapsibleTrigger>

                    {/* Content */}
                    <CollapsibleContent>
                      <div className="flex flex-col gap-2 mt-1 p-2 max-h-[200px] overflow-y-auto">
                        {categoryData?.map((category: Category) => (
                          <div
                            key={category.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={category.name}
                              checked={selectedCategories.some(
                                (selected) => selected.id === category.id,
                              )}
                              onCheckedChange={() =>
                                handleCheckboxChange(category)
                              }
                            />
                            <label
                              htmlFor={category.name}
                              className="text-sm font-medium capitalize cursor-pointer"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                <Separator />

                <Assets
                  selectedAssets={selectedAssets}
                  assets={assets}
                  onChange={handleAssetChange}
                />

                <Status status={status} setStatus={setStatus} />
                <Separator />
              </div>
            </FilterSheet>
          </div>
        </div>
      </div>
      <TransactionDialog open={dialogOpen} setOpen={setDialogOpen} mode="add" />
    </>
  );
};

export default TransactionToolbar;
