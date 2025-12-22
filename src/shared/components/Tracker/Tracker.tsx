import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import useScreenWidth from "@/shared/hooks/useScreenWidth";

import { commonTrackerProps } from "@/shared/types";
import { TrackerAddCard } from "@/shared/components/Tracker/TrackerAddCard";
import TrackerCard from "@/shared/components/Tracker/TrackerCard";
import TrackerSkeleton from "./TrackerSkeleton";
import TrackerCardEmpty from "@/shared/components/Tracker/TrackerCardEmpty";
import {
  useDeleteCategoryLimitMutation,
  usePatchCategoryLimitMutation,
  usePostCategoryLimitMutation,
} from "@/shared/api/categoryApi";
import { toast } from "sonner";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { useState } from "react";

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

  const [triggerPost, { isLoading: createLoading }] =
    usePostCategoryLimitMutation();
  const [triggerUpdate, { isLoading: updateLoading }] =
    usePatchCategoryLimitMutation();
  const [deleteLimit] = useDeleteCategoryLimitMutation();

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      if (data?.id) {
        await confirm({
          title: "Confirm Update",
          description: "Update this budget limit with your new amount?",
          variant: "info",
          showLoadingOnConfirm: true,
          onConfirm: async () => {
            await triggerUpdate({
              id: data?.id,
              amount: { amount: data?.amount },
            }).unwrap();
            setOpen(false)
            return;
          },
        });
      } else {
        await confirm({
          title: "Create Budget Limit",
          description:
            "Would you like to create a new budget limit for this category?",
          variant: "info",
          showLoadingOnConfirm: true,
          onConfirm: async () => {
            await triggerPost({
              categoryId: data?.category?.id,
              amount: data?.amount,
            }).unwrap();
            setOpen(false)
            return
          },
        });
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const onDelete = async (data: any) => {
    console.log(data);
    console.log("Deleting budget...");
    try {
      confirm({
        title: "Delete budget",
        description: "Are you sure you want to delete this budget?",
        variant: "warning",
        showLoadingOnConfirm: true,
        onConfirm: async () => {
          await deleteLimit(data.id).unwrap();
          toast.success("Budget limit deleted successfully.");
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete budget limit. Please try again.");
    }
  };

  return (
    <div className="relative w-full">
      <h1 className="text-xl font-semibold mb-5">{title}</h1>
      <Carousel
        opts={{
          align: "center",
          watchDrag: width < 768,
        }}
        className="relative w-full"
      >
        <CarouselContent className="h-full">
          <TrackerAddCard
            addDescription={addDescription}
            isLoading={createLoading || updateLoading}
            title={title}
            type={type}
            data={data}
            onSubmit={onSubmit}
          />
          {isLoading &&
            [...Array(length)]?.map((_, i) => <TrackerSkeleton key={i} />)}
          {data?.map((item, index) => (
            <TrackerCard
              key={index}
              item={item}
              title={title}
              isLoading={createLoading || updateLoading}
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
