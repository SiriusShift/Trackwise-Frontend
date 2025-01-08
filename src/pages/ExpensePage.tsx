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
import { useDispatch, useSelector } from "react-redux";
import useScreenWidth from "@/hooks/useScreenWidth";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Plus } from "lucide-react";
import { FilterSheet } from "@/components/page-components/expense/FilterSheet";
import { useGetCategoryQuery } from "@/feature/category/api/categoryApi";
import { AddDialog } from "@/components/dialog/ExpenseDialog";
import moment from "moment";
import { setExpenseTab } from "@/feature/reducers/activeTab";

const WalletPage = () => {
  const location = useLocation();
  const screenWidth = useScreenWidth();
  const dispatch = useDispatch();
  const activeTab = useSelector((state: any) => state.activeTab.expenseTab);
  console.log(activeTab);

  let activeMonth = localStorage.getItem("activeMonth");
  activeMonth = activeMonth ? JSON.parse(activeMonth) : new Date();
  console.log(moment(activeMonth));

  // State Management
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("All");
  const [startDate, setStartDate] = useState<Date | null>(
    moment(activeMonth).startOf("month").toDate()
  );
  const [endDate, setEndDate] = useState<Date | null>(
    moment(activeMonth).endOf("month").toDate()
  );
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]); // Updated to store entire category object
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);

  console.log(moment(startDate).format("MMMM YYYY"), endDate);

  // Get User ID
  const userId = useSelector((state: any) => state?.userDetails?.id);

  // Current Page Name
  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname
  );

  // Queries
  const [triggerExpense, { data: expensesData, isLoading: expensesLoading }] =
    useLazyGetExpensesQuery();

  console.log("data", expensesData);

  const [
    triggerRecurring,
    { data: recurringData, isLoading: recurringLoading },
  ] = useLazyGetRecurringExpensesQuery();

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
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 items-center justify-between">
          <div className="relative h-9 w-48 bg-secondary p-1 rounded-sm">
            <div className="relative flex gap-1 h-full bg-secondary rounded-sm items-center overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full w-1/2 bg-background rounded-sm transition-all duration-300`}
                style={{
                  transform:
                    activeTab === "All" ? "translateX(0)" : "translateX(100%)",
                }}
              ></div>
              <div
                onClick={() =>
                  dispatch(
                    setExpenseTab({
                      expenseTab: "All",
                    })
                  )
                }
                className={`relative z-10 flex items-center justify-center text-sm w-1/2 cursor-pointer ${
                  activeTab === "All" ? "text-primary" : "text-gray-500"
                }`}
              >
                All
              </div>
              <div
                onClick={() =>
                  dispatch(
                    setExpenseTab({
                      expenseTab: "Recurring",
                    })
                  )
                }
                className={`relative z-10 flex items-center justify-center text-sm w-1/2 cursor-pointer ${
                  activeTab === "Recurring" ? "text-primary" : "text-gray-500"
                }`}
              >
                Recurring
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <AddDialog mode="add" type="Expense" active={activeTab} />
            <Button size="sm" variant="outline">
              <ArrowDownToLine className="lg:mr-2" />
              <span>Export</span>
            </Button>
            <FilterSheet setClear={clearFilter} onSubmit={handleFilter} />
          </div>
        </div>

        {activeTab === "All" ? (
          <DataTable
            columns={expenseColumns}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            totalPages={expensesData?.totalPages}
            pageIndex={pageIndex}
            date={endDate}
            pageSize={pageSize}
            total={expensesData?.totalExpense}
            trend={expensesData?.trend}
            isLoading={expensesLoading || recurringLoading}
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
            date={endDate}
            pageIndex={pageIndex}
            pageSize={pageSize}
            total={expensesData?.totalExpense}
            trend={expensesData?.trend}
            isLoading={expensesLoading || recurringLoading}
            categoryExpenses={expensesData?.categoryExpenses}
            data={recurringData?.data || []}
          />
        )}
        {/* Data Table */}
      </div>

      {/* Expense Limits Section */}
      <div>
        <h1 className="text-xl font-semibold mb-5">
          Expenses limit for this month
        </h1>
        <div className="flex w-full h-[120px] overflow-x-auto gap-5">
          <div className="h-24 min-w-64 xl:w-1/4  border-secondary border flex items-center p-5 rounded-md">
            <button className="rounded-full border-primary border p-1">
              <Plus size={30} />
            </button>{" "}
            <span className="ml-5">Set New Limit</span>
          </div>
          <div className="h-24 min-w-64 xl:w-1/4  border-secondary border flex items-center p-5 rounded-md">
            <button className="rounded-full border-primary border p-1">
              <Plus size={30} />
            </button>{" "}
            <span className="ml-5">Set New Limit</span>
          </div>
          <div className="h-24 min-w-64 xl:w-1/4  border-secondary border flex items-center p-5 rounded-md">
            <button className="rounded-full border-primary border p-1">
              <Plus size={30} />
            </button>{" "}
            <span className="ml-5">Set New Limit</span>
          </div>
          <div className="h-24 min-w-64 xl:w-1/4  border-secondary border flex items-center p-5 rounded-md">
            <button className="rounded-full border-primary border p-1">
              <Plus size={30} />
            </button>{" "}
            <span className="ml-5">Set New Limit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
