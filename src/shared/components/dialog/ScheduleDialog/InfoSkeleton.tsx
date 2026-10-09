import { Separator } from "../../ui/separator";
import { Skeleton } from "../../ui/skeleton";

const InfoSkeleton = () => {
  return (
    <>
      <div className="p-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 pb-6">
          <Skeleton className="h-16 w-16 rounded-2xl" />

          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                <Skeleton className="h-4 w-32" />
              </div>

              {i !== 4 && <Separator className="mt-1" />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InfoSkeleton;
