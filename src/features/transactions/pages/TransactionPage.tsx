import { navigationData } from "@/routing/navigationData";
import { useLocation } from "react-router-dom";
import { DataTable } from "@/shared/components/table/CommonTable";
import { expenseColumns } from "@/features/transactions/components/table-columns/transaction/expenseColumn";
import { useEffect, useMemo, useState } from "react";
import {
  useGetExpensesQuery,
  useGetGraphExpenseQuery,
  useGetRecurringExpensesQuery,
  useLazyGetGraphExpenseQuery,
} from "@/features/transactions/api/transaction/expensesApi";
import { useSelector } from "react-redux";
import {
  useDeleteCategoryLimitMutation,
  useGetCategoryLimitQuery,
  useGetCategoryQuery,
  usePatchCategoryLimitMutation,
  usePostCategoryLimitMutation,
} from "@/shared/api/categoryApi";
import moment from "moment";
import CommonTracker from "@/shared/components/tracker/Tracker";
import { toast } from "sonner";
import { formatMode } from "@/shared/utils/CustomFunctions";
import PageHeader from "@/shared/components/PageHeader";
import TransactionToolbar from "@/features/transactions/components/TransactionToolbar";
import { useTriggerFetch } from "@/shared/hooks/useLazyFetch";
import { Expense } from "@/shared/types";
import { installmentColumn } from "../components/table-columns/installmentColumn";
import { useLazyGetInstallmentsQuery } from "../api/transaction/installmentApi";
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

