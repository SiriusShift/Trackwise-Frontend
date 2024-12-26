import { navigationData } from "@/navigation/navigationData";
import { useLocation } from "react-router-dom";
import MonthPicker from "@/components/datePicker";
import { DataTable } from "@/components/common/CommonTable";
import {
  expenseColumns,
  recurringExpenseColumns,
} from "@/components/page-components/expense/expenseColumn";
import { useEffect, useMemo, useState } from "react";
import {
  useLazyGetExpensesQuery,
  useLazyGetRecurringExpensesQuery,
} from "@/feature/expenses/api/expensesApi";
import { useSelector } from "react-redux";
import useScreenWidth from "@/hooks/useScreenWidth";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ChevronDown, Filter } from "lucide-react";
import { FilterSheet } from "@/components/page-components/expense/FilterSheet";
import { useGetCategoryQuery } from "@/feature/category/api/categoryApi";
import { AddDialog } from "@/components/dialog/fundsDialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import moment from "moment";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const WalletPage = () => {
  const location = useLocation();
  const screenWidth = useScreenWidth();

  // State Management
  const [activeTab, setActiveTab] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("All");
  const [startDate, setStartDate] = useState<Date | null>(
    moment().startOf("month").toDate()
  );
  const [endDate, setEndDate] = useState<Date | null>(
    moment().endOf("month").toDate()
  );
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]); // Updated to store entire category object
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);

  console.log(startDate, endDate);

  // Get User ID
  const userId = useSelector((state: any) => state?.userDetails?.id);

  // Current Page Name
  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname
  );

  // Queries
  const [triggerExpense, { data: expensesData }] = useLazyGetExpensesQuery();

  console.log("data", expensesData);

  const [triggerRecurring, { data: recurringData }] =
    useLazyGetRecurringExpensesQuery();

  console.log("recurring", recurringData);

  const { data: categoryData } = useGetCategoryQuery({});

  const handleFilter = () => {
    const requestData = {
      userId,
      // active: activeTab,
      pageSize,
      pageIndex,
      startDate,
      endDate,
      ...(status && { Status: status }),
      ...(search && { Search: search }), // Add `Search` only if truthy
      ...(selectedCategories.length > 0 && {
        Categories: JSON.stringify(
          selectedCategories.map((category) => category.id)
        ), // Add array of IDs
      }),
    };

    if (activeTab === "Recurring") {
      triggerRecurring(requestData);
    } else {
      triggerExpense(requestData);
    }
  };

  const clearFilter = () => {
    setSearch("");
    setSelectedCategories([]);
    if (activeTab === "Recurring") {
      setStatus("");
      triggerRecurring({
        userId,
        startDate,
        endDate,
        pageSize,
        pageIndex,
      });
    } else {
      triggerExpense({
        userId,
        startDate,
        endDate,
        // active: activeTab,
        pageSize,
        pageIndex,
      });
    }
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

  //UseEffect
  useEffect(() => {
    if (activeTab === "Recurring") {
      triggerRecurring({
        userId,
        startDate,
        endDate,
        pageSize,
        pageIndex,
      });
    } else {
      triggerExpense({
        userId,
        startDate,
        endDate,
        // active: activeTab,
        pageSize,
        pageIndex,
      });
    }
  }, [pageSize, pageIndex, startDate, endDate, activeTab]);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <div className="flex justify-between">
          <p className="text-xl font-semibold">{currentPageName?.name}</p>
          <MonthPicker setStartDate={setStartDate} setEndDate={setEndDate} />
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
              <FilterSheet
                setClear={clearFilter}
                onSubmit={handleFilter}
                title="Filter"
                icon={<Filter width={17} />}
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
                  {activeTab === "Recurring" && (
                    <>
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
                            <label
                              htmlFor="Unpaid"
                              className="text-sm font-medium"
                            >
                              Unpaid
                            </label>
                          </div>
                          {/* Option 2 */}
                          <div className="flex items-center space-x-2 border px-4 h-10 rounded-md border-success">
                            <RadioGroupItem id="Paid" value="Paid" />
                            <label
                              htmlFor="Paid"
                              className="text-sm font-medium"
                            >
                              Paid
                            </label>
                          </div>
                          {/* Option 3 */}
                          <div className="flex items-center space-x-2 border px-4 h-10 rounded-md border-destructive">
                            <RadioGroupItem id="Overdue" value="Overdue" />
                            <label
                              htmlFor="Overdue"
                              className="text-sm font-medium"
                            >
                              Overdue
                            </label>
                          </div>
                        </RadioGroup>
                      </div>
                      <hr />
                    </>
                  )}
                </div>
              </FilterSheet>
            </div>
          </div>
        </div>

        <div></div>
        {activeTab === "All" ? (
          <DataTable
            columns={expenseColumns}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            totalPages={expensesData?.totalPages}
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalExpense={expensesData?.totalExpense}
            categoryExpenses={expensesData?.categoryExpenses}
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
            totalExpense={expensesData?.totalExpense}
            categoryExpenses={expensesData?.categoryExpenses}
            data={recurringData?.data || []}
          />
        )}
        {/* Data Table */}
      </div>

      {/* Expense Limits Section */}
      <div>
        <h1 className="text-xl font-semibold mb-3">
          Expenses limit for this month
        </h1>
        <div>
          <div className="w-1/2 2xl:w-full grid xl:grid-rows-2 xl:grid-cols-2 2xl:grid-rows-1 2xl:grid-cols-4 gap-5">
            <div className="h-24 2xl:h-36 bg-secondary flex items-center justify-center rounded-md">
              Content 1
            </div>
            <div className="h-24 2xl:h-36 bg-secondary flex items-center justify-center rounded-md">
              Content 2
            </div>
            <div className="h-24 2xl:h-36 bg-secondary flex items-center justify-center rounded-md">
              Content 3
            </div>
            <div className="h-24 2xl:h-36 bg-secondary flex items-center justify-center rounded-md">
              Content 4
            </div>
          </div>
          <div className="hidden 2xl:inline 2xl:w-[400px]"></div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
