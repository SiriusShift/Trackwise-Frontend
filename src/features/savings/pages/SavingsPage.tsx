import PageHeader from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { ArrowDownToLine, Plus } from "lucide-react";
import React, { useState } from "react";
import { useGetSavingsQuery } from "../api/savingsApi";
import StatsCard from "../components/StatsCard";

const SavingsPage = () => {
  const [isActive, setIsActive] = useState(true);
  const { data, isLoading } = useGetSavingsQuery({
    isActive: isActive,
  });

  const stats = [
    {
      title: "Total saved",
      key: "saved-total",
      value: data?.summary.totalSaved,
      additional: data?.summary.activeGoals,
    },
    {
      title: "Saved this month",
      key: "saved-current",
      value: data?.summary.savedThisMonth,
      additional: data?.summary.monthOverMonthChange,
    },
    {
      title: "Overall progress",
      key: "progress",
      value: data?.summary.overallProgress,
      additional: data?.summary.totalTarget,
    },
    {
      title: "Goal Health",
      key: "count",
      value: data?.summary.onTrack,
      additional: data?.summary.behindSchedule,
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
      </div>
    </>
  );
};

export default SavingsPage;
