import { IRootState } from "@/app/store";
import {
  useDeleteCategoryLimitMutation,
  useGetCategoryLimitQuery,
} from "@/shared/api/categoryApi";
import TrackerCard from "@/shared/components/Tracker/TrackerCard";
import TrackerCardEmpty from "@/shared/components/Tracker/TrackerCardEmpty";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { Gauge, Plus } from "lucide-react";
import moment from "moment";
import { CategoryLimit } from "@/shared/types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import TrackerDialog from "./TrackerDialog";
import TrackerSkeleton from "./TrackerSkeleton";

// Number of fully visible cards at each breakpoint
const VISIBLE_CARDS: { minWidth: number; count: number }[] = [
  { minWidth: 1536, count: 2 },
  { minWidth: 768, count: 1 },
  { minWidth: 0, count: 1 },
];

function getVisibleCount(width: number): number {
  return VISIBLE_CARDS.find((b) => width >= b.minWidth)?.count ?? 1;
}

function Tracker() {
  const [open, setOpen] = useState(false);

  const width = useScreenWidth();
  const { confirm } = useConfirm();
  const [deleteLimit] = useDeleteCategoryLimitMutation();
  const active = useSelector((state: IRootState) => state.active.active);
  const { data, isLoading } = useGetCategoryLimitQuery({
    startDate: moment(active?.from).toDate()?.toISOString(),
    endDate: moment(active?.to).toDate()?.toISOString(),
  });

  const visibleCount = getVisibleCount(width);
  const itemCount = data?.length ?? 0;

  // Show nav arrows only when there are more items than visible slots
  const shouldShowNav = itemCount > visibleCount;

  // Empty placeholder cards to fill remaining visible slots
  const emptyCount = Math.max(0, visibleCount - itemCount);

  const overCount =
    data?.filter((item: CategoryLimit) => Number(item.total ?? 0) > (item.value ?? 0))
      .length ?? 0;

  const handleDelete = (item: CategoryLimit) => {
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
    <Card data-tour="budget" className="flex h-full w-full flex-col gap-4 p-5">
      <div className="flex flex-1 flex-col gap-4">
        {/* header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Gauge className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold leading-tight text-foreground">
                Budget limits
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                {isLoading
                  ? "Loading budgets…"
                  : itemCount === 0
                    ? "Set limits to keep spending in check"
                    : overCount > 0
                      ? `${itemCount} active · ${overCount} over limit`
                      : `${itemCount} active · all on track`}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            className="h-8 shrink-0 gap-1 px-2.5 text-xs"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" />
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
            <CarouselContent className="-ml-4">
              {isLoading
                ? [...Array(visibleCount)].map((_, i) => (
                    <TrackerSkeleton key={i} count={itemCount} />
                  ))
                : data?.map((item: CategoryLimit, index: number) => (
                    <TrackerCard
                      key={item.id ?? index}
                      item={item}
                      count={itemCount}
                      onDelete={handleDelete}
                    />
                  ))}

              {!isLoading &&
                [...Array(emptyCount)].map((_, i) => (
                  <TrackerCardEmpty
                    key={`empty-${i}`}
                    onAdd={() => setOpen(true)}
                  />
                ))}
            </CarouselContent>

            {shouldShowNav && (
              <>
                <CarouselPrevious className="absolute -left-3 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 rounded-full bg-background shadow-sm sm:flex" />

                <CarouselNext className="absolute -right-3 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 rounded-full bg-background shadow-sm sm:flex" />
              </>
            )}
          </Carousel>
        </div>
        <TrackerDialog
          title="Add budget"
          mode="add"
          open={open}
          setOpen={setOpen}
          description="Set a spending limit for a category"
          // data={data}
        />
      </div>
    </Card>
  );
}

export default Tracker;
