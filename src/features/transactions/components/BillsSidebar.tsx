import { IRootState } from "@/app/store";
import BillDialog from "@/shared/components/dialog/BillDialog/BillDialog";
import { Card } from "@/shared/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCurrency } from "@/shared/utils/CustomFunctions"; // adjust path as needed
import * as LucideIcon from "lucide-react";
import { CircleDollarSign } from "lucide-react";
import moment from "moment";
import { useState, type ComponentType, type ReactNode } from "react";
import { useSelector } from "react-redux";

interface UpcomingBillsSidebarProps {
  events?: Array<{
    title: string;
    extendedProps?: {
      amount?: number;
      category?: {
        name?: string;
        color?: string;
        icon?: string;
      };
    };
  }>;
  isFetching?: boolean;
  //   onSelectBill?: (event: UpcomingBillsSidebarProps["events"][number]) => void;
}

const SKELETON_COUNT = 5;

function BillCardSkeleton() {
  return (
    <Card className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3 min-w-0">
        <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
        <div className="min-w-0 flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-12 shrink-0" />
    </Card>
  );
}

export function UpcomingBillsSidebar({
  events,
  isFetching,
}: UpcomingBillsSidebarProps) {
  const [open, setOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const currency = useSelector((state: IRootState) => state.settings.currency);

  const handleClick = (event) => {
    setSelectedBill(event);
    setOpen(true);
  };

  let cards: ReactNode[];

  if (isFetching) {
    cards = Array.from({ length: SKELETON_COUNT }).map((_, index) => (
      <BillCardSkeleton key={`skeleton-${index}`} />
    ));
  } else if (!events?.length) {
    cards = [
      <p
        key="empty"
        className="text-sm text-muted-foreground text-center py-8 w-full"
      >
        No upcoming bills
      </p>,
    ];
  } else {
    cards = events.map((event, index) => {
      const category = event?.extendedProps?.category;
      const Icon =
        (category?.icon &&
          (LucideIcon[
            category.icon as keyof typeof LucideIcon
          ] as ComponentType<LucideIcon.LucideProps>)) ||
        CircleDollarSign;
      const amount = formatCurrency(
        event?.extendedProps?.amount ?? 0,
        currency,
      );
      const isDue = moment(event.start).isBefore(moment());

      return (
        <Card
          key={`${event.title}-${index}`}
          onClick={() => handleClick(event)}
          className="flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${category?.color ?? "#94a3b8"}33`,
                color: category?.color ?? "#94a3b8",
              }}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium">{event.title}</h3>
              <p className="truncate text-xs text-muted-foreground">
                {category?.name ?? "Uncategorized"}
              </p>
            </div>
          </div>

          <div className="text-end">
            <p className="text-sm font-semibold shrink-0 pl-2">{amount}</p>

            {isDue && (
              <p className="text-xs text-destructive font-semibold shrink-0 pl-2">
                Overdue
              </p>
            )}
          </div>
        </Card>
      );
    });
  }

  return (
    <>
      <div className="w-full lg:w-72 shrink-0 p-4 lg:border-l order-1 lg:order-2">
        <h1 className="font-bold">Upcoming Bills</h1>

        {/* Below lg: carousel */}
        {/* Mobile */}
        <div className="mt-4 lg:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Card className="cursor-pointer p-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">Upcoming Bills</h2>
                    <p className="text-sm text-muted-foreground">
                      {isFetching
                        ? "Loading..."
                        : `${events?.length ?? 0} bill${events?.length === 1 ? "" : "s"}`}
                    </p>
                  </div>

                  <LucideIcon.ChevronUp className="h-5 w-5" />
                </div>
              </Card>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Upcoming Bills</DrawerTitle>
              </DrawerHeader>

              <div className="max-h-[70vh] space-y-2 overflow-y-auto px-4 pb-6">
                {cards}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        {/* lg and up: vertical stack */}
        <div className="hidden lg:flex lg:flex-col gap-2 mt-4">{cards}</div>
      </div>
      <BillDialog open={open} setOpen={setOpen} data={selectedBill} />
    </>
  );
}
