import { Skeleton } from "@/shared/components/ui/skeleton";

const CalendarSkeleton = () => {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="p-3 border-r last:border-r-0">
            <Skeleton className="h-4 w-12 mx-auto" />
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-32 border-r border-b p-2 last:border-r-0">
            <Skeleton className="h-4 w-6 mb-3" />
            <Skeleton className="h-5 w-full rounded-md mb-2" />
            <Skeleton className="h-5 w-3/4 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarSkeleton;
