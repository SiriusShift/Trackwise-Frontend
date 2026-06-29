import { IRootState } from "@/app/store";
import {
  useGetExpensesQuery,
  useGetGraphExpenseQuery,
} from "@/features/transactions/api/transaction/expensesApi";
import TransactionToolbar from "@/features/transactions/components/toolbar/TransactionToolbar";
import { navigationData } from "@/routing/navigationData";
import PageHeader from "@/shared/components/PageHeader";
import { DataTable } from "@/shared/components/Table/CommonTable";
import CommonTracker from "@/shared/components/Tracker/Tracker";
import { formatMode } from "@/shared/utils/CustomFunctions";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  useGetGraphIncomeQuery,
  useGetIncomeQuery,
} from "../api/transaction/incomeApi";
import { useGetTransferQuery } from "../api/transaction/transferApi";
import { transactionConfig } from "../config/transactionConfig";

import CommonPieGraph from "@/shared/components/charts/CommonPieGraph";
import CommonToolbar from "@/shared/components/CommonToolbar";
import ViewDetailed from "@/shared/components/dialog/ViewDialog/ViewTransaction";
import ScheduledWidget from "@/shared/components/ScheduledWidget/ScheduledWidget";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { setActionShow, setOpenDialog } from "@/shared/slices/activeSlice";
import { categoryType, filterProps } from "@/shared/types";
const TransactionPage = () => {
  const {
    type,
    active,
    action: showActionTab,
    activeRow,
    openDialog: viewOpen,
  } = useSelector((state: IRootState) => state.active);

  const [transaction, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState<Date | null>(
    moment(typeof active === "string" ? active : active?.from).toDate(),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    moment(typeof active === "string" ? active : active?.to).toDate(),
  );
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [filter, setFilter] = useState<filterProps>();

  const location = useLocation();
  const dispatch = useDispatch();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const mode = formatMode();
  const width = useScreenWidth();

  const selectedCategories = filter?.selectedCategories ?? [];
  const selectedAssets = filter?.selectedAssets ?? [];

  console.log(selectedAssets, selectedCategories);
  // Queries

  const { columns } =
    transactionConfig[type as keyof typeof transactionConfig] || {};
  // Expense
  const { data: expenseData, isFetching: expenseFetching } =
    useGetExpensesQuery({
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      pageSize,
      pageIndex,
      ...(filter?.status && { status: filter?.status }),
      ...(filter?.search && { search: filter?.search }), // Add `Search` only if truthy
      ...(selectedCategories.length && {
        Categories: JSON.stringify(
          selectedCategories.map((category) => category.id),
        ),
      }),
      ...(selectedAssets.length && {
        Assets: JSON.stringify(selectedAssets.map((asset) => asset.id)), // Add array of IDs
      }),
    });

  const { data: expenseGraphData, isFetching: expenseGraphFetching } =
    useGetGraphExpenseQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        mode,
      },
      {
        skip: type !== "Expense",
      },
    );

  const { data: incomeData, isFetching: incomeFetching } = useGetIncomeQuery(
    {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      pageSize,
      pageIndex,
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
      },
      {
        skip: type !== "Transfer",
      },
    );

  const handleFilter = useCallback(
    ({
      search,
      selectedCategories,
      selectedAssets,
      status,
    }: {
      search: string;
      selectedCategories: categoryType;
      selectedAssets: any;
      status: string;
    }) => {
      setFilter({
        search,
        selectedCategories,
        selectedAssets,
        status,
      });
    },
    [],
  );

  const clearFilter = useCallback(() => {
    setFilter({
      search: "",
      status: [],
      selectedCategories: [],
      selectedAssets: [],
    });
  }, []);

  const tableDataMap = {
    Expense: expenseData,
    Income: incomeData,
    Transfer: transferData,
  };

  const tableData = tableDataMap[type];

  const tableColumn = useMemo(() => columns, [columns]);
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
      <div className="flex p-5 flex-col gap-2">
        <PageHeader
          pageName={currentPageName?.name}
          description={`Overview of ${type.toLocaleLowerCase()} for this ${formatMode()}`}
          monthPicker={true}
        />
        {/* Toolbar */}
        <TransactionToolbar
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

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CommonTracker type="Expense" />{" "}
          <ScheduledWidget
            editDescription="Adjust and update your budget limit to match your needs."
            addDescription="Set a monthly spending limit for your budget category. You'll be notified when you're approaching your limit."
            title="Budget Limit"
            type="Expense"
          />
        </div>

        <ViewDetailed
          open={viewOpen}
          setOpen={(val) => dispatch(setOpenDialog(val))}
          transaction={activeRow}
        />
      </div>
    </>
  );
};

export default TransactionPage;
