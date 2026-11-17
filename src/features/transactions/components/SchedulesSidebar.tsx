import { IRootState } from "@/app/store";
import ScheduleDialog from "@/shared/components/dialog/ScheduleDialog/ScheduleDialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ScheduledItem } from "@/shared/types";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import {
  getAmountPrefix,
  getScheduleColor,
  getScheduleIcon,
  getScheduleSubtitle,
} from "@/shared/utils/schedule";
import * as LucideIcon from "lucide-react";
import moment from "moment";
import { useState, type ReactNode } from "react";
import { useSelector } from "react-redux";
import {
  formatDayLabel,
  groupByDueDay,
} from "../utils/calendarSummary";

export interface ScheduleEvent {
  id: string;
  title: string;
  start: string;
  allDay: true;
  extendedProps: {
    item: ScheduledItem;
  };
}

interface UpcomingSchedulesSidebarProps {
  events?: ScheduleEvent[];
  isFetching?: boolean;
  /** Header text. Defaults to "Scheduled". */
  heading?: string;
  /** Line under the heading, e.g. "3 items". */
  subtitle?: string;
  /** Group the list under day headings ("Today", "Tomorrow", ...). */
  showDayHeaders?: boolean;
  /** When provided, shows a "Show all" action in the header. */
  onShowAll?: () => void;
}

const SKELETON_COUNT = 5;

function ScheduleCardSkeleton() {
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

export function UpcomingSchedulesSidebar({
  events,
  isFetching,
  heading = "Scheduled",
  subtitle,
  showDayHeaders = false,
  onShowAll,
}: UpcomingSchedulesSidebarProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ScheduledItem | null>(null);
  const currency = useSelector((state: IRootState) => state.settings.currency);

  const handleClick = (item: ScheduledItem) => {
    setSelected(item);
    setOpen(true);
  };

  const renderCard = (item: ScheduledItem) => {
    const color = getScheduleColor(item);
    const Icon = getScheduleIcon(item);
    const amount = `${getAmountPrefix(item.type)}${formatCurrency(item.amount ?? 0, currency)}`;
    const isOverdue =
      !item.projected && moment(item.dueDate).isBefore(moment(), "day");

    return (
      <Card
        key={item.key}
        onClick={() => handleClick(item)}
        className={cn(
          "flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-muted/50",
          item.projected && "border-dashed",
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}33`, color }}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium">{item.description}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {moment(item.dueDate).format("MMM DD")} ·{" "}
              {getScheduleSubtitle(item)}
            </p>
          </div>
        </div>

        <div className="text-end shrink-0 pl-2">
          <p
            className={cn(
              "text-sm font-semibold tabular-nums",
              item.type === "Income" && "text-emerald-600",
            )}
          >
            {amount}
          </p>

          {item.needsAttention ? (
            <p className="text-xs text-destructive font-semibold">Failed</p>
          ) : isOverdue ? (
            <p className="text-xs text-destructive font-semibold">Overdue</p>
          ) : item.projected ? (
            <p className="text-xs text-muted-foreground">
              {item.source === "CREDIT_STATEMENT" ? "Estimated" : "Projected"}
            </p>
          ) : item.behaviour === "AUTO_LOG" ? (
            <Badge
              variant="outline"
              className="px-1.5 py-0 text-[10px] font-medium"
            >
              Auto
            </Badge>
          ) : null}
        </div>
      </Card>
    );
  };

  let cards: ReactNode[];

  if (isFetching) {
    cards = Array.from({ length: SKELETON_COUNT }).map((_, index) => (
      <ScheduleCardSkeleton key={`skeleton-${index}`} />
    ));
  } else if (!events?.length) {
    cards = [
      <p
        key="empty"
        className="text-sm text-muted-foreground text-center py-8 w-full"
      >
        Nothing scheduled
      </p>,
    ];
  } else {
    const groups = groupByDueDay(events.map((e) => e.extendedProps.item));
    cards = groups.flatMap((group) => [
      ...(showDayHeaders
        ? [
            <div
              key={`day-${group.key}`}
              className="flex items-center justify-between px-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              <span>{formatDayLabel(group.date)}</span>
              <span>{group.items.length}</span>
            </div>,
          ]
        : []),
      ...group.items.map(renderCard),
    ]);
  }

  const header = (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <span className="block font-bold truncate">{heading}</span>
        {subtitle && (
          <span className="block text-xs text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>
      {onShowAll && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 shrink-0 px-2 text-xs"
          onClick={onShowAll}
        >
          Show all
        </Button>
      )}
    </div>
  );

  const countText = isFetching
    ? "Loading..."
    : `${events?.length ?? 0} item${events?.length === 1 ? "" : "s"}`;

  return (
    <>
      <div className="w-full lg:w-72 shrink-0 p-4 lg:border-l order-1 lg:order-2 lg:overflow-y-auto">
        <div className="hidden lg:block">{header}</div>

        {/* Mobile */}
        <div className="lg:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Card className="cursor-pointer p-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h2 className="font-semibold truncate">{heading}</h2>
                    <p className="text-sm text-muted-foreground">
                      {subtitle ?? countText}
                    </p>
                  </div>

                  <LucideIcon.ChevronUp className="h-5 w-5 shrink-0" />
                </div>
              </Card>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{heading}</DrawerTitle>
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
      <ScheduleDialog open={open} setOpen={setOpen} data={selected} />
    </>
  );
}
