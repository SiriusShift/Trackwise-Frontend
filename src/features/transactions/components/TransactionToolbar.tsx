import React, { useState } from "react";
import TypeSelect from "./TypeSelect";
import { Button } from "@/shared/components/ui/button";
import { ArrowDownToLine, ChevronDown, Filter, Plus } from "lucide-react";
import { FilterSheet } from "@/shared/components/FilterSheet";
import { Input } from "@/shared/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { DataTable } from "@/shared/components/table/CommonTable";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { TransactionDialog } from "./dialogs/TransactionDialog";

const TransactionToolbar = ({
  startDate,
  endDate,
  categoryData,
  transactionTrigger,
  activeType,
}: {
  startDate: Date | null;
  endDate: Date | null;
  categoryData: Object;
  transactionTrigger: () => void;
  activeType: string
}) => {
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("History");
    const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<any[]>([]); // Updated to store entire category object

  const handleFilter = () => {
    const requestData = {
      startDate,
      endDate,
      ...(status && { status: status }),
      ...(search && { search: search }), // Add `Search` only if truthy
      ...(selectedCategories.length > 0 && {
        Categories: JSON.stringify(
          selectedCategories.map((category) => category.id)
        ), // Add array of IDs
      }),
    };

    triggerChart({ mode: mode, ...requestData });
    transactionTrigger({ pageSize, pageIndex, ...requestData });
  };

  const clearFilter = () => {
    setSearch("");
    setSelectedCategories([]);
    transactionTrigger({
      // userId,
      startDate,
      endDate,
      pageSize,
      pageIndex,
    });
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

  return (
    <>
    <div className="flex flex-col gap-5">
      <div className="p-1 flex gap-2 overflow-x-auto items-center justify-between">
        <TypeSelect />
        <div className="flex gap-2">
          {/* <AlertDialogDemo /> */}

          <Button
            onClick={() => setDialogOpen(true)}
            size="sm"
            variant="outline"
          >
            <Plus className="lg:mr-2" />
            <span className="hidden md:inline">Add</span>
          </Button>
          <Button size="sm" variant="outline">
            <ArrowDownToLine className="lg:mr-2" />
            <span className="hidden md:inline">Export</span>
          </Button>
          <FilterSheet
            setClear={clearFilter}
            onSubmit={handleFilter}
            title="Filter"
            icon={<Filter width={17} />}
          >
            <div className="flex flex-col py-3 gap-5">
              <div className="flex flex-col gap-2">
                <h1 className="text-sm font-semibold">Search by description</h1>
                <Input
                  value={search}
                  placeholder="Search.."
                  className="w-full"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <hr />
              <div className="flex flex-col gap-2">
                <h1 className="text-sm font-semibold">Category</h1>
                {/* <a
                            href="#"
                            className="text-gray-400 hover:text-primary text-sm"
                            onClick={() => setSelectedCategories([])}
                          >
                            Reset
                          </a> */}
                {/* Collapsible Filter */}
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
                    <div className="flex flex-col gap-2 p-2 max-h-[200px] overflow-y-auto">
                      {categoryData?.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            id={category.name}
                            checked={selectedCategories.some(
                              (selected) => selected.id === category.id
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
              <hr />

              <div className="flex flex-col gap-2">
                <h1 className="text-sm font-semibold">Category</h1>
                <RadioGroup
                  value={status}
                  onValueChange={(value) => setStatus(value)} // Ensure value is updated
                  className="space-y-2"
                >
                  {/* Option 1 */}
                  <div className="flex items-center space-x-2 border px-4 h-10 rounded-md border-warning">
                    <RadioGroupItem id="Unpaid" value="Unpaid" />
                    <label htmlFor="Unpaid" className="text-sm font-medium">
                      Unpaid
                    </label>
                  </div>
                  {/* Option 2 */}
                  <div className="flex items-center space-x-2 border px-4 h-10 rounded-md border-success">
                    <RadioGroupItem id="Paid" value="Paid" />
                    <label htmlFor="Paid" className="text-sm font-medium">
                      Paid
                    </label>
                  </div>
                  {/* Option 3 */}
                  <div className="flex items-center space-x-2 border px-4 h-10 rounded-md border-destructive">
                    <RadioGroupItem id="Overdue" value="Overdue" />
                    <label htmlFor="Overdue" className="text-sm font-medium">
                      Overdue
                    </label>
                  </div>
                </RadioGroup>
              </div>
              <hr />
            </div>
          </FilterSheet>
        </div>
      </div>
{/* 
      {activeType === "Expense" && (
        <Tabs defaultValue="account" className="w-full ">
          <TabsList>
            <TabsTrigger value="account">Regular</TabsTrigger>
            <TabsTrigger value="recurring">Recurring</TabsTrigger>
            <TabsTrigger value="password">Installment</TabsTrigger>
          </TabsList>
        </Tabs>
      )} */}


      {/* Data Table */}
    </div>
     <TransactionDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        mode="add"
        type={activeType}
      />
      </>
  );
};

export default TransactionToolbar;
