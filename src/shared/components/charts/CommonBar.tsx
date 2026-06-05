import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { StackedBarSegment } from "@/features/dashboard/components/widgets/OverviewWidget";
import { useEffect, useState } from "react";

interface StackedBarProps {
  segments: StackedBarSegment[];
  formatValue?: (value: number) => string;
  mode?: "stacked" | "progress";
  maxValue?: number;
}

function defaultFormat(value: number) {
  return value.toLocaleString();
}

export function StackedBar({
  segments,
  formatValue = defaultFormat,
  mode = "stacked",
  maxValue,
}: StackedBarProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [segments]);

  const total = segments?.reduce((sum, s) => sum + s.value, 0) ?? 0;
  const denominator = mode === "progress" ? (maxValue ?? total) : total;
  const progressPct =
    denominator > 0 ? Math.min((total / denominator) * 100, 100) : 0;

  // For stacked: filter out zero-value segments for correct border-radius assignment
  const visibleSegments = segments?.filter((s) => s.value > 0) ?? [];

  if (mode === "progress") {
    // Single filled bar — segments stack left-to-right within the filled region
    return (
      <div className="space-y-2">
        <TooltipProvider delayDuration={100}>
          <div className="relative flex h-2 rounded-full overflow-hidden bg-muted">
            {/* Filled region: clips all segments to progressPct width */}
            <div
              className="absolute left-0 top-0 h-full rounded-full overflow-hidden transition-all duration-500 ease-out"
              style={{ width: animated ? `${progressPct}%` : "0%" }}
            >
              <div className="relative flex h-full w-full">
                {segments?.map((seg, i) => {
                  const segPct = total > 0 ? (seg.value / total) * 100 : 0;
                  const isFirst = i === 0;
                  const isLast = i === segments.length - 1;
                  return (
                    <div
                      key={seg.label}
                      className="h-full cursor-pointer hover:brightness-110 hover:scale-y-125 origin-bottom transition-[filter,transform] duration-150"
                      style={{
                        width: `${segPct}%`,
                        minWidth: segPct > 0 ? "3px" : "0",
                        borderRadius: isFirst
                          ? "999px 0 0 999px"
                          : isLast
                            ? "0 999px 999px 0"
                            : "0",
                        backgroundColor: total > denominator ? "hsl(var(--destructive))" : "hsl(var(--primary))",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </TooltipProvider>
      </div>
    );
  }

  // Stacked mode (original behavior, with fixed border-radius logic)
  return (
    <div className="space-y-2">
      <TooltipProvider delayDuration={100}>
        <div className="relative flex h-2 w-full rounded-full bg-muted-foreground border overflow-hidden gap-px">
          {segments?.map((seg) => {
            const pct = denominator > 0 ? (seg.value / denominator) * 100 : 0;
            const visibleIdx = visibleSegments.indexOf(seg);
            const isFirst = visibleIdx === 0;
            const isLast = visibleIdx === visibleSegments.length - 1;

            return (
              <Tooltip key={seg.label}>
                <TooltipTrigger asChild>
                  <div
                    className="h-full cursor-pointer hover:brightness-110 hover:scale-y-125 origin-bottom"
                    style={{
                      width: animated ? `${pct}%` : "0%",
                      borderRadius:
                        isFirst && isLast
                          ? "999px"
                          : isFirst
                            ? "999px 0 0 999px"
                            : isLast
                              ? "0 999px 999px 0"
                              : "0",
                      minWidth: pct > 0 ? "3px" : "0",
                      transition:
                        "width 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.15s, transform 0.15s",
                      backgroundColor: seg.color,
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="text-xs border border-border/60 bg-popover shadow-md"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                      style={{ background: seg.color }}
                    />
                    <p className="font-medium text-foreground">{seg.label}</p>
                  </div>
                  <p className="text-muted-foreground pl-3.5">
                    {formatValue(seg.value)}
                  </p>
                  <p className="text-muted-foreground pl-3.5">
                    {pct.toFixed(1)}% of total
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {segments?.map((seg) => (
            <div key={seg.label} className="flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ background: seg.color }}
              />
              <span className="text-[11px] text-muted-foreground leading-none">
                {seg.label}
              </span>
            </div>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
