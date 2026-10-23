import { CalendarPlus } from "lucide-react";
import { CarouselItem } from "../ui/carousel";

const ScheduleCardEmpty = () => {
  return (
    <CarouselItem className="basis-full pl-4 2xl:basis-1/2">
      <div className="flex h-28 items-center gap-3 rounded-lg border border-dashed p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <CalendarPlus className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold leading-tight">
            No schedule set
          </span>
          <span className="mt-1 block text-xs leading-tight text-muted-foreground">
            Mark a transaction as recurring to see it here
          </span>
        </span>
      </div>
    </CarouselItem>
  );
};

export default ScheduleCardEmpty;
