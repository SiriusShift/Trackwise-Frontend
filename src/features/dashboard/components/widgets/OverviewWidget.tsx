import Widget from "@/features/dashboard/components/widgets/Widget";
import AnimateNumber from "@/shared/components/AnimateNumber";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatDateDisplay, formatMode } from "@/shared/utils/CustomFunctions";
import { Banknote } from "lucide-react";
import { StackedBar } from "@/shared/components/charts/CommonStackedBar";

const segments: StackedBarSegment[] = [
  { label: "Cash on hand", value: 2500, color: "hsl(var(--chart-1))" },
  { label: "GCash", value: 2000, color: "hsl(var(--chart-2))" },
  { label: "Maya", value: 1500, color: "hsl(var(--chart-3))" },
  { label: "PayPal", value: 1025, color: "hsl(var(--chart-4))" },
  { label: "Savings", value: 1500, color: "hsl(var(--chart-5))" },
  { label: "Bank (BDO)", value: 1500, color: "hsl(var(--chart-6))" },
    { label: "Others", value: 7000, color: "hsl(var(--chart-7))" },
];

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
