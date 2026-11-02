import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Archive, LucideIcon, PartyPopper, PiggyBank, Plus } from "lucide-react";
import { GoalTab } from "../utils/goalTabs";

interface GoalDetailsEmptyProps {
  tab: GoalTab;
  // Any goal at all, archived included
  hasGoals: boolean;
  hasActiveGoals: boolean;
  onCreate: () => void;
  onShowActive: () => void;
}

// Fills the details panel when the selected tab has no goals, so the space
// beside the list doesn't read as a rendering bug. It's the only empty state
// for the tab; the list stays blank so the message isn't shown twice. The
// min height stops the page collapsing when a tab is empty
const GoalDetailsEmpty = ({
  tab,
  hasGoals,
  hasActiveGoals,
  onCreate,
  onShowActive,
}: GoalDetailsEmptyProps) => {
  const content: {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: { label: string; onClick: () => void; icon?: LucideIcon };
  } = !hasGoals
    ? {
        icon: PiggyBank,
        title: "Create your first goal",
        description:
          "Set a target and a due date, and see how much to save each month to get there. Link an account to track contributions automatically.",
        action: { label: "New goal", onClick: onCreate, icon: Plus },
      }
    : tab === "archived"
      ? {
          icon: Archive,
          title: "Nothing archived",
          description:
            "Archive a goal to hide it without losing its history. You can restore it from here.",
        }
      : tab === "completed"
        ? {
            icon: PartyPopper,
            title: "No completed goals yet",
            description: "Goals show up here once you reach their target.",
            ...(hasActiveGoals && {
              action: { label: "View active goals", onClick: onShowActive },
            }),
          }
        : {
            icon: PiggyBank,
            title: "No active goals",
            description: "Start a new goal to keep saving toward something.",
            action: { label: "New goal", onClick: onCreate, icon: Plus },
          };

  const { icon: Icon, title, description, action } = content;
  const ActionIcon = action?.icon;

  return (
    <Card className="flex min-h-80 flex-1 flex-col items-center justify-center gap-4 border-dashed p-8 text-center shadow-none">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="text-muted-foreground" size={22} />
      </div>
      <div className="max-w-sm space-y-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button
          variant={hasGoals ? "outline" : "default"}
          onClick={action.onClick}
        >
          {ActionIcon && <ActionIcon />}
          {action.label}
        </Button>
      )}
    </Card>
  );
};

export default GoalDetailsEmpty;
