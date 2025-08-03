import { navigationData } from "@/routing/navigationData";
import { useLocation } from "react-router-dom";
import MonthPicker from "@/shared/components/datePicker";
import { DataTable } from "@/shared/components/table/CommonTable";
import {
  expenseColumns,
  recurringExpenseColumns,
} from "@/features/transactions/components/table-columns/expenseColumn";
import { useEffect, useMemo, useState } from "react";
import {
  useGetDetailedExpenseQuery,
  useLazyGetDetailedExpenseQuery,
  useLazyGetExpensesQuery,
  useLazyGetRecurringExpensesQuery,
} from "@/features/transactions/api/expensesApi";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/shared/components/ui/button";
import { ArrowDownToLine, ChevronDown, Filter, Plus } from "lucide-react";
import { FilterSheet } from "@/shared/components/FilterSheet";
import {
  useDeleteCategoryLimitMutation,
  useGetCategoryLimitQuery,
  useGetCategoryQuery,
  usePatchCategoryLimitMutation,
  usePostCategoryLimitMutation,
} from "@/shared/api/categoryApi";
import { TransactionDialog } from "@/features/transactions/components/dialogs/TransactionDialog";
import moment from "moment";
import { Input } from "@/shared/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import CommonTracker from "@/shared/components/tracker/Tracker";
import { toast } from "sonner";
import TypeSelect from "@/features/transactions/components/TypeSelect";
import { formatMode } from "@/shared/utils/CustomFunctions";

const TransactionPage = () => {
  const location = useLocation();
  const active = useSelector((state: any) => state.active.active);
  const mode = useSelector((state: any) => state.active.mode);
  const activeType = useSelector((state: any) => state.active.type);
  console.log(activeType);

  // State Management
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("History");
  const [startDate, setStartDate] = useState<Date | null>(
    moment(typeof active === "string" ? active : active?.from).toDate()
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const [endDate, setEndDate] = useState<Date | null>(
    moment(typeof active !== "string" && active?.to).toDate()
  );
  console.log(startDate, endDate);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]); // Updated to store entire category object
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);

  console.log(moment(startDate).format("MMMM YYYY"), endDate);

  // Get User ID
  // const userId = useSelector((state: any) => state?.userDetails?.id);

  // Current Page Name
  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname
  );

  // Queries
  const [triggerExpense, { data: expensesData, isLoading: expensesLoading }] =
    useLazyGetExpensesQuery();

  const [triggerChart, { data: detailedExpense }] =
    useLazyGetDetailedExpenseQuery();

  console.log(detailedExpense);

  // const [
  //   triggerRecurring,
  //   { data: recurringData, isLoading: recurringLoading },
  // ] = useLazyGetRecurringExpensesQuery();

  const { data: categoryData } = useGetCategoryQuery({});

  const { data: categoryLimit, isLoading: categoryLimitLoading } =
    useGetCategoryLimitQuery({
      startDate: startDate,
      endDate: endDate,
    });

  const [triggerUpdate] = usePatchCategoryLimitMutation();
  const [triggerPost] = usePostCategoryLimitMutation();
  const [deleteLimit] = useDeleteCategoryLimitMutation();

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      if (data?.id) {
        await triggerUpdate({
          id: data?.id,
          amount: {
            amount: data?.amount,
          },
        });
      } else {
        await triggerPost({
          categoryId: data?.category?.id,
          amount: data?.amount,
        });
      }
    } catch (err) {
      toast.error("error");
    }
  };

  const onDelete = async (data: any) => {
    await deleteLimit(data.id);
    toast.success("Expense limit deleted successfully");
  };

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

    triggerChart({ mode: formatMode(), ...requestData });
    triggerExpense({ pageSize, pageIndex, ...requestData });
  };

  const clearFilter = () => {
    setSearch("");
    setSelectedCategories([]);
    triggerExpense({
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

  //UseEffect
  useEffect(() => {
    if (typeof startDate === "string") {
    }
    triggerExpense({
      startDate,
      endDate,
      pageSize,
      pageIndex,
    });
  }, [pageSize, pageIndex, startDate, endDate, activeType]);

  useEffect(() => {
    if (active === null) return;
    setStartDate(
      moment(typeof active === "string" ? active : active?.from).toDate()
    );
    setEndDate(
      moment(typeof active === "string" ? active : active?.to).toDate()
    );
  }, [active]);

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold">{currentPageName?.name}</p>
              <p className="text-gray-400 text-sm">
                Overview of {activeType} for this {formatMode()}
              </p>
            </div>
            <MonthPicker />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-5">
          <div
            className={`flex gap-2 overflow-x-auto items-center justify-between`}
          >
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
                </div>
              </FilterSheet>
            </div>
          </div>

          <DataTable
            columns={expenseColumns}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            totalPages={expensesData?.totalPages}
            pageIndex={pageIndex}
            date={endDate}
            pageSize={pageSize}
            trend={expensesData?.trend}
            isLoading={expensesLoading}
            type={activeType}
            categoryExpenses={detailedExpense}
            data={expensesData?.data || []}
          />
          {/* Data Table */}
        </div>

        <CommonTracker
          data={categoryLimit}
          isLoading={categoryLimitLoading}
          editDescription="Adjust and update your budget limit to match your needs."
          addDescription="Set a monthly spending limit for your budget category. You'll be notified when you're approaching your limit."
          title="Budget Limit"
          type="Expense"
          onSubmit={onSubmit}
          onDelete={onDelete}
        />
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

export default TransactionPage;
