import React from "react";
import { CarouselItem } from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent } from "../ui/card";

const TrackerSkeleton = () => {
  return (
    <CarouselItem className="basis-full md:basis-1/2 xl:basis-1/3 2xl:basis-1/4">
      <Card className="h-full relative">
        {" "}
        <Skeleton className="absolute top-4 right-4 h-6 w-3" />
        <CardContent className="flex h-[100px] items-center p-3 gap-3">
          {/* Circle placeholder for radial chart */}
          <Skeleton className="h-12 w-12 rounded-full ml-5" />
          {/* Text placeholders */}
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  );
};

export default TrackerSkeleton;
