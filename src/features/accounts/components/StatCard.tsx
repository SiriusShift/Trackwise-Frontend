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
        "group relative overflow-hidden p-5 transition-all border border-border/50 bg-muted/40 hover:bg-muted/60",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-4 h-full">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            color,
          )}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{title}</span>

          {loading ? (
            <Skeleton className="mt-1 h-7 w-28" />
          ) : (
            <span className="text-2xl font-bold tracking-tight">{value}</span>
          )}

          {!loading && footer && (
            <span className="text-xs text-muted-foreground">{footer}</span>
          )}
        </div>
      </div>
    </Card>
  );
}

export default StatCard;
