import { useGetRecurringQuery } from "@/features/transactions/api/transaction/recurringApi";
import { useDeleteCategoryLimitMutation } from "@/shared/api/categoryApi";
import TrackerCardEmpty from "@/shared/components/Tracker/TrackerCardEmpty";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { commonTrackerProps } from "@/shared/types";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import ScheduleCard from "./ScheduleCard";
import ScheduleSkeleton from "./ScheduleSkeleton";

// Number of fully visible cards at each breakpoint
const VISIBLE_CARDS: { minWidth: number; count: number }[] = [
  { minWidth: 1536, count: 2 },
  { minWidth: 768, count: 1 },
  { minWidth: 0, count: 1 },
];

function getVisibleCount(width: number): number {
  return VISIBLE_CARDS.find((b) => width >= b.minWidth)?.count ?? 1;
}

function ScheduledWidget({ title, editDescription, type }: commonTrackerProps) {
  const [open, setOpen] = useState(false);

  const width = useScreenWidth();
  const { confirm } = useConfirm();
  const [deleteLimit] = useDeleteCategoryLimitMutation();

  const { data, isLoading } = useGetRecurringQuery();

  const visibleCount = getVisibleCount(width);
  const itemCount = data?.length ?? 0;

  console.log(visibleCount);
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
              Scheduled {type}
            </h1>
            <p className="text-xs text-muted-foreground">
              Track your active schedules
            </p>
          </div>
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
                    <ScheduleSkeleton key={i} count={itemCount} />
                  ))
                : data?.map((schedule, index) => (
                    <ScheduleCard
                      key={schedule.id ?? index}
                      schedule={schedule}
                      title={title}
                      type={type}
                      editDescription={editDescription}
                      count={itemCount}
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

export default ScheduledWidget;
