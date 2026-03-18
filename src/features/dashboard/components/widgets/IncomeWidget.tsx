import Widget from "@/features/dashboard/components/widgets/Widget";
import {
  formatMode,
} from "@/shared/utils/CustomFunctions";

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

const IncomeWidget = ({ data, isLoading }) => {
    const formattedData = data?.incomeBreakdown?.map((item, index) => ({
    label: item.name,
    value: item.amount,
    color: `hsl(var(--chart-${index+1}))`
  }))
  return (
    <Widget title="Income" isLoading={isLoading} data={data} segments={formattedData} icon={"ArrowUpFromLine"}/>
  );
};

export default IncomeWidget;
