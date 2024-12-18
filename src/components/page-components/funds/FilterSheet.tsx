import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
        <Button size={"sm"} variant={"outline"}>
          <Filter />
          <span className="inline sm:hidden lg:inline">Filter</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-5 h-full">
        <SheetHeader>
          <div className="flex gap-2 items-center">
            {icon}
            <SheetTitle>{title}</SheetTitle>
          </div>
          <hr />
        </SheetHeader>
        <div className="h-5/6">{children}</div>
        <SheetFooter className="absolute bottom-4 right-7">
          <Button variant={"outline"} type="reset" onClick={setClear}>Clear</Button>
          <Button type="submit" onClick={onSubmit}>Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
