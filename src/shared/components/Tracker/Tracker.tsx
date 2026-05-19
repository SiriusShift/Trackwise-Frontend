import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { commonTrackerProps } from "@/shared/types";
import { TrackerAddCard } from "@/shared/components/Tracker/TrackerAddCard";
import TrackerCard from "@/shared/components/Tracker/TrackerCard";
import TrackerSkeleton from "./TrackerSkeleton";
import TrackerCardEmpty from "@/shared/components/Tracker/TrackerCardEmpty";
import { useDeleteCategoryLimitMutation } from "@/shared/api/categoryApi";
import { toast } from "sonner";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

// Number of fully visible cards at each breakpoint
const VISIBLE_CARDS: { minWidth: number; count: number }[] = [
  { minWidth: 1536, count: 3 },
  { minWidth: 1280, count: 2 },
  { minWidth: 768, count: 1 },
  { minWidth: 0, count: 1 },
];

function getVisibleCount(width: number): number {
  return VISIBLE_CARDS.find((b) => width >= b.minWidth)?.count ?? 1;
}

function Tracker({
  title,
  data,
  editDescription,
  addDescription,
  isLoading,
  type,
}: commonTrackerProps) {
  const width = useScreenWidth();
  const { confirm } = useConfirm();
  const [deleteLimit] = useDeleteCategoryLimitMutation();

  const visibleCount = getVisibleCount(width);
  const itemCount = data?.length ?? 0;

  // Show nav arrows only when there are more items than visible slots
  const shouldShowNav = itemCount > visibleCount;

  // Empty placeholder cards to fill remaining visible slots
  const emptyCount = Math.max(0, visibleCount - itemCount);

  const handleDelete = (item: any) => {
    confirm({
      title: "Delete budget",
      description: "Are you sure you want to delete this budget?",
      variant: "warning",
      showLoadingOnConfirm: true,
      onConfirm: async () => {
        try {
          await deleteLimit(item.id).unwrap();
          toast.success("Budget limit deleted successfully.");
        } catch {
          toast.error("Failed to delete budget limit. Please try again.");
        }
      },
    });
  };

  return (
    <Card className="relative w-full overflow-hidden rounded-lg border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-md">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-0 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 left-0 h-52 w-52 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent)]" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-sm font-semibold tracking-wide text-foreground">
              {title}
            </h1>

            <p className="text-xs text-muted-foreground">
              Track and manage your active entries
            </p>
          </div>

          <Button
            className="shadow-sm h-9 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              watchDrag: width < 768,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {isLoading
                ? [...Array(visibleCount)].map((_, i) => (
                    <TrackerSkeleton key={i} />
                  ))
                : data?.map((item, index) => (
                    <TrackerCard
                      key={item.id ?? index}
                      item={item}
                      title={title}
                      type={type}
                      onDelete={handleDelete}
                      editDescription={editDescription}
                    />
                  ))}

              {!isLoading &&
                [...Array(emptyCount)].map((_, i) => (
                  <TrackerCardEmpty key={`empty-${i}`} />
                ))}
            </CarouselContent>

            {shouldShowNav && (
              <>
                <CarouselPrevious className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full border border-border/60 bg-background/80 shadow-md backdrop-blur-md transition-all hover:scale-105 sm:flex" />

                <CarouselNext className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full border border-border/60 bg-background/80 shadow-md backdrop-blur-md transition-all hover:scale-105 sm:flex" />
              </>
            )}
          </Carousel>
        </div>
      </div>
    </Card>
  );
}

export default Tracker;
