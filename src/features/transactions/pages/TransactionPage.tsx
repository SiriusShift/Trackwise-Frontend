import { IRootState } from "@/app/store";
import {
  useGetExpensesQuery,
  useGetGraphExpenseQuery,
} from "@/features/transactions/api/transaction/expensesApi";
import TransactionToolbar from "@/features/transactions/components/toolbar/TransactionToolbar";
import { navigationData } from "@/routing/navigationData";
import PageHeader from "@/shared/components/PageHeader";
import { DataTable } from "@/shared/components/Table/CommonTable";
import CommonTracker from "@/shared/components/Tracker/TrackerWidget";
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
import {
  filterProps,
  TransactionDetails,
  TransactionRow,
} from "@/shared/types";
import usePageTour from "@/shared/tour/usePageTour";

const TransactionPage = () => {
  const { Tour } = usePageTour("transactions");

  const {
    type,
    active,
    action: showActionTab,
    activeRow,
    openDialog: viewOpen,
  } = useSelector((state: IRootState) => state.active);

  const [transaction, setTransactions] = useState<TransactionRow[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(
    moment(typeof active === "string" ? active : active?.from).toDate(),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    moment(typeof active === "string" ? active : active?.to).toDate(),
  );
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [filter, setFilter] = useState<filterProps>();

  console.log(filter);
  const location = useLocation();
  const dispatch = useDispatch();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const mode = formatMode();
  const width = useScreenWidth();

  const selectedCategories = filter?.selectedCategories ?? [];
  const selectedAssets = filter?.selectedAssets ?? [];
  // Archived transactions have no meaningful breakdown, so the graph is hidden
  const showGraph = type !== "Transfer" && filter?.active !== false;

  // Queries

  const { columns } =
    transactionConfig[type as keyof typeof transactionConfig] || {};
  // Expense
  const {
    data: expenseData,
    isFetching: expenseFetching,
    refetch,
  } = useGetExpensesQuery(
    {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      pageSize,
      pageIndex,
      isActive: filter?.active,
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
    },
    {
      skip: type !== "Expense",
    },
  );

  const { data: expenseGraphData, isFetching: expenseGraphFetching } =
    useGetGraphExpenseQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        mode,
        isActive: filter?.active,
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
      },
      {
        skip: type !== "Expense" || !showGraph,
      },
    );

  const { data: incomeData, isFetching: incomeFetching } = useGetIncomeQuery(
    {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      pageSize,
      pageIndex,
      isActive: filter?.active,
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
        isActive: filter?.active,
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
      },
      {
        skip: type !== "Income" || !showGraph,
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
        isActive: filter?.active,
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
      active,
    }: Required<filterProps>) => {
      console.log(status);
      setFilter({
        search,
        selectedCategories,
        selectedAssets,
        status,
        active,
      });
    },
    [],
  );

  const clearFilter = useCallback(() => {
    setFilter({
      search: "",
      status: "",
      selectedCategories: [],
      selectedAssets: [],
      active: true,
    });
  }, []);

  const tableDataMap = {
    Expense: expenseData,
    Income: incomeData,
    Transfer: transferData,
  };

  const tableData = tableDataMap[type as keyof typeof tableDataMap];

  const tableColumn = useMemo(() => columns, [columns]);
  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname,
  );
  const totalPages = tableData?.totalPages;

  const tableFetching = expenseFetching || incomeFetching || transferFetching;

  const graphData =
    type === "Expense"
      ? expenseGraphData
      : type === "Income"
        ? incomeGraphData
        : null;

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

  // Restart from the first page whenever the query changes
  useEffect(() => {
    setPageIndex(0);
  }, [type, startDate?.getTime(), endDate?.getTime(), filter]);

  // Mobile list: page 0 replaces, later pages append (deduped by id)
  useEffect(() => {
    if (!tableData?.data) return;
    if (pageIndex === 0) {
      setTransactions(tableData.data);
      return;
    }
    setTransactions((prev) => {
      const seen = new Set(prev.map((row) => row.id));
      return [
        ...prev,
        ...tableData.data.filter((row: TransactionRow) => !seen.has(row.id)),
      ];
    });
  }, [tableData]);

  const handleLoadMore = useCallback(() => {
    if (tableFetching || totalPages === undefined) return;
    if (pageIndex < totalPages - 1) setPageIndex((prev) => prev + 1);
  }, [tableFetching, totalPages, pageIndex]);

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
      {Tour}
      <CommonToolbar />
      <div className="flex p-5 flex-col gap-5">
        <PageHeader
          pageName={currentPageName?.name}
          description={`Overview of ${filter?.active === false ? "archived " : ""}${type.toLocaleLowerCase()} for this ${formatMode()}`}
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
          <div className="w-full overflow-hidden" data-tour="table">
            <DataTable
              columns={tableColumn}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              totalPages={totalPages}
              pageIndex={pageIndex}
              pageSize={pageSize}
              isLoading={tableFetching}
              onLoadMore={handleLoadMore}
              resetKey={`${type}|${startDate?.getTime()}|${endDate?.getTime()}|${JSON.stringify(filter ?? {})}`}
              graphData={graphData}
              data={width > 639 ? tableData?.data : transaction || []}
            />
          </div>

          {/* Chart */}
          {showGraph && (
            <div data-tour="graph">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div data-tour="budget" className="flex min-w-0">
            <CommonTracker />
          </div>
          <div data-tour="schedule" className="flex min-w-0">
            <ScheduledWidget type={type} />
          </div>
        </div>

        <ViewDetailed
          open={viewOpen}
          setOpen={(val: boolean) => dispatch(setOpenDialog(val))}
          transaction={activeRow as TransactionDetails | null}
        />
      </div>
    </>
  );
};

export default TransactionPage;
