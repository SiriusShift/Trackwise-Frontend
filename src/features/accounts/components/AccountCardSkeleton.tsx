// src/pages/accounts/components/AccountCardSkeleton.tsx
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

const AccountCardSkeleton = () => {
  return (
    <Card className="flex min-h-44 flex-col justify-between gap-4 overflow-hidden p-4 sm:min-h-48 sm:p-5">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl sm:h-11 sm:w-11" />

          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        <Skeleton className="h-7 w-32" />
      </div>

      <div className="grid grid-cols-2 gap-2 border-t pt-3">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-16" />
      </div>
    </Card>
  );
};

export default AccountCardSkeleton;
