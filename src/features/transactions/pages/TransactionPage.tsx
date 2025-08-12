import { navigationData } from "@/routing/navigationData";
import { useLocation } from "react-router-dom";
import { DataTable } from "@/shared/components/table/CommonTable";
import { expenseColumns } from "@/features/transactions/components/table-columns/expense/expenseColumn";
import { useEffect, useMemo, useState } from "react";
import {
  useLazyGetDetailedExpenseQuery,
  useLazyGetExpensesQuery,
} from "@/features/transactions/api/expense/expensesApi";
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
import { installmentColumn } from "../components/table-columns/expense/installmentColumn";
import { useLazyGetInstallmentsQuery } from "../api/expense/installmentApi";

const TransactionPage = () => {
  const location = useLocation();
  const active = useSelector((state: any) => state.active.active);
  const mode = formatMode();
  const activeType = useSelector((state: any) => state.active.type);
  console.log(activeType);

  // State Management

  const [startDate, setStartDate] = useState<Date | null>(
    moment(typeof active === "string" ? active : active?.from).toDate()
  );

  const [endDate, setEndDate] = useState<Date | null>(
    moment(typeof active !== "string" && active?.to).toDate()
  );

  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);

  // Current Page Name
  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname
  );

  // Queries

  const { data: categoryData } = useGetCategoryQuery({});

  const { data: categoryLimit, isLoading: categoryLimitLoading } =
    useGetCategoryLimitQuery({
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });

  const [triggerChart, { data: detailedExpense }] =
    useLazyGetDetailedExpenseQuery();

  const [triggerUpdate] = usePatchCategoryLimitMutation();
  const [triggerPost] = usePostCategoryLimitMutation();
  const [deleteLimit] = useDeleteCategoryLimitMutation();

  const transactionConfigMap = {
    Expense: {
      columns: expenseColumns,
      trigger: useLazyGetExpensesQuery,
    },
    // Recurring: {
    //   columns: recurringExpenseColumns,
    //   trigger: useLazyGetRecurringExpensesQuery,
    // },
    Installment: {
      columns: installmentColumn,
      trigger: useLazyGetInstallmentsQuery,
    },
    // Income: {
    //   columns: recurringExpenseColumns,
    //   trigger: useLazyGetRecurringExpensesQuery,
    // },
    // Transfer: {
    //   columns: installmentColumns,
    //   trigger: useLazyGetInstallmentExpensesQuery,
    // },
  };

  const { columns, trigger } = transactionConfigMap[activeType] || {};

  const { fetchData, data, isLoading } =
    useTriggerFetch<Expense[]>(trigger);

  //Functions
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

  //UseEffect
  useEffect(() => {
    fetchData({
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      pageSize,
      pageIndex,
    });
    triggerChart({
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      mode,
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
        <PageHeader
          pageName={currentPageName?.name}
          description={`Overview of ${activeType.toLocaleLowerCase()} for this ${formatMode()}`}
        />
        {/* Toolbar */}
        <TransactionToolbar
          categoryData={categoryData}
          transactionTrigger={fetchData}
          startDate={startDate}
          endDate={endDate}
          activeType={activeType}
        />

        <DataTable
          columns={columns}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          totalPages={data?.totalPages}
          pageIndex={pageIndex}
          pageSize={pageSize}
          trend={data?.trend}
          isLoading={isLoading}
          type={activeType}
          categoryExpenses={detailedExpense}
          data={data?.data || []}
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
