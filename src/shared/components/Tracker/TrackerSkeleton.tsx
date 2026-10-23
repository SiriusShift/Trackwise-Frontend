import { Card } from "../ui/card";
import { CarouselItem } from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";

const TrackerSkeleton = ({ count }: { count: number }) => {
  return (
    <CarouselItem
      className={`${count > 1 ? "basis-[90%]" : "basis-full"} pl-4 2xl:basis-1/2`}
    >
      <Card className="flex h-28 flex-col justify-between rounded-lg bg-muted/20 p-4 shadow-none">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-border/50 pt-3">
          <Skeleton className="h-2 flex-1 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </Card>
    </CarouselItem>
  );
};

export default TrackerSkeleton;
