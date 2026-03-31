import { navigationData } from "@/routing/navigationData";
import { useLocation } from "react-router-dom";
import { DataTable } from "@/shared/components/Table/CommonTable";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useGetExpensesQuery,
  useGetGraphExpenseQuery,
  useGetRecurringExpensesQuery,
  useLazyGetExpensesQuery,
} from "@/features/transactions/api/transaction/expensesApi";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetCategoryLimitQuery,
  useGetCategoryQuery,
} from "@/shared/api/categoryApi";
import moment from "moment";
import CommonTracker from "@/shared/components/Tracker/Tracker";
import { formatMode } from "@/shared/utils/CustomFunctions";
import PageHeader from "@/shared/components/PageHeader";
import TransactionToolbar from "@/features/transactions/components/TransactionToolbar";
import { transactionConfig } from "../config/transactionConfig";
import { IRootState } from "@/app/store";
import {
  useGetGraphIncomeQuery,
  useGetIncomeQuery,
  useGetRecurringIncomeQuery,
} from "../api/transaction/incomeApi";
import {
  useGetGraphTransferQuery,
  useGetRecurringTransferQuery,
  useGetTransferQuery,
} from "../api/transaction/transferApi";
import useDebounce from "@/shared/hooks/useDebounce";
import { useConfirm } from "@/shared/provider/ConfirmProvider";

import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { setActionShow, setOpenDialog } from "@/shared/slices/activeSlice";
import ViewDetailed from "@/shared/components/dialog/ViewDialog/ViewTransaction";
import CommonPieGraph from "@/shared/components/charts/CommonPieGraph";
import CommonToolbar from "@/shared/components/CommonToolbar";
import { categoryType } from "@/shared/types";
const TransactionPage = () => {
  const type = useSelector((state: IRootState) => state.active.type);
  const active = useSelector((state: IRootState) => state.active.active);
  const showActionTab = useSelector((state: IRootState) => state.active.action);
  const activeRow = useSelector((state: IRootState) => state.active.activeRow);
  const viewOpen = useSelector((state: IRootState) => state.active.openDialog);

  const [transaction, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState<Date | null>(
    moment(typeof active === "string" ? active : active?.from).toDate(),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    moment(typeof active !== "string" && active?.to).toDate(),
  );
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [filter, setFilter] = useState();

  const location = useLocation();
  const dispatch = useDispatch();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const { confirm } = useConfirm();
  const mode = formatMode();
  const width = useScreenWidth();

  // Queries
  const { data: categoryData } = useGetCategoryQuery({
    type,
  });

  const { data: categoryLimit, isFetching: categoryLimitLoading } =
    useGetCategoryLimitQuery({
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });

  const { columns } = transactionConfig[type] || {};
  // Expense
  const { data: expenseData, isFetching: expenseFetching } =
    useGetExpensesQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        pageSize,
        pageIndex,
        ...(filter?.status && { status: filter?.status }),
        ...(filter?.search?.length > 0 && { search: filter?.search }), // Add `Search` only if truthy
        ...(filter?.selectedCategories.length > 0 && {
          Categories: JSON.stringify(
            filter?.selectedCategories.map((category) => category.id),
          ), // Add array of IDs
        }),
      },
      // {
      //   skip: type !== "Expense" && recurring === true,
      // },
    );

  const { data: expenseGraphData, isFetching: expenseGraphFetching } =
    useGetGraphExpenseQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        mode,
        // ...(status && { status: status }),
        // ...(search && { search: debouncedSeach }), // Add `Search` only if truthy
        // ...(selectedCategories.length > 0 && {
        //   Categories: JSON.stringify(
        //     selectedCategories.map((category) => category.id),
        //   ), // Add array of IDs
        // }),
      },
      {
        skip: type !== "Expense",
      },
    );

  // Income
  const { data: incomeData, isFetching: incomeFetching } = useGetIncomeQuery(
    {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      pageSize,
      pageIndex,
      // ...(status && { status: status }),
      // ...(search && { search: debouncedSeach }), // Add `Search` only if truthy
      // ...(selectedCategories.length > 0 && {
      //   Categories: JSON.stringify(
      //     selectedCategories.map((category) => category.id),
      //   ), // Add array of IDs
      // }),
    },
    {
      skip: type !== "Income",
    },
  );

  const { data: incomeGraphData, isFetching: incomeGraphFetching } =
    useGetGraphIncomeQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        mode,
        // ...(status && { status: status }),
        // ...(search && { search: debouncedSeach }), // Add `Search` only if truthy
        // ...(selectedCategories.length > 0 && {
        //   Categories: JSON.stringify(
        //     selectedCategories.map((category) => category.id),
        //   ), // Add array of IDs
        // }),
      },
      {
        skip: type !== "Income",
      },
    );

  //Transfer
  const { data: transferData, isFetching: transferFetching } =
    useGetTransferQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        pageSize,
        pageIndex,
        // ...(status && { status: status }),
        // ...(search && { search: debouncedSeach }), // Add `Search` only if truthy
        // ...(selectedCategories.length > 0 && {
        //   Categories: JSON.stringify(
        //     selectedCategories.map((category) => category.id),
        //   ), // Add array of IDs
        // }),
      },
      {
        skip: type !== "Transfer",
      },
    );

  const handleFilter = ({
    search,
    selectedCategories,
    status,
  }: {
    search: string;
    selectedCategories: categoryType;
    status: string;
  }) => {
    setFilter({
      search,
      selectedCategories,
      status,
    });
  };

  const clearFilter = () => {
    setFilter({
      search: "",
      status: [],
      selectedCategories: [],
    });
  };

  const tableData =
    type === "Expense"
      ? expenseData
      : type === "Income"
        ? incomeData
        : transferData;

  const tableColumn = columns;

  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname,
  );
  const totalPages = tableData?.totalPages;

  const tableFetching = expenseFetching || incomeFetching || transferFetching;

  console.log(tableFetching);
  const graphData =
    type === "Expense"
      ? expenseGraphData
      : type === "Income"
        ? incomeGraphData
        : null;

  console.log(graphData, "graph data");

  const graphFetching = expenseGraphFetching || incomeGraphFetching;

  useEffect(() => {
    if (active === null) return;
    setStartDate(
      moment(typeof active === "string" ? active : active?.from).toDate(),
    );
    setEndDate(
      moment(typeof active === "string" ? active : active?.to).toDate(),
    );
  }, [active]);

  useEffect(() => {
    setTransactions([]);
  }, [type]);

  useEffect(() => {
    console.log("add");
    if (tableData?.data?.length) {
      setTransactions((prev) => [...prev, ...tableData?.data]);
    }
  }, [JSON.stringify(tableData), tableFetching]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showActionTab &&
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node)
      ) {
        dispatch(setActionShow(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionTab, dispatch]);

  return (
    <>
      <CommonToolbar />
      <div className="flex p-5 flex-col gap-5">
        {/* Header */}

        <PageHeader
          pageName={currentPageName?.name}
          description={`Overview of ${type.toLocaleLowerCase()} for this ${formatMode()}`}
                  monthPicker={true}

        />
        {/* Toolbar */}
        <TransactionToolbar
          categoryData={categoryData}
          onSubmit={handleFilter}
          onClear={clearFilter}
          // search={search}
          // status={status}
          // selectedCategories={selectedCategories}
          // setSearch={setSearch}
          // setStatus={setStatus}
          // setSelectedCategories={setSelectedCategories}
        />
        <div className="flex w-full flex-col gap-5 lg:flex-row">
          {/* Table */}
          <div className="w-full overflow-hidden">
            <DataTable
              columns={tableColumn}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              totalPages={totalPages}
              pageIndex={pageIndex}
              pageSize={pageSize}
              isLoading={tableFetching}
              graphData={graphData}
              data={width > 639 ? tableData?.data : transaction || []}
            />
          </div>

          {/* Chart */}
          {type !== "Transfer" && (
            <div>
              <CommonPieGraph
                total={graphData?.total}
                trend={graphData?.trend}
                type={type}
                graphLoading={graphFetching}
                data={graphData?.data}
              />
            </div>
          )}
        </div>

        <ViewDetailed
          open={viewOpen}
          setOpen={(val) => dispatch(setOpenDialog(val))}
          transaction={activeRow}
        />

        {/* <DataTable
          columns={tableColumn}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          totalPages={totalPages}
          graphLoading={graphFetching}
          pageIndex={pageIndex}
          pageSize={pageSize}
          // trend={tableData?.trend}
          isLoading={tableFetching}
          type={type}
          graphData={graphData}
          data={recurring ? recurringTableData?.data : tableData?.data || []}
        /> */}
        <CommonTracker
          data={categoryLimit}
          isLoading={categoryLimitLoading}
          editDescription="Adjust and update your budget limit to match your needs."
          addDescription="Set a monthly spending limit for your budget category. You'll be notified when you're approaching your limit."
          title="Budget Limit"
          type="Expense"
        />
      </div>
    </>
  );
};

export default TransactionPage;
