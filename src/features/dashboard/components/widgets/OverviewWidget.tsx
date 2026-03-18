import Widget from "@/features/dashboard/components/widgets/Widget";

export interface StackedBarSegment {
  label: string;
  value: number;
  color: string;
}

const OverviewWidget = ({ data, isLoading }) => {
  const formattedData = data?.assetBreakdown?.map((item, index) => ({
    label: item.name,
    value: item.balance,
    color: `hsl(var(--chart-${index+1}))`
  }))
  return (
    <Widget title="Overview" data={data} isLoading={isLoading} segments={formattedData} icon="Banknote"/>
  );
};

export default OverviewWidget;
