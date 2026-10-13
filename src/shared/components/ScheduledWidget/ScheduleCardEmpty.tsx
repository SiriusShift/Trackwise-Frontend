import { CarouselItem } from "../ui/carousel";
import { CardContent } from "../ui/card";

const ScheduleCardEmpty = () => {
  return (
    <CarouselItem className="basis-full xl:basis-1/2 h-full">
      <CardContent className="flex flex-1 h-full justify-center items-center p-3 gap-3 border-2 border-dashed rounded-lg">
        <span className="block text-sm text-muted-foreground">No schedule set</span>
        {/* <Skeleton className="h-12 w-12 rounded-full ml-5" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div> */}
      </CardContent>
    </CarouselItem>
  );
};

export default ScheduleCardEmpty;
