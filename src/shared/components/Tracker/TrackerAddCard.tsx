import TrackerDialog from "@/shared/components/Tracker/TrackerDialog";
import { Card, CardContent } from "../ui/card";
import { CarouselItem } from "../ui/carousel";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export const TrackerAddCard = ({
  title,
  addDescription,
  onSubmit,
  isLoading,
  type,
  data
}: {
  title: string;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  type: string;
  addDescription: string;
}) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <CarouselItem className="basis-[90%] md:basis-1/2 xl:basis-1/3 2xl:basis-1/4">
        <Card className="h-full">
          <CardContent className="flex h-[100px] items-center p-9">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => setOpen(true)}
              className="h-11 bg-card w-11 rounded-full border-primary border-2"
            >
              <Plus className="text-primary" size={30} />
            </Button>
            <span className="ml-5">Add New Budget</span>
          </CardContent>
        </Card>
      </CarouselItem>
      <TrackerDialog
        title={`Add ${title}`}
        open={open}
        setOpen={setOpen}
        description={addDescription}
        onSubmit={onSubmit}
        type={type}
        isLoading={isLoading}
        mode="add"
        data={data}
      />
    </>
  );
};
