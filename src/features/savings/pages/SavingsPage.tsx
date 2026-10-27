import PageHeader from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import {
  ArrowDownToLine,
  ChartPie,
  Gauge,
  PiggyBank,
  Plus,
  Target,
} from "lucide-react";
import { useState } from "react";
import { useGetSavingsQuery } from "../api/savingsApi";
import GoalList from "../components/GoalList";
import StatsCard from "../components/StatsCard";

const SavingsPage = () => {
  const [isActive, setIsActive] = useState(true);
  const [activeGoal, setActiveGoal] = useState<number | undefined>();
  const { data, isLoading } = useGetSavingsQuery({
    isActive: isActive,
  });

  console.log(data);
  const savings = data?.data || [];

  // Pace, progress and health only cover goals with a target date
  const deadlineScope = {
    datedGoals: data?.summary.datedGoals,
    excludedGoals:
      (data?.summary.activeGoals ?? 0) - (data?.summary.datedGoals ?? 0),
  };

  const stats = [
    {
      title: "Total saved",
      key: "saved-total",
      value: data?.summary.totalSaved,
      additional: data?.summary.savedThisMonth,
      icon: PiggyBank,
      graph: data?.summary.trend.saved ?? [],
    },
    {
      title: "Monthly pace needed",
      key: "monthly-pace",
      value: data?.summary.neededPace,
      additional: data?.summary.currentPace,
      icon: Gauge,
      graph: data?.summary.trend.pace ?? [],
      ...deadlineScope,
    },
    {
      title: "Overall progress",
      key: "progress",
      value: data?.summary.overallProgress,
      additional: data?.summary.totalTarget,
      change: data?.summary.progressChange,
      icon: ChartPie,
      graph: data?.summary.trend.progress ?? [],
      ...deadlineScope,
    },
    {
      title: "Goal Health",
      key: "count",
      value: data?.summary.onTrack,
      additional: data?.summary.behindSchedule,
      icon: Target,
      // Goal health shows status dots, not a sparkline
      graph: [],
      health: data?.summary.trend.health ?? [],
      ...deadlineScope,
    },
  ];

  console.log(data);
  return (
    <>
      {" "}
      <div className="flex p-5 flex-col gap-5">
        <PageHeader
          pageName="Savings"
          description="Track progress toward your goals. Contributions are transfers tagged to a goal."
          monthPicker={false}
        >
          <div className="flex flex-row gap-5">
            <Button variant={"outline"}>
              <ArrowDownToLine /> Export
            </Button>
            <Button variant={"default"}>
              <Plus /> New goal
            </Button>
          </div>
        </PageHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatsCard key={item.key} data={item} isLoading={isLoading} />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3 h-full">
          <GoalList
            data={savings}
            active={activeGoal}
            setActive={setActiveGoal}
            isLoading={isLoading}
          />
          <div className="col-span-1 flex flex-col"></div>
        </div>
      </div>
    </>
  );
};

export default SavingsPage;
