import { frequencies } from "@/shared/constants/dateConstants";
import { scheduleDefaults } from "@/shared/schema/fields";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetLastEntryQuery } from "../../api/transaction";

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
      ...scheduleDefaults,
      ...(rowData.daysOfMonth?.length && {
        repeatBy: "days",
        daysOfMonth: rowData.daysOfMonth,
      }),
      repeat: frequencies?.find(
        (f) => f.interval === rowData.interval && f.unit === rowData.unit,
      ) ?? {
        id: 9,
        interval: rowData.interval,
        name: "Custom",
        unit: rowData.unit,
      },
      ...(rowData.fromAsset && { account: rowData.fromAsset }),
      ...(rowData.toAsset && { to: rowData.toAsset }),
      behaviour: rowData.behaviour,
    };
  }

  // Shared fields across types / modes
  const base = {
    date: isTransact ? moment().toDate() : rowData.date,
    id: rowData.id,
    description: isTransact || isRecurringTemplate ? "" : rowData.description,
    amount:
      isTransact || isRecurringTemplate
        ? rowData.remainingBalance
        : rowData.amount,
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
    resolver: zodResolver(schema?.schema),
    mode: "onChange",
    defaultValues: schema?.defaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (!rowData) {
      form.reset({ ...schema?.defaultValues, mode, date: moment().toDate() });
      return;
    }

    const resetData = buildResetData(type, mode, rowData);
    form.reset({ ...resetData, mode });
  }, [open, type, rowData, mode]);

  // New entries start from the last entry's account and category. Refetched on
  // every open so it reflects what was just saved.
  const isNew = open && !rowData;
  const { data: lastEntry } = useGetLastEntryQuery(type, {
    skip: !isNew || !type,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!isNew || !lastEntry) return;

    const accountField = type === "Transfer" ? "from" : "account";
    const prefill = {
      ...(lastEntry.category && { category: lastEntry.category }),
      ...(lastEntry.account && { [accountField]: lastEntry.account }),
    };

    // Becomes the form's baseline (so it doesn't count as a user edit), and
    // keepDirtyValues leaves anything the user already changed untouched.
    form.reset(
      { ...form.getValues(), ...prefill },
      { keepDirtyValues: true },
    );
  }, [isNew, lastEntry, type]);

  return form;
}
