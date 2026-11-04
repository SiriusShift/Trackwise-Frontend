import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

const GoalsInfoCardSkeleton = () => (
  <Card className="flex flex-col gap-4 p-4">
    <div className="flex items-center gap-4">
      <Skeleton className="size-11 rounded-xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
    </div>
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-2 w-full" />
    <Skeleton className="h-16 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-40 w-full" />
  </Card>
);

export default GoalsInfoCardSkeleton