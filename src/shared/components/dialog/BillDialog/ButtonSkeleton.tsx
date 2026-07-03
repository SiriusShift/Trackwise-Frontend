import { Skeleton } from "../../ui/skeleton";

const ButtonSkeleton = () => {
  return (
    <div className="flex justify-end gap-3 border-t p-3">
      <Skeleton className="h-8 w-16 rounded-md" />
      <Skeleton className="h-8 w-16 rounded-md" />
    </div>
  );
};

export default ButtonSkeleton;
