import Widget from "@/features/dashboard/components/widgets/Widget";
import { statisticsWidgetProps } from "@/shared/types";

const OverviewWidget = ({ data, isLoading }: statisticsWidgetProps) => {
  const formattedData = data?.assetBreakdown?.map((item) => ({
    label: item.name,
    value: item.balance,
    color: item.color
  }))
  return (
    <Widget title="Overview" data={data} isLoading={isLoading} segments={formattedData} icon="Banknote"/>
  );
};

export default OverviewWidget;
