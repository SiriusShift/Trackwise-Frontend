import { navigationData } from "@/navigation/navigationData";
import { useLocation } from "react-router-dom";
import MonthPicker from "@/components/datePicker";
import { DataTable } from "@/components/common/CommonTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Expense } from "@/types";
import {
  expenseColumns,
  recurringExpenseColumns,
} from "@/components/page-components/funds/expenseColumn";
import { useState } from "react";
import Toolbar from "@/components/toolbar/CommonToolbar";
import {
  useGetExpensesQuery,
  useGetRecurringExpensesQuery,
} from "@/feature/expenses/api/expensesApi";
import { useSelector } from "react-redux";
import useScreenWidth from "@/hooks/useScreenWidth";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ChevronDown, Filter } from "lucide-react";
import { FilterSheet } from "@/components/page-components/funds/FilterSheet";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategoryQuery } from "@/feature/category/api/categoryApi";
import { AddDialog } from "@/components/dialog/fundsDialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const WalletPage = () => {
  const location = useLocation();
  const screenWidth = useScreenWidth();

  // State Management
  const [activeTab, setActiveTab] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]); // Updated to store entire category object
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);

  console.log(selectedCategories);

  // Get User ID
  const userId = useSelector((state: any) => state?.userDetails?.id);

  // Current Page Name
  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname
  );

  // Queries
  const { data: expensesData } = useGetExpensesQuery({
    userId,
    active: activeTab,
    Search: search,
    pageSize,
    pageIndex,
  });

  const { data: recurringData } = useGetRecurringExpensesQuery({
    userId,
    pageSize,
    pageIndex,
  });

  const { data: categoryData } = useGetCategoryQuery({});

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
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <div className="flex justify-between">
          <p className="text-xl font-semibold">{currentPageName?.name}</p>
          <MonthPicker />
        </div>
        <p className="text-gray-400">
          This is your overview of expenses for this month
        </p>
      </div>

      {/* Toolbar */}
      <div>
        <div className="flex sm:flex-col gap-2">
          <div className="flex w-full gap-2 overflow-x-auto items-center justify-between whitespace-nowrap">
            {/* Tabs */}
            {screenWidth > 640 && (
              <div className="relative h-9 w-48 bg-secondary p-1 rounded-sm">
                <div className="relative flex gap-1 h-full bg-secondary rounded-sm items-center overflow-hidden">
                  {/* Animated Tab Indicator */}
                  <div
                    className={`absolute top-0 left-0 h-full w-1/2 bg-background rounded-sm transition-all duration-300`}
                    style={{
                      transform:
                        activeTab === "All"
                          ? "translateX(0)"
                          : "translateX(100%)",
                    }}
                  ></div>

                  {/* All Tab */}
                  <div
                    onClick={() => setActiveTab("All")}
                    className={`relative z-10 flex items-center justify-center text-sm w-1/2 cursor-pointer ${
                      activeTab === "All" ? "text-primary" : "text-gray-500"
                    }`}
                  >
                    All
                  </div>

                  {/* Recurring Tab */}
                  <div
                    onClick={() => setActiveTab("Recurring")}
                    className={`relative z-10 flex items-center justify-center text-sm w-1/2 cursor-pointer ${
                      activeTab === "Recurring"
                        ? "text-primary"
                        : "text-gray-500"
                    }`}
                  >
                    Recurring
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <AddDialog type="Expense" active={activeTab} />
              <Button size="sm" variant="outline">
                <ArrowDownToLine className="lg:mr-2" />
                <span className="hidden lg:inline">Export</span>
              </Button>
              <FilterSheet title="Filter" icon={<Filter width={17}/>}>
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
                  <hr />
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <h1 className="text-sm font-semibold">Category</h1>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-primary text-sm"
                        onClick={() => setSelectedCategories([])}
                      >
                        Reset
                      </a>
                    </div>
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
                </div>
              </FilterSheet>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {activeTab === "All" ? (
          <DataTable
            columns={expenseColumns}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            totalCount={expensesData?.totalCount}
            totalPages={expensesData?.totalPages}
            pageIndex={pageIndex}
            pageSize={pageSize}
            data={expensesData?.data || []}
          />
        ) : (
          <DataTable
            columns={recurringExpenseColumns}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            totalCount={recurringData?.totalCount}
            totalPages={recurringData?.totalPages}
            pageIndex={pageIndex}
            pageSize={pageSize}
            data={recurringData?.data || []}
          />
        )}
      </div>

      {/* Expense Limits Section */}
      <div>
        <h1 className="text-xl font-semibold mb-3">
          Expenses limit for this month
        </h1>
        <div className="w-full grid grid-cols-4 gap-2">
          <div className="h-28 bg-gray-100 flex items-center justify-center rounded-md">
            Content 1
          </div>
          <div className="h-28 bg-gray-100 flex items-center justify-center rounded-md">
            Content 2
          </div>
          <div className="h-28 bg-gray-100 flex items-center justify-center rounded-md">
            Content 3
          </div>
          <div className="h-28 bg-gray-100 flex items-center justify-center rounded-md">
            Content 4
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
