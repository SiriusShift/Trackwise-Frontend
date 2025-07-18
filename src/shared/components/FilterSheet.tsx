import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Filter } from "lucide-react";

export function FilterSheet({
  title,
  children,
  onSubmit,
  setClear,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setClear: React.Dispatch<React.SetStateAction<string[]>>;
  icon?: React.ComponentType;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Filter />
          <span className="hidden md:inline">Filter</span>
        </Button>
      </SheetTrigger>

      {/* Mobile-friendly Sheet Content */}
      <SheetContent
        side="right"
        className="w-full max-w-full sm:max-w-[18rem] p-5 h-screen flex flex-col"
      >
        <SheetHeader>
          <div className="flex items-center gap-2">
            {icon}
            <SheetTitle>{title}</SheetTitle>
          </div>
          <hr />
        </SheetHeader>

        {/* Scrollable content area */}
        <div className="flex-1 px-1 overflow-auto">{children}</div>

        {/* Footer with fixed positioning */}
        <SheetFooter className="mt-auto flex gap-2 justify-between w-full">
          <Button type="submit" onClick={onSubmit}>
            Apply
          </Button>
          <Button variant="outline" type="reset" onClick={setClear}>
            Clear
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
