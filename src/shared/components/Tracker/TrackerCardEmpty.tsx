import { PiggyBank, Plus } from "lucide-react";
import { CarouselItem } from "../ui/carousel";

const TrackerCardEmpty = ({ onAdd }: { onAdd?: () => void }) => {
  return (
    <CarouselItem className="basis-full pl-4 2xl:basis-1/2">
      <button
        type="button"
        onClick={onAdd}
        disabled={!onAdd}
        className="group flex h-32 w-full items-center gap-3 rounded-lg border border-dashed p-4 text-left transition-colors enabled:hover:border-primary/40 enabled:hover:bg-primary/5"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-enabled:group-hover:bg-primary/10 group-enabled:group-hover:text-primary">
          <PiggyBank className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold leading-tight">
            No budget set
          </span>
          <span className="mt-1 block text-xs leading-tight text-muted-foreground">
            Set a spending limit for a category
          </span>
        </span>
        {onAdd && <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </button>
    </CarouselItem>
  );
};

export default TrackerCardEmpty;
