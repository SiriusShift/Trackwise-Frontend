import {
  useCancelRecurringMutation,
  useGetRecurringQuery,
} from "@/features/transactions/api/transaction/recurringApi";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { handleCatchErrorMessage } from "@/shared/utils/CustomFunctions";
import { Schedule } from "@/shared/types";
import { toast } from "sonner";
import { CalendarClock, ChevronRight } from "lucide-react";
import moment from "moment";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import ScheduleCard from "./ScheduleCard";
import ScheduleSkeleton from "./ScheduleSkeleton";
import ScheduleCardEmpty from "./ScheduleCardEmpty";

// Number of fully visible cards at each breakpoint
const VISIBLE_CARDS: { minWidth: number; count: number }[] = [
  { minWidth: 1536, count: 2 },
  { minWidth: 768, count: 1 },
  { minWidth: 0, count: 1 },
];

function getVisibleCount(width: number): number {
  return VISIBLE_CARDS.find((b) => width >= b.minWidth)?.count ?? 1;
}

interface ScheduledWidgetProps {
  type: string;
}

function ScheduledWidget({ type }: ScheduledWidgetProps) {
  const navigate = useNavigate();
  const width = useScreenWidth();
  const { confirm } = useConfirm();

  const { data, isLoading } = useGetRecurringQuery(type);
  const [cancelRecurring] = useCancelRecurringMutation();

  const handleDelete = (schedule: Schedule) => {
    confirm({
      title: "Delete schedule",
      description: `Stop "${schedule.description}"? Transactions already created are kept, but no new ones will be scheduled.`,
      variant: "warning",
      confirmText: "Delete",
      cancelText: "Cancel",
      showLoadingOnConfirm: true,
      onConfirm: async () => {
        try {
          await cancelRecurring(schedule.id).unwrap();
          toast.success("Schedule deleted successfully.");
        } catch (err: any) {
          toast.error(handleCatchErrorMessage(err) ?? "Something went wrong.");
        }
      },
    });
  };

  const visibleCount = getVisibleCount(width);
  const itemCount = data?.length ?? 0;

  // Show nav arrows only when there are more items than visible slots
  const shouldShowNav = itemCount > visibleCount;

  // Empty placeholder cards to fill remaining visible slots
  const emptyCount = Math.max(0, visibleCount - itemCount);

  const weekEnd = moment().add(7, "days").endOf("day");
  const dueSoonCount =
    data?.filter(
      (s) => s.nextDueDate && moment(s.nextDueDate).isSameOrBefore(weekEnd),
    ).length ?? 0;

  return (
    <Card className="flex h-full w-full flex-col gap-4 p-5">
      <div className="flex flex-1 flex-col gap-4">
        {/* header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <CalendarClock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold leading-tight text-foreground">
                Scheduled {type}
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                {isLoading
                  ? "Loading schedules…"
                  : itemCount === 0
                    ? "No active schedules"
                    : dueSoonCount > 0
                      ? `${itemCount} active · ${dueSoonCount} due this week`
                      : `${itemCount} active`}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 shrink-0 gap-1 px-2.5 text-xs"
            onClick={() => navigate("/transactions/schedules")}
          >
            View all
            <ChevronRight className="h-4 w-4" />
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
                    <ScheduleSkeleton key={i} count={itemCount} />
                  ))
                : data?.map((schedule, index) => (
                    <ScheduleCard
                      key={schedule.id ?? index}
                      schedule={schedule}
                      onDelete={handleDelete}
                      count={itemCount}
                    />
                  ))}

              {!isLoading &&
                [...Array(emptyCount)].map((_, i) => (
                  <ScheduleCardEmpty key={`empty-${i}`} />
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
      </div>
    </Card>
  );
}

export default ScheduledWidget;
