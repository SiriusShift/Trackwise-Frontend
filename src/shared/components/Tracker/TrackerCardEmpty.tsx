import React from "react";
import { CarouselItem } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";

const TrackerCardEmpty = () => {
  return (
    <CarouselItem className="basis-full md:basis-1/2 xl:basis-1/3 2xl:basis-1/4">
      <div className="h-full rounded-lg relative border-2 border-dashed">
        {" "}
        <CardContent className="flex h-[100px] justify-center items-center p-3 gap-3">
          <h1 className="text-sm text-muted-foreground">No budget set</h1>
          {/* <Skeleton className="h-12 w-12 rounded-full ml-5" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div> */}
        </CardContent>
      </div>
    </CarouselItem>
  );
};

export default TrackerCardEmpty;
