import { Card } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SavingsData } from "../types/savings.types";
import { GoalTab, isInTab } from "../utils/goalTabs";
import GoalCard from "./GoalCard";
import GoalCardSkeleton from "./GoalCardSkeleton";
import GoalListEmpty from "./GoalListEmpty";

const sortList = [
  {
    id: 1,
    label: "Due date",
    value: "due",
  },
  {
    id: 2,
    label: "Progress",
    value: "progress",
  },
  {
    id: 3,
    label: "Amount left",
    value: "remaining",
  },
];

const dueTime = (saving: SavingsData) =>
  saving.targetDate ? new Date(saving.targetDate).getTime() : Infinity;

const sortGoals = (goals: SavingsData[], sort: string) =>
  [...goals].sort((a, b) => {
    if (sort === "progress") return b.progress - a.progress;
    if (sort === "remaining") return a.remainingAmount - b.remainingAmount;
    // Goals without a deadline go last. Equal times are checked first because
    // Infinity - Infinity is NaN
    const [aDue, bDue] = [dueTime(a), dueTime(b)];
    return aDue === bDue ? 0 : aDue - bDue;
  });

const GoalList = ({
  data,
  active,
  setActive,
  isLoading,
  tab,
  setTab,
}: {
  data: SavingsData[];
  active: number | null;
  setActive: (active: number | null) => void;
  isLoading: boolean;
  // Owned by the page, which shows an empty state for an empty tab
  tab: GoalTab;
  setTab: (tab: GoalTab) => void;
}) => {
  const [sort, setSort] = useState<string>("due");

  const tabs = useMemo(() => {
    const sorted = sortGoals(data ?? [], sort);
    return [
      {
        value: "active",
        label: "Active",
        goals: sorted.filter((saving) => isInTab(saving, "active")),
      },
      {
        value: "completed",
        label: "Completed",
        goals: sorted.filter((saving) => isInTab(saving, "completed")),
      },
      // Restored from the goal details menu
      {
        value: "archived",
        label: "Archived",
        goals: sorted.filter((saving) => isInTab(saving, "archived")),
      },
    ] as const;
  }, [data, sort]);

  // Default to the tab's first goal when the selection isn't in the visible list
  useEffect(() => {
    const goals = tabs.find((item) => item.value === tab)?.goals ?? [];
    if (!goals.some((saving) => saving.id === active)) {
      setActive(goals[0]?.id ?? null);
    }
  }, [tabs, tab, active, setActive]);

  // Last goal picked in each tab, so switching back returns to it
  const lastPicked = useRef<Partial<Record<GoalTab, number>>>({});
  const pick = (id: number) => {
    lastPicked.current[tab] = id;
    setActive(id);
  };

  // Picks the goal in the same update as the tab change. Leaving it to the
  // effect above renders the old tab's goal for a frame first, which flashes
  // next to the empty state when the new tab has no goals
  const changeTab = (next: GoalTab) => {
    const goals = tabs.find((item) => item.value === next)?.goals ?? [];
    const remembered = goals.find(
      (saving) => saving.id === lastPicked.current[next],
    );
    setActive((remembered ?? goals[0])?.id ?? null);
    setTab(next);
  };

  const activeCount = tabs[0].goals.length;
  // isOnTrack is only false for unfinished goals past their expected pace
  const attentionCount = tabs[0].goals.filter(
    (saving) => !saving.isOnTrack,
  ).length;

  return (
    // Size containment at 2xl stops the goals from setting the row's height:
    // the card stretches to the details panel and the list scrolls inside it,
    // so a long or empty tab doesn't resize the page
    <Card className="md:h-auto 2xl:w-98 2xl:shrink-0 2xl:contain-[size] col-span-1 flex flex-col p-4 gap-3">
      <div className="flex flex-row justify-between items-center gap-2">
        <div className="flex flex-col min-w-0">
          <span className="font-bold">Goals</span>
          {isLoading ? (
            <Skeleton className="mt-1 h-3 w-20" />
          ) : (
            activeCount > 0 && (
              <span
                className={`text-xs truncate ${attentionCount > 0 ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}
              >
                {attentionCount > 0
                  ? `${attentionCount} need${attentionCount === 1 ? "s" : ""} attention`
                  : "All on track"}
              </span>
            )
          )}
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger
            className="w-32 shrink-0 text-xs h-8"
            aria-label="Sort goals"
          >
            <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {sortList.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Tabs
        value={tab}
        onValueChange={(value) => changeTab(value as GoalTab)}
        className="flex flex-col flex-1 min-h-0"
      >
        <TabsList className="grid w-full grid-cols-3 shrink-0">
          {tabs.map(({ value, label, goals }) => (
            <TabsTrigger key={value} value={value}>
              {label}
              {isLoading ? (
                <Skeleton className="ms-1.5 h-4 w-4" />
              ) : (
                <span className="ms-1.5 rounded-full bg-muted-foreground/15 px-1.5 text-xs tabular-nums">
                  {goals.length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(({ value, goals }) => (
          <TabsContent
            key={value}
            value={value}
            // A row from md to 2xl, where the list sits above the goal details.
            // Padding keeps the selected card's ring from being clipped by the
            // scroll area; the stable gutter stops cards resizing when it scrolls.
            // The min height keeps one card's space so an empty tab doesn't collapse
            className={`flex-1 min-h-32 flex flex-col gap-2 p-1 overflow-x-hidden overflow-y-auto data-[state=inactive]:hidden *:shrink-0 md:flex-row md:overflow-x-auto md:overflow-y-hidden 2xl:flex-col 2xl:overflow-x-hidden 2xl:overflow-y-auto ${isLoading || goals.length > 0 ? "md:*:w-72 2xl:*:w-full" : "*:w-full"} ${goals.length > 3 ? "[scrollbar-gutter:stable] md:[scrollbar-gutter:auto] 2xl:[scrollbar-gutter:stable]" : ""}`}
          >
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <GoalCardSkeleton key={`${value}-skeleton-${index}`} />
              ))
            ) : goals.length > 0 ? (
              goals.map((saving) => (
                <GoalCard
                  key={saving.id}
                  data={saving}
                  setActive={pick}
                  active={active}
                />
              ))
            ) : (
              <GoalListEmpty tab={tab} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default GoalList;