const TransactionPage = () => {
  const location = useLocation();
  const { confirm } = useConfirm();
  const active = useSelector((state: IRootState) => state.active.active);
  const mode = formatMode();
  const type = useSelector((state: IRootState) => state.active.type);

  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [recurring, setRecurring] = useState<Boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const debouncedSeach = useDebounce(search, 500);

  console.log(recurring, "recurring!");

  // State Management

  const [startDate, setStartDate] = useState<Date | null>(
    moment(typeof active === "string" ? active : active?.from).toDate()
  );

  const [endDate, setEndDate] = useState<Date | null>(
    moment(typeof active !== "string" && active?.to).toDate()
  );

  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);

  // Queries

  // Category
  const { data: categoryData } = useGetCategoryQuery({
    type,
  });

  // Expense Budget

  const { data: categoryLimit, isLoading: categoryLimitLoading } =
    useGetCategoryLimitQuery({
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });
  const [triggerUpdate] = usePatchCategoryLimitMutation();
  const [triggerPost] = usePostCategoryLimitMutation();
  const [deleteLimit] = useDeleteCategoryLimitMutation();

  const { columns, recurringColumns } = transactionConfig[type] || {};
  // Expense
  const { data: expenseData, isFetching: expenseFetching } =
    useGetExpensesQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        pageSize,
        pageIndex,
        ...(status && { status: status }),
        ...(search && { search: debouncedSeach }), // Add `Search` only if truthy
        ...(selectedCategories.length > 0 && {
          Categories: JSON.stringify(
            selectedCategories.map((category) => category.id)
          ), // Add array of IDs
        }),
      },
      {
        skip: type !== "Expense" && recurring === true,
      }
    );

  const { data: recurringExpenseData, isFetching: recurringExpenseFetching } =
    useGetRecurringExpensesQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        pageSize,
        pageIndex,
        type: type,
        ...(status && { status: status }),
        ...(search && { search: debouncedSeach }), // Add `Search` only if truthy
        ...(selectedCategories.length > 0 && {
          Categories: JSON.stringify(
            selectedCategories.map((category) => category.id)
          ), // Add array of IDs
        }),
      },
      {
        skip: type !== "Expense" || !recurring,
      }
    );

  const { data: expenseGraphData, isFetching: expenseGraphFetching } =
    useGetGraphExpenseQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        mode,
        ...(status && { status: status }),
        ...(search && { search: debouncedSeach }), // Add `Search` only if truthy
        ...(selectedCategories.length > 0 && {
          Categories: JSON.stringify(
            selectedCategories.map((category) => category.id)
          ), // Add array of IDs
        }),
      },
      {
        skip: type !== "Expense",
      }
    );

  // Income
  const { data: incomeData, isFetching: incomeFetching } = useGetIncomeQuery(
    {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      pageSize,
      pageIndex,
      ...(status && { status: status }),
      ...(search && { search: debouncedSeach }), // Add `Search` only if truthy
      ...(selectedCategories.length > 0 && {
        Categories: JSON.stringify(
          selectedCategories.map((category) => category.id)
        ), // Add array of IDs
      }),
    },
    {
      skip: type !== "Income" || recurring === true,
    }
  );

  const { data: recurringIncomeData, isFetching: recurringIncomeFetching } =
    useGetRecurringIncomeQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        pageSize,
        pageIndex,
        type: type,
        ...(status && { status: status }),
        ...(search && { search: debouncedSeach }), // Add `Search` only if truthy
        ...(selectedCategories.length > 0 && {
          Categories: JSON.stringify(
            selectedCategories.map((category) => category.id)
          ), // Add array of IDs
        }),
      },
      {
        skip: type !== "Income" || !recurring,
      }
    );

  const { data: incomeGraphData, isFetching: incomeGraphFetching } =
    useGetGraphIncomeQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        mode,
        ...(status && { status: status }),
        ...(search && { search: debouncedSeach }), // Add `Search` only if truthy
        ...(selectedCategories.length > 0 && {
          Categories: JSON.stringify(
            selectedCategories.map((category) => category.id)
          ), // Add array of IDs
        }),
      },
      {
        skip: type !== "Income",
      }
    );

  //Transfer
  const { data: transferData, isFetching: transferFetching } =
    useGetTransferQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        pageSize,
        pageIndex,
        ...(status && { status: status }),
        ...(search && { search: debouncedSeach }), // Add `Search` only if truthy
        ...(selectedCategories.length > 0 && {
          Categories: JSON.stringify(
            selectedCategories.map((category) => category.id)
          ), // Add array of IDs
        }),
      },
      {
        skip: type !== "Transfer" || recurring === true,
      }
    );

  const { data: recurringTransferData, isFetching: recurringTransferFetching } =
    useGetRecurringTransferQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        pageSize,
        pageIndex,
        type: type,
        ...(status && { status: status }),
        ...(search && { search: debouncedSeach }), // Add `Search` only if truthy
        ...(selectedCategories.length > 0 && {
          Categories: JSON.stringify(
            selectedCategories.map((category) => category.id)
          ), // Add array of IDs
        }),
      },
      {
        skip: type !== "Transfer" || !recurring,
      }
    );

  const { data: transferGraphData, isFetching: transferGraphFetching } =
    useGetGraphTransferQuery(
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        mode,
        ...(status && { status: status }),
        ...(search && { search: debouncedSeach }), // Add `Search` only if truthy
        ...(selectedCategories.length > 0 && {
          Categories: JSON.stringify(
            selectedCategories.map((category) => category.id)
          ), // Add array of IDs
        }),
      },
      {
        skip: type !== "Transfer",
      }
    );

  // const [triggerChart, { data: chartData, isFetching: chartFetching }] =
  //   getChart();

  // Constant

  const tableData =
    type === "Expense"
      ? expenseData
      : type === "Income"
      ? incomeData
      : transferData;

  const tableColumn = recurring ? recurringColumns : columns;

  const recurringTableData =
    type === "Expense"
      ? recurringExpenseData
      : type === "Income"
      ? recurringIncomeData
      : recurringTransferData;

  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname
  );
  const totalPages = recurring
    ? recurringTableData?.totalPages
    : tableData?.totalPages;

  console.log(totalPages, "total pages");

  console.log(recurringExpenseData, "recurring data");
  const tableFetching =
    expenseFetching ||
    incomeFetching ||
    transferFetching ||
    recurringExpenseFetching ||
    recurringIncomeFetching ||
    recurringTransferFetching;

  const graphData =
    type === "Expense"
      ? expenseGraphData
      : type === "Income"
      ? incomeGraphData
      : transferGraphData;

  const graphFetching =
    expenseGraphFetching || incomeGraphFetching || transferGraphFetching;
  //Functions
  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      if (data?.id) {
        confirm({
          title: "Update budget limit",
          description: "Are you sure you want to update this budget?",
          variant: "info",
          showLoadingOnConfirm: true,
        });
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

  //UseEffect
  // useEffect(() => {
  //   trigger();
  //   triggerChart({
  //     startDate: startDate?.toISOString(),
  //     endDate: endDate?.toISOString(),
  //     mode,
  //   });
  // }, [pageSize, pageIndex, startDate, endDate, type]);

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
        <PageHeader
          pageName={currentPageName?.name}
          description={`Overview of ${type.toLocaleLowerCase()} for this ${formatMode()}`}
        />
        {/* Toolbar */}
        <TransactionToolbar
          categoryData={categoryData}
          search={search}
          status={status}
          recurring={recurring}
          selectedCategories={selectedCategories}
          setRecurring={setRecurring}
          setSearch={setSearch}
          setStatus={setStatus}
          setSelectedCategories={setSelectedCategories}
        />

        <DataTable
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
        />
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
    </>
  );
};

export default TransactionPage;
