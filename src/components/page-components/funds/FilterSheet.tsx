import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";

export function FilterSheet({title, children, icon}: {title: string, children: React.ReactNode, icon?: React.ComponentType}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"sm"} variant={"outline"}>
          <Filter />
          <span className="inline sm:hidden lg:inline">Filter</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <div className="flex gap-2 items-center">
            {icon}
          <SheetTitle>{title}</SheetTitle>
          </div>
          <hr />
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
