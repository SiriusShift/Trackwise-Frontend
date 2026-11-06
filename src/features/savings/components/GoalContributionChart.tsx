import { IRootState } from "@/app/store";
import { Card } from "@/shared/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/shared/components/ui/chart";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import moment from "moment";
import { useSelector } from "react-redux";
import { Bar, BarChart, ReferenceLine, XAxis, YAxis } from "recharts";

const chartConfig = {
  amount: { label: "Contributed", color: "hsl(var(--success))" },
} satisfies ChartConfig;

interface GoalContributionChartProps {
  // Contributions per calendar month, oldest first
  monthly: number[];
  // Drawn as a dashed line; null hides it
  neededPace: number | null;
}

const GoalContributionChart = ({
  monthly,
  neededPace,
}: GoalContributionChartProps) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);

  const format = (amount: number) =>
    formatCurrency(amount, currency, "symbol", 0);

  const now = moment();
  const chartData = monthly.map((amount, i) => ({
    month: now
      .clone()
      .subtract(monthly.length - 1 - i, "months")
      .format("MMM"),
    amount,
  }));
  const hasContributions = monthly.some((v) => v > 0);

  return (
    <Card className="flex min-w-0 flex-col gap-2 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Monthly contributions</h3>
        {neededPace != null && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="w-4 border-t border-dashed border-muted-foreground"
              aria-hidden
            />
            Needed pace
          </span>
        )}
      </div>
      {hasContributions ? (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-40 w-full"
          aria-label={`Contributions over the last ${monthly.length} months`}
        >
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 4, bottom: 0, left: 4 }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              fontSize={11}
            />
            <YAxis hide domain={[0, "dataMax"]} />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
              content={({ active, payload, label: month }) =>
                active && payload?.length ? (
                  <div className="rounded-md border bg-background px-2.5 py-1.5 text-xs shadow-sm">
                    <div className="text-muted-foreground">{month}</div>
                    <div className="font-semibold tabular-nums">
                      {format(Number(payload[0].value))}
                    </div>
                  </div>
                ) : null
              }
            />
            {neededPace != null && (
              <ReferenceLine
                y={neededPace}
                // Keep the target visible when every month is below it
                ifOverflow="extendDomain"
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
              />
            )}
            <Bar
              dataKey="amount"
              fill="var(--color-amount)"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed px-4 text-center text-sm text-muted-foreground">
          No contributions in the last {monthly.length} months
        </div>
      )}
    </Card>
  );
};

export default GoalContributionChart;
