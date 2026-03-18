import Widget from "@/features/dashboard/components/widgets/Widget";

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
