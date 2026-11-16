import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import * as LucideIcon from "lucide-react";
import { type LucideProps } from "lucide-react";
import type { ComponentType } from "react";
import { Separator } from "./ui/separator";
export function FilterSheet({
  title,
  children,
  onSubmit,
  setClear,
  open,
  setOpen,
  icon,
  side = "bottom",
  applyLabel = "Apply",
  clearLabel = "Clear all",
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void;
  setClear: React.MouseEventHandler<HTMLButtonElement>;
  icon?: keyof typeof LucideIcon;
  open: boolean;
  setOpen: (open: boolean) => void;
  // "bottom" for phones, "right" for a desktop side drawer
  side?: "bottom" | "right";
  applyLabel?: string;
  clearLabel?: string;
}) {
  const isBottom = side === "bottom";
  const Icon = icon
    ? (LucideIcon[icon] as ComponentType<LucideProps>)
    : undefined;
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side={side}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={
          isBottom
            ? "flex max-h-[85dvh] flex-col gap-3 rounded-t-2xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            : "flex h-full w-full flex-col gap-3 p-5 sm:max-w-sm"
        }
      >
        {isBottom && (
          <span
            aria-hidden
            className="mx-auto -mt-2 h-1.5 w-10 shrink-0 rounded-full bg-muted-foreground/30"
          />
        )}
        <SheetHeader className="text-left">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4" />}
            <SheetTitle>{title}</SheetTitle>
          </div>
          <Separator />
        </SheetHeader>

        {/* Scrollable content area */}
        <div className="min-h-0 flex-1 overflow-y-auto px-1">{children}</div>

        <SheetFooter className="grid w-full grid-cols-2 gap-2 sm:space-x-0">
          <Button variant="outline" type="reset" onClick={setClear}>
            {clearLabel}
          </Button>
          <Button type="submit" onClick={onSubmit}>
            {applyLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
