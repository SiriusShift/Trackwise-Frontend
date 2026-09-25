import Widget from "@/features/dashboard/components/widgets/Widget";
import { statisticsWidgetProps } from "@/shared/types";

const ExpenseWidget = ({ data, isLoading }: statisticsWidgetProps) => {
      const formattedData = data?.expenseBreakdown?.map((item) => ({
    label: item.name,
    value: item.amount,
    color: item.color
  }))
  return (
    <Widget title="Expense" data={data} isLoading={isLoading} segments={formattedData} icon={"ArrowDownToLine"}/>
  );
};

export default ExpenseWidget;
