import { ChartContainer, type ChartConfig } from "@/shared/components/ui/chart";
import { useId } from "react";
import { Line, LineChart, ReferenceLine, YAxis } from "recharts";

// Theme tokens are raw HSL triples, so they need hsl() to be a valid color
const config = {
  up: { label: "Value", color: "hsl(var(--success))" },
  down: { label: "Value", color: "hsl(var(--destructive))" },
  short: { label: "Value", color: "hsl(var(--warning))" },
} satisfies ChartConfig;

export function StatSparkline({
  values,
  avg,
  fromZero = false,
  width = 80,
}: {
  values: number[];
  // Target drawn as a dashed line; the line is colored by the latest point against it
  avg?: number;
  // Start the scale at 0 so small changes aren't exaggerated
  fromZero?: boolean;
  width?: number;
}) {
  const gid = useId().replace(/:/g, "");

  // A line needs at least two points, and an all-zero history says nothing
  if (values.length < 2 || values.every((v) => v === 0)) return null;

  const data = values.map((value, i) => ({ i, value }));
  const last = values[values.length - 1];
  const color =
    avg != null
      ? last >= avg
        ? "var(--color-up)"
        : "var(--color-short)"
      : last >= values[0]
        ? "var(--color-up)"
        : "var(--color-down)";

  return (
    <ChartContainer
      config={config}
      className="aspect-auto h-9 shrink-0"
      style={{ width }}
      aria-hidden
    >
      <LineChart data={data} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
        <YAxis hide domain={[fromZero ? 0 : "dataMin", "dataMax"]} />
        <defs>
          <linearGradient
            id={gid}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2={width}
            y2="0"
          >
            <stop offset="0" stopColor={color} stopOpacity={0.12} />
            <stop offset="0.55" stopColor={color} stopOpacity={0.55} />
            <stop offset="1" stopColor={color} stopOpacity={1} />
          </linearGradient>
        </defs>
        {avg != null && (
          <ReferenceLine
            y={avg}
            // Keep the target visible even when every month is below or above it
            ifOverflow="extendDomain"
            stroke="grey"
            strokeDasharray="3 3"
            opacity={0.5}
          />
        )}

        <Line
          dataKey="value"
          type="monotone"
          stroke={`url(#${gid})`}
          strokeWidth={1.75}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
