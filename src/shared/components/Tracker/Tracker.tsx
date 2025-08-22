import React, { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import useScreenWidth from "@/shared/hooks/useScreenWidth";

import TrackerDialog from "./TrackerDialog";
import { commonTrackerProps } from "@/shared/types";
import { TrackerAddCard } from "./TrackerAddCard";
import TrackerCard from "./TrackerCard";
import TrackerSkeleton from "./TrackerSkeleton";
import TrackerCardEmpty from "./TrackerCardEmpty";

function Tracker({
  title,
  data,
  editDescription,
  addDescription,
  isLoading,
  type,
  onSubmit,
  onDelete,
}: commonTrackerProps) {
  const width = useScreenWidth();
  const length =
    width >= 1536
      ? 3
      : width >= 1280 && width < 1536
      ? 2
      : width >= 768 && width < 1280
      ? 1
      : 0;
  const remaining = length - (data?.length ?? 0);
  console.log("length", length, data?.length, remaining);
  const shouldShowNav =
    (data?.length > 3 && width >= 1536) ||
    (data?.length > 2 && width >= 1280 && width < 1536) ||
    (data?.length > 1 && width >= 768 && width < 1280) ||
    (data?.length > 0 && width < 768);

  return (
    <div className="relative w-full">
      <h1 className="text-xl font-semibold mb-5">{title}</h1>
      <Carousel
        opts={{
          align: "start",
          watchDrag: width < 768,
        }}
        className="relative w-full"
      >
        <CarouselContent className="h-full">
          <TrackerAddCard
            addDescription={addDescription}
            isLoading={isLoading}
            title={title}
            type={type}
            onSubmit={onSubmit}
          />
          {isLoading &&
            [...Array(length)]?.map((_, i) => <TrackerSkeleton key={i} />)}
          {data?.map((item, index) => (
            <TrackerCard
              key={index}
              item={item}
              title={title}
              isLoading={isLoading}
              type={type}
              onDelete={onDelete}
              onSubmit={onSubmit}
              editDescription={editDescription}
            />
          ))}
          {remaining > 0 &&
            !isLoading &&
            [...Array(remaining)].map((_, i) => <TrackerCardEmpty />)}
        </CarouselContent>

        {shouldShowNav && (
          <>
            <CarouselPrevious className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-10 hidden sm:flex items-center justify-center shadow-md w-10 h-10" />
            <CarouselNext className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 hidden sm:flex items-center justify-center shadow-md w-10 h-10" />
          </>
        )}
      </Carousel>
    </div>
  );
}

export default Tracker;
