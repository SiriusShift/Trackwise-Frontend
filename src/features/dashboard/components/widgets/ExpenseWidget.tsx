import Widget from "@/features/dashboard/components/widgets/Widget";
import { useGetAssetQuery } from "@/shared/api/assetsApi";
import AnimateNumber from "@/shared/components/AnimateNumber";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { overviewWidgetProps } from "@/shared/types";
import {
  formatCurrency,
  formatDateDisplay,
  formatMode,
} from "@/shared/utils/CustomFunctions";
import { ArrowUpFromLine, Banknote } from "lucide-react";
import { useSelector } from "react-redux";

const segments: StackedBarSegment[] = [
  { label: "Salary", value: 1670, color: "hsl(var(--chart-1))" },
  { label: "Side Hustle ", value: 2000, color: "hsl(var(--chart-2))" },
  { label: "Side Hustle ", value: 780, color: "hsl(var(--chart-3))" },
];

export interface StackedBarSegment {
  label: string;
  value: number;
  color: string;
}

const ExpenseWidget = ({ data, isLoading }) => {
      const formattedData = data?.expenseBreakdown?.map((item, index) => ({
    label: item.name,
    value: item.amount,
    color: `hsl(var(--chart-${index+1}))`
  }))
  return (
    <Widget title="Expense" data={data} isLoading={isLoading} segments={formattedData} icon={"ArrowDownToLine"}/>
  );
};

export default ExpenseWidget;
