import { Skeleton } from "@/shared/components/ui/skeleton";

// One placeholder row, matching the compact TransactionItem
const TransactionListSkeleton = () => {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="h-10 w-10 shrink-0 rounded-[10px]" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-3 w-48 max-w-full" />
      </div>
    </div>
  );
};

export default TransactionListSkeleton;
