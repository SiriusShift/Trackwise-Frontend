import Widget from "@/features/dashboard/components/widgets/Widget";

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
