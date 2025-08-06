import TrackerDialog from "@/shared/components/tracker/TrackerDialog";
import { Card, CardContent } from "../ui/card";
import { CarouselItem } from "../ui/carousel";

export const TrackerAddCard = ({
  title,
  addDescription,
  onSubmit,
  isLoading,
  type,
}: {
  title: string;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  type: string;
  addDescription: string;
}) => (
  <CarouselItem className="basis-full md:basis-1/2 xl:basis-1/3 2xl:basis-1/4">
    <Card className="h-full">
      <CardContent className="flex h-[100px] items-center p-9">
        <TrackerDialog
          title={`Add ${title}`}
          description={addDescription}
          onSubmit={onSubmit}
          type={type}
          isLoading={isLoading}
          mode="add"
        />
        <span className="ml-5">Set New Limit</span>
      </CardContent>
    </Card>
  </CarouselItem>
);