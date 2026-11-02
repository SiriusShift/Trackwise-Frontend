import { IRootState } from "@/app/store";
import { StackedBar } from "@/shared/components/charts/CommonBar";
import { IconBadge } from "@/shared/components/IconBadge";
import { Card } from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import moment from "moment";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { SavingsData } from "../types/savings.types";

export const statusStyles = {
  completed: {
    label: "Completed",
    badge: "text-primary bg-primary/20",
    bar: "hsl(var(--primary))",
  },
  onTrack: {
    label: "On track",
    badge: "text-green-700 dark:text-green-400 bg-success/20",
    bar: "hsl(var(--success))",
  },
  behind: {
    label: "Behind",
    badge: "text-amber-700 dark:text-amber-400 bg-warning/20",
    bar: "hsl(var(--warning))",
  },
  overdue: {
    label: "Overdue",
    badge: "text-destructive bg-destructive/15",
    bar: "hsl(var(--destructive))",
  },
  noDeadline: {
    label: "No deadline",
    badge: "bg-muted text-muted-foreground",
    bar: "hsl(var(--muted-foreground))",
  },
};

export const getStatus = (data: SavingsData): keyof typeof statusStyles => {
  if (data.isCompleted) return "completed";
  if (!data.targetDate) return "noDeadline";
  if (moment(data.targetDate).isBefore(moment(), "day")) return "overdue";
  return data.isOnTrack ? "onTrack" : "behind";
};

const GoalCard = ({
  data,
  setActive,
  active,
}: {
  data: SavingsData;
  setActive: (active: number) => void;
  active: number | null;
}) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const status = getStatus(data);
  const { label, badge, bar } = statusStyles[status];
  const isSelected = active === data.id;
  const cardRef = useRef<HTMLDivElement>(null);

  // Sorting or switching tabs can select a card outside the list's scroll area.
  // Scrolls the list only, as scrollIntoView could also move the page. Runs on
  // every render because a re-sort moves the card without changing its props
  useEffect(() => {
    const list = cardRef.current?.parentElement;
    if (!isSelected || !cardRef.current || !list) return;
    const card = cardRef.current.getBoundingClientRect();
    const view = list.getBoundingClientRect();
    const offset = (start: number, end: number, min: number, max: number) =>
      start < min ? start - min : end > max ? end - max : 0;
    list.scrollBy({
      left: offset(card.left, card.right, view.left, view.right),
      top: offset(card.top, card.bottom, view.top, view.bottom),
      behavior: "smooth",
    });
  });

  // Floored so an unfinished goal never reads as 100%
  const progress = Math.floor(data.progress * 100);

  const format = (amount: number) =>
    formatCurrency(amount, currency, "symbol", 0);
  const dueDate = moment(data.targetDate).format("MMM YYYY");

  // The most useful next fact for each status
  const detail = {
    completed: null,
    onTrack: `Due ${dueDate}`,
    behind: `Needs ${format(data.requiredMonthlyPace ?? 0)}/mo by ${dueDate}`,
    overdue: `${format(data.remainingAmount)} left`,
    noDeadline: `${format(data.remainingAmount)} left`,
  }[status];

  return (
    <Card
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      className={`p-3 cursor-pointer transition-colors space-y-3 duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-accent/50"}`}
      onClick={() => setActive(data.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setActive(data.id);
        }
      }}
    >
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row gap-3 items-center min-w-0">
          <IconBadge icon={data?.icon} size="md" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold truncate" title={data.name}>
              {data.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {format(data.savedAmount)} of {format(Number(data.targetAmount))}
            </span>
          </div>
        </div>

        <span className="shrink-0 text-sm font-semibold tabular-nums">
          {progress}%
        </span>
      </div>
      <StackedBar
        segments={[
          {
            label: "Saved amount",
            value: data.savedAmount,
            color: bar,
          },
        ]}
        maxColor="hsl(var(--primary))"
        maxValue={Number(data.targetAmount)}
        mode="progress"
      />
      <div className="flex flex-row items-center justify-between gap-2">
        <span
          className={`shrink-0 rounded-full font-bold text-xs px-2 py-0.5 ${badge}`}
        >
          {label}
        </span>
        <span className="text-xs text-muted-foreground text-right">
          {detail}
        </span>
      </div>
    </Card>
  );
};

export default GoalCard;
