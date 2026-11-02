import PageHeader from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import {
  ChartPie,
  Gauge,
  PiggyBank,
  Plus,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { handleCatchErrorMessage } from "@/shared/utils/CustomFunctions";
import {
  useDeleteGoalMutation,
  useGetSavingsQuery,
  useUpdateGoalMutation,
} from "../api/savingsApi";
import GoalList from "../components/GoalList";
import StatsCard from "../components/StatsCard";
import GoalsInfoCard from "../components/GoalsInfoCard";
import GoalContributionChart from "../components/GoalContributionChart";
import RecentContributions from "../components/RecentContributions";
import GoalTransferDialog from "../components/GoalTransferDialog";
import GoalDialog from "../components/GoalDialog";
import GoalDetailsEmpty from "../components/GoalDetailsEmpty";
import { GoalTab, isInTab } from "../utils/goalTabs";
import { GoalTransferDirection, SavingsData } from "../types/savings.types";

const SavingsPage = () => {
  const [activeGoal, setActiveGoal] = useState<number | null>(null);
  const [goalTab, setGoalTab] = useState<GoalTab>("active");
  // Archived goals are included for the Archived tab; the summary still only
  // counts active ones
  const { data, isLoading } = useGetSavingsQuery({});
  const savings = data?.data || [];
  const activeSaving = savings.find((saving) => saving.id === activeGoal);

  // Contribute / withdraw dialog. The goal is kept separately so the dialog
  // keeps its content while closing
  const [transferOpen, setTransferOpen] = useState(false);
  const [transfer, setTransfer] = useState<{
    goal: SavingsData;
    direction: GoalTransferDirection;
  } | null>(null);
  const openTransfer =
    (direction: GoalTransferDirection) => (goal: SavingsData) => {
      setTransfer({ goal, direction });
      setTransferOpen(true);
    };

  // Create / edit dialog. A null goal creates one; like the transfer dialog,
  // the goal is kept while the dialog closes
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsData | null>(null);
  const openGoalDialog = (goal: SavingsData | null) => {
    setEditingGoal(goal);
    setGoalDialogOpen(true);
  };

  // A new goal isn't in the list until the refetch lands, and GoalList resets
  // a selection it can't find, so select it once it shows up
  const [pendingSelect, setPendingSelect] = useState<number | null>(null);
  useEffect(() => {
    if (pendingSelect == null) return;
    if (data?.data.some((saving) => saving.id === pendingSelect)) {
      setActiveGoal(pendingSelect);
      setPendingSelect(null);
    }
  }, [data, pendingSelect]);

  const { confirm } = useConfirm();
  const [updateGoal] = useUpdateGoalMutation();
  const [deleteGoal] = useDeleteGoalMutation();

  const handleArchive = (goal: SavingsData) => {
    const archiving = goal.isActive;
    confirm({
      title: archiving ? "Archive goal" : "Restore goal",
      description: archiving
        ? `${goal.name} will be hidden from your goals and stats. You can restore it later.`
        : `${goal.name} will be back in your goals and stats.`,
      variant: "info",
      confirmText: archiving ? "Archive" : "Restore",
      showLoadingOnConfirm: true,
      onConfirm: async () => {
        try {
          await updateGoal({
            id: goal.id,
            data: { isActive: !archiving },
          }).unwrap();
          toast.success(
            `${goal.name} ${archiving ? "archived" : "restored"}.`,
          );
        } catch (err) {
          toast.error(handleCatchErrorMessage(err) ?? "Something went wrong.");
        }
      },
    });
  };

  const handleDelete = (goal: SavingsData) => {
    confirm({
      title: "Delete goal",
      description:
        goal.assetId != null
          ? `${goal.name} will be deleted. Its contributions stay in your transactions and account balance. This can't be undone.`
          : `${goal.name} will be deleted. This can't be undone.`,
      variant: "destructive",
      confirmText: "Delete",
      showLoadingOnConfirm: true,
      onConfirm: async () => {
        try {
          await deleteGoal(goal.id).unwrap();
          toast.success(`${goal.name} deleted.`);
        } catch (err) {
          toast.error(handleCatchErrorMessage(err) ?? "Something went wrong.");
        }
      },
    });
  };

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

  return (
    <>
      {" "}
      <div className="flex p-5 flex-col gap-5">
        <PageHeader
          pageName="Savings"
          description="Track progress toward your goals"
          monthPicker={false}
        >
          <div className="flex flex-row gap-2">
            <Button variant={"default"} onClick={() => openGoalDialog(null)}>
              <Plus /> <span className="hidden sm:inline">New goal</span>
            </Button>
          </div>
        </PageHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatsCard key={item.key} data={item} isLoading={isLoading} />
          ))}
        </div>
        <div className="flex flex-col 2xl:flex-row gap-3 h-full">
          <GoalList
            data={savings}
            active={activeGoal}
            setActive={setActiveGoal}
            isLoading={isLoading}
            tab={goalTab}
            setTab={setGoalTab}
          />
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <GoalsInfoCard
              data={activeSaving}
              isLoading={isLoading}
              onContribute={openTransfer("contribute")}
              onWithdraw={openTransfer("withdraw")}
              onEdit={openGoalDialog}
              onArchive={handleArchive}
              onDelete={handleDelete}
              // Manual goals have no widgets below, so the card fills the
              // column to line up with the bottom of the goal list
              className={activeSaving?.assetId == null ? "flex-1" : undefined}
            />
            {/* Keyed off the tab being empty rather than the selection, which
                is briefly null while GoalList picks a goal */}
            {!isLoading &&
              !savings.some((saving) => isInTab(saving, goalTab)) && (
                <GoalDetailsEmpty
                  tab={goalTab}
                  hasGoals={savings.length > 0}
                  hasActiveGoals={savings.some((saving) =>
                    isInTab(saving, "active"),
                  )}
                  onCreate={() => openGoalDialog(null)}
                  onShowActive={() => setGoalTab("active")}
                />
              )}
            {/* History needs tagged transfers, so only linked goals have it */}
            {activeSaving?.assetId != null && (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <GoalContributionChart
                  monthly={activeSaving.monthlyContributions ?? []}
                  neededPace={
                    activeSaving.isCompleted
                      ? null
                      : activeSaving.requiredMonthlyPace
                  }
                />
                <RecentContributions
                  goal={activeSaving}
                  onContribute={openTransfer("contribute")}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <GoalTransferDialog
        open={transferOpen}
        setOpen={setTransferOpen}
        goal={transfer?.goal ?? null}
        direction={transfer?.direction ?? "contribute"}
      />
      <GoalDialog
        open={goalDialogOpen}
        setOpen={setGoalDialogOpen}
        goal={editingGoal}
        onSaved={(goal) => setPendingSelect(goal.id)}
      />
    </>
  );
};

export default SavingsPage;
