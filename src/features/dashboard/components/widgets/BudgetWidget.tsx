import { IRootState } from "@/app/store";
import { useGetCategoryLimitQuery } from "@/shared/api/categoryApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/shared/components/ui/chart";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CategoryLimit } from "@/shared/types";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import moment from "moment";
import { useId, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const MAX_ITEMS = 5;
const WARNING_THRESHOLD = 75;

type Status = "ok" | "warn" | "over";

const STATUS_COLOR: Record<Status, string> = {
  ok: "hsl(var(--primary))",
  warn: "hsl(38 92% 50%)",
  over: "hsl(var(--destructive))",
};

const getPercent = (item: CategoryLimit) =>
  item.value > 0 ? (Number(item.total ?? 0) / item.value) * 100 : 0;

const getStatus = (percent: number): Status =>
  percent > 100 ? "over" : percent >= WARNING_THRESHOLD ? "warn" : "ok";

const chartConfig = {
  display: { label: "Used", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

interface BarDatum {
  id: number;
  name: string;
  spent: number;
  limit: number;
  percent: number;
  display: number;
  status: Status;
}

// Hatched bar with a dot cap; fills with a solid gradient while hovered
function HatchedBar(props: any) {
  const { x, y, width, height, payload, index, activeIndex, ids } = props;
  if (!height || height <= 0) return null;

  const active = activeIndex === index;
  const status: Status = payload.status;
  const fill = active ? `url(#${ids.grad[status]})` : `url(#${ids.hatch[status]})`;

  return (
    <g style={{ transition: "opacity 150ms" }}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill={fill}
        stroke={STATUS_COLOR[status]}
        strokeOpacity={active ? 0 : 0.25}
      />
      <circle
        cx={x + width / 2}
        cy={y}
        r={4}
        fill="hsl(var(--card))"
        stroke={STATUS_COLOR[status]}
        strokeWidth={1.5}
      />
    </g>
  );
}

function BudgetTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d: BarDatum = payload[0].payload;
  return (
    <div className="rounded-xl border border-border/60 bg-card px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground">{d.name}</p>
      <div className="mt-1 flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-[3px]"
          style={{ background: STATUS_COLOR[d.status] }}
        />
        <span className="font-medium">Spent</span>
        <span className="ml-auto font-semibold tabular-nums">
          {formatCurrency(d.spent)}
        </span>
      </div>
      <p className="mt-1 text-muted-foreground tabular-nums">
        of {formatCurrency(d.limit)} · {Math.round(d.percent)}%
      </p>
    </div>
  );
}

function BudgetWidget() {
  const uid = useId().replace(/:/g, "");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = useSelector((state: IRootState) => state.active.active);

  const { data, isLoading } = useGetCategoryLimitQuery({
    startDate: moment(active?.from).toDate()?.toISOString(),
    endDate: moment(active?.to).toDate()?.toISOString(),
  });

  const totals = useMemo(() => {
    const limit = ((data ?? []) as CategoryLimit[]).reduce((sum, i) => sum + (i.value ?? 0), 0);
    const spent = ((data ?? []) as CategoryLimit[]).reduce((sum, i) => sum + Number(i.total ?? 0), 0);
    return {
      limit,
      spent,
      remaining: limit - spent,
      percent: limit > 0 ? (spent / limit) * 100 : 0,
    };
  }, [data]);

  // Highest % used first so over-limit categories are never hidden
  const chartData = useMemo<BarDatum[]>(
    () =>
      [...(data ?? [])]
        .sort((a, b) => getPercent(b) - getPercent(a))
        .slice(0, MAX_ITEMS)
        .map((item) => {
          const percent = getPercent(item);
          return {
            id: item.id,
            name: item.category?.name ?? "",
            spent: Number(item.total ?? 0),
            limit: item.value,
            percent,
            display: Math.min(percent, 100),
            status: getStatus(percent),
          };
        }),
    [data],
  );
  const hiddenCount = Math.max(0, (data?.length ?? 0) - MAX_ITEMS);

  const ids = {
    hatch: {
      ok: `${uid}-hatch-ok`,
      warn: `${uid}-hatch-warn`,
      over: `${uid}-hatch-over`,
    },
    grad: {
      ok: `${uid}-grad-ok`,
      warn: `${uid}-grad-warn`,
      over: `${uid}-grad-over`,
    },
  };

  const overall = getStatus(totals.percent);

  return (
    <Card className="gap-4 relative overflow-hidden border border-border/60 bg-card p-5 flex flex-col rounded-2xl shadow-sm col-span-full md:col-span-2 lg:col-span-2 xl:col-span-1 transition-shadow hover:shadow-md">
      <CardHeader className="space-y-0 p-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold uppercase tracking-widest">
            Budget overview
          </CardTitle>
          {hiddenCount > 0 && (
            <Link
              to="/transactions"
              className="text-sm text-blue-400 hover:underline"
            >
              +{hiddenCount} more
            </Link>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-0 h-full">
        {isLoading ? (
          <>
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-[180px] w-full" />
          </>
        ) : chartData.length === 0 ? (
          <p className="m-auto text-sm text-muted-foreground">
            No budgets set for this period
          </p>
        ) : (
          <>
            {/* Summary: remaining + striped progress */}
            <div className="flex flex-col gap-2">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {totals.remaining < 0 ? "Over budget" : "Budget remaining"}
                  </p>
                  <p className="text-2xl font-semibold tabular-nums leading-tight">
                    {formatCurrency(Math.abs(totals.remaining))}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground tabular-nums">
                  of {formatCurrency(totals.limit)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 flex-1 overflow-hidden  bg-muted">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${Math.min(totals.percent, 100)}%`,
                      backgroundColor: STATUS_COLOR[overall],
                      backgroundImage:
                        "repeating-linear-gradient(90deg, transparent 0 3px, hsl(var(--card)) 2px 5px)",
                    }}
                  />
                </div>
                <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
                  {Math.round(totals.percent)}%
                </span>
              </div>
            </div>

            {/* Per-category hatched columns */}
            <ChartContainer config={chartConfig} className="h-[150px] w-full">
              <BarChart
                accessibilityLayer
                data={chartData}
                barCategoryGap="22%"
                margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
                onMouseMove={(s) =>
                  setActiveIndex(
                    typeof s?.activeTooltipIndex === "number"
                      ? s.activeTooltipIndex
                      : null,
                  )
                }
                onMouseLeave={() => setActiveIndex(null)}
              >
                <defs>
                  {(Object.keys(STATUS_COLOR) as Status[]).map((s) => (
                    <g key={s}>
                      <pattern
                        id={ids.hatch[s]}
                        patternUnits="userSpaceOnUse"
                        width="5"
                        height="5"
                        patternTransform="rotate(45)"
                      >
                        <rect
                          width="5"
                          height="5"
                          fill={STATUS_COLOR[s]}
                          fillOpacity="0.08"
                        />
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="5"
                          stroke={STATUS_COLOR[s]}
                          strokeWidth="1.5"
                          strokeOpacity="0.45"
                        />
                      </pattern>
                      <linearGradient
                        id={ids.grad[s]}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={STATUS_COLOR[s]}
                          stopOpacity="0.95"
                        />
                        <stop
                          offset="100%"
                          stopColor={STATUS_COLOR[s]}
                          stopOpacity="0.55"
                        />
                      </linearGradient>
                    </g>
                  ))}
                </defs>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={0}
                  tickFormatter={(v: string) =>
                    v.length > 7 ? `${v.slice(0, 6)}…` : v
                  }
                />
                <YAxis
                  type="number"
                  domain={[0, 100]}
                  ticks={[0, 50, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  className="text-xs"
                />
                <ChartTooltip cursor={false} content={<BudgetTooltip />} />
                <Bar
                  dataKey="display"
                  isAnimationActive
                  shape={(p: any) => (
                    <HatchedBar {...p} activeIndex={activeIndex} ids={ids} />
                  )}
                />
              </BarChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default BudgetWidget;
