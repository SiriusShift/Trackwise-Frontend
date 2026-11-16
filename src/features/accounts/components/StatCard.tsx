import { LucideIcon } from "lucide-react";
import { ComponentProps, ReactNode } from "react";
import { Card } from "../../../shared/components/ui/card";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatCardProps = ComponentProps<typeof Card> & {
  title: string;
  value: ReactNode;
  icon: LucideIcon;
  color?: string;
  loading?: boolean;
  footer?: ReactNode;
};

function StatCard({
  title,
  value,
  icon: Icon,
  color = "text-primary bg-primary/10",
  loading = false,
  footer,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-border/50 bg-muted/40 p-3 transition-all hover:bg-muted/60 sm:p-5",
        className,
      )}
      {...props}
    >
      <div className="flex h-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl",
            color,
          )}
        >
          <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
        </div>

        <div className="flex min-w-0 flex-col">
          <span className="text-xs text-muted-foreground sm:text-sm">
            {title}
          </span>

          {loading ? (
            <Skeleton className="mt-1 h-6 w-20 sm:h-7 sm:w-28" />
          ) : (
            <span
              className="truncate text-lg font-bold tracking-tight tabular-nums sm:text-2xl"
              title={typeof value === "string" ? value : undefined}
            >
              {value}
            </span>
          )}

          {!loading && footer && (
            <span className="truncate text-[11px] text-muted-foreground sm:text-xs">
              {footer}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

export default StatCard;
