import Widget from "@/features/dashboard/components/widgets/Widget";
import { statisticsWidgetProps } from "@/shared/types";

const IncomeWidget = ({ data, isLoading }: statisticsWidgetProps) => {
    const formattedData = data?.incomeBreakdown?.map((item) => ({
    label: item.name,
    value: item.amount,
    color: item.color
  }))
  return (
    <Widget title="Income" isLoading={isLoading} data={data} segments={formattedData} icon={"ArrowUpFromLine"}/>
  );
};

export default IncomeWidget;
