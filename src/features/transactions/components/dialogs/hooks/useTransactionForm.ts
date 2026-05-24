import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { frequencies } from "@/shared/constants/dateConstants";

interface UseTransactionFormProps {
  open: boolean;
  type: string;
  mode: string;
  history?: boolean;
  rowData: any;
  schema: any;
}

function buildResetData(type: string, mode: string, rowData: any) {
  const isRecurring = !!rowData?.interval;
  const isRecurringTemplate = !!rowData?.recurringIncome;
  const isTransact = mode === "transact";

  if (isRecurring) {
    return {
      date: rowData.startDate,
      id: rowData.id,
      description: rowData.description,
      amount: rowData.amount,
      endDate: rowData.endDate,
      recurring: true,
      category: rowData.category,
      frequency: rowData.unit,
      every: rowData.interval,
      repeat:
        frequencies?.find(
          (f) => f.interval === rowData.interval && f.unit === rowData.unit,
        ) ?? { id: 9, interval: rowData.interval, name: "Custom", unit: rowData.unit },
      ...(rowData.fromAssetId && { from: rowData.fromAssetId }),
      ...(rowData.toAsset && { to: rowData.toAsset }),
      auto: rowData.auto,
    };
  }

  // Shared fields across types / modes
  const base = {
    date: isTransact ? moment().toDate() : rowData.date,
    id: rowData.id,
    description: isTransact || isRecurringTemplate ? "" : rowData.description,
    amount: isTransact || isRecurringTemplate ? rowData.remainingBalance : rowData.amount,
    category: rowData.category,
    image: rowData.image ?? null,
    balance: rowData.remainingBalance ?? null,
    initialAmount: isTransact || isRecurringTemplate ? 0 : rowData.amount,
    recurring: false,
  };

  if (type === "Expense") {
    return { ...base, account: rowData.asset ?? null };
  }

  if (type === "Income") {
    return { ...base, account: rowData.asset ?? null };
  }

  if (type === "Transfer") {
    return {
      ...base,
      from: rowData.fromAsset ?? null,
      to: rowData.toAsset ?? null,
    };
  }

  return base;
}

export function useTransactionForm({
  open,
  type,
  mode,
  rowData,
  schema,
}: UseTransactionFormProps) {
  const form = useForm({
    resolver: yupResolver(schema?.schema),
    mode: "onChange",
    defaultValues: schema?.defaultValues,
  });

  console.log(form.watch())

  useEffect(() => {
    if (!open) return;

    if (!rowData) {
      form.reset({ ...schema?.defaultValues, mode, date: moment().toDate() });
      return;
    }

    const resetData = buildResetData(type, mode, rowData);
    form.reset({ ...resetData, mode });
  }, [open, type, rowData, mode]);

  return form;
}