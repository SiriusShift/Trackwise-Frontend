import { IRootState } from "@/app/store";
import { cn } from "@/lib/utils";
import { StackedBar } from "@/shared/components/charts/CommonBar";
import { IconBadge } from "@/shared/components/IconBadge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import {
  Archive,
  CircleCheck,
  Ellipsis,
  Info,
  Link2,
  LucideIcon,
  Minus,
  PenLine,
  Plus,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { SavingsData } from "../types/savings.types";
import { getStatus, statusStyles } from "./GoalCard";
import GoalsInfoCardSkeleton from "./GoalsInfoCardSkeleton";

type Tone = "positive" | "warning" | "negative" | "neutral";

const toneText: Record<Tone, string> = {
  positive: "text-green-700 dark:text-success",
  warning: "text-amber-700 dark:text-warning",
  negative: "text-destructive",
  neutral: "text-foreground",
};

const toneNote: Record<Tone, string> = {
  positive: "text-green-700 dark:text-success bg-success/10",
  warning: "text-amber-700 dark:text-warning bg-warning/10",
  negative: "text-destructive bg-destructive/10",
  neutral: "text-muted-foreground bg-muted",
};

const toneIcon: Record<Tone, LucideIcon> = {
  positive: CircleCheck,
  warning: TriangleAlert,
  negative: TriangleAlert,
  neutral: Info,
};

// Whole months between two dates, rounded, for "2 months early" style copy
const monthsBetween = (from: moment.Moment, to: moment.Moment) =>
  Math.round(Math.abs(to.diff(from, "months", true)));

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

interface GoalsInfoCardProps {
  data?: SavingsData;
  isLoading?: boolean;
  onContribute?: (goal: SavingsData) => void;
  onWithdraw?: (goal: SavingsData) => void;
  onEdit?: (goal: SavingsData) => void;
  onArchive?: (goal: SavingsData) => void;
  onDelete?: (goal: SavingsData) => void;
  className?: string;
}

const Stat = ({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: Tone;
}) => (
  <div className="flex min-w-0 flex-col gap-0.5 bg-card px-3 py-2.5">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span
      className={cn(
        "truncate text-base font-semibold tabular-nums",
        toneText[tone],
      )}
    >
      {value}
    </span>
    {/* Always rendered so tiles keep their height when switching goals */}
    <span className="truncate text-xs text-muted-foreground">
      {sub ?? " "}
    </span>
  </div>
);

const GoalsInfoCard = ({
  data,
  isLoading,
  onContribute,
  onWithdraw,
  onEdit,
  onArchive,
  onDelete,
  className,
}: GoalsInfoCardProps) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);

  if (isLoading) return <GoalsInfoCardSkeleton />;
  if (!data) return null;

  const format = (amount: number) =>
    formatCurrency(amount, currency, "symbol", 0);

  const status = getStatus(data);
  const { label, badge, bar } = statusStyles[status];
  // Floored so an unfinished goal never reads as 100%
  const progress = Math.floor(data.progress * 100);
  const target = Number(data.targetAmount);
  const isLinked = data.assetId != null;

  const now = moment();
  const due = data.targetDate ? moment(data.targetDate) : null;
  const required = data.requiredMonthlyPace;
  const recent = data.recentMonthlyPace ?? 0;
  const projected =
    !data.isCompleted && recent > 0
      ? now.clone().add(data.remainingAmount / recent, "months")
      : null;

  // Pace window shrinks for goals younger than 3 months (matches the backend)
  const ageMonths =
    now
      .clone()
      .startOf("month")
      .diff(moment(data.createdAt).startOf("month"), "months") + 1;
  const paceWindow = Math.min(3, Math.max(ageMonths, 1));
  const paceLabel =
    paceWindow === 3 ? "Last 3 months" : `Since ${moment(data.createdAt).format("MMM")}`;

  const paceTone: Tone =
    data.isCompleted || required == null
      ? "neutral"
      : recent >= required
        ? "positive"
        : "warning";

  const projectedSub = (() => {
    if (data.isCompleted) return undefined;
    if (!isLinked) return "Link an account to project";
    if (!projected) return "No recent contributions";
    if (!due) return "At your recent pace";
    const diff = monthsBetween(projected, due);
    if (diff === 0) return "Right on your due date";
    return projected.isBefore(due)
      ? `${plural(diff, "month")} early`
      : `${plural(diff, "month")} late`;
  })();

  // One sentence on where the goal stands and what to do next
  const note: { text: string; tone: Tone } = (() => {
    const dueText = due?.format("MMM YYYY");
    switch (status) {
      case "completed":
        return {
          text: "Target reached. Archive this goal once you've used the money, or raise the target to keep saving.",
          tone: "positive",
        };
      case "overdue":
        return {
          text: `This goal passed its due date with ${format(data.remainingAmount)} left. Set a new date, or finish it with a final contribution.`,
          tone: "negative",
        };
      case "noDeadline":
        return projected
          ? {
              text: `At ${format(recent)}/mo you'll reach ${format(target)} around ${projected.format("MMM YYYY")}. Add a due date to track your pace.`,
              tone: "neutral",
            }
          : {
              text: "Add a due date to see how much to save each month.",
              tone: "neutral",
            };
      default: {
        // Manual goals have no pace, so status comes from the straight-line
        // schedule alone
        if (!isLinked) {
          return status === "onTrack"
            ? {
                text: `You've saved more than expected by now. About ${format(required ?? 0)}/mo gets you to ${format(target)} by ${dueText}.`,
                tone: "positive",
              }
            : {
                text: `You're behind schedule. Save about ${format(required ?? 0)}/mo to finish by ${dueText}, and update the balance as you go.`,
                tone: "warning",
              };
        }
        if (required != null && recent >= required && projected) {
          const early = due ? monthsBetween(projected, due) : 0;
          return {
            text: `At ${format(recent)}/mo you'll finish around ${projected.format("MMM YYYY")}${early > 0 && due && projected.isBefore(due) ? `, ${plural(early, "month")} before your due date` : ""}.`,
            tone: "positive",
          };
        }
        // Only linked goals created this month, which have no pace yet
        if (status === "onTrack") {
          return {
            text: `Save about ${format(required ?? 0)}/mo to finish by ${dueText}. Your pace shows here once a full month of contributions is in.`,
            tone: "neutral",
          };
        }
        if (recent > 0 && projected && due) {
          const late = monthsBetween(projected, due);
          const gap = Math.max((required ?? 0) - recent, 0);
          return {
            text: `At ${format(recent)}/mo you'll finish around ${projected.format("MMM YYYY")}${late > 0 ? `, ${plural(late, "month")} late` : ""}. Add about ${format(gap)}/mo to finish by ${dueText}.`,
            tone: "warning",
          };
        }
        return recent > 0
          ? {
              text: `Save ${format(required ?? 0)}/mo to finish by ${dueText}.`,
              tone: "warning",
            }
          : {
              text: `Nothing saved toward this goal in the last ${plural(paceWindow, "month")}. Save ${format(required ?? 0)}/mo to finish by ${dueText}.`,
              tone: "warning",
            };
      }
    }
  })();

  const NoteIcon = toneIcon[note.tone];

  return (
    <Card className={cn("flex flex-col gap-4 p-4", className)}>
      {/* Header */}
      <div className={`flex ${isLinked ? "flex-col" : "flex-row"} gap-3 lg:flex-row ${isLinked ? "lg:justify-between" : "justify-between"} `}>
        <div className="flex min-w-0 flex-row items-center gap-4">
          <IconBadge icon={data.icon} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-row flex-wrap items-center gap-x-2">
              <h2 className="min-w-0 wrap-break-word font-bold">{data.name}</h2>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-bold",
                  badge,
                )}
              >
                {label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {isLinked
                ? `Linked to ${data.asset?.name ?? "an account"}`
                : "Saved amount entered by hand"}
              {" · "}
              {due ? `Due ${due.format("MMM D, YYYY")}` : "No due date"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:shrink-0 lg:flex-nowrap">
          {/* Manual goals are kept up to date by hand, through the edit dialog */}
          {!isLinked && (
            <Button disabled={!data.isActive} onClick={() => onEdit?.(data)}>
              <PenLine />
              Update balance
            </Button>
          )}
          {isLinked && (
            <>
              <Button
                className="flex-1 lg:flex-none"
                disabled={!data.isActive}
                onClick={() => onContribute?.(data)}
              >
                <Plus />
                Contribute
              </Button>
              <Button
                className="flex-1 lg:flex-none"
                variant="outline"
                disabled={!data.isActive}
                onClick={() => onWithdraw?.(data)}
              >
                <Minus />
                Withdraw
              </Button>
            </>
          )}
          {isLinked && (
            <Button
              size="icon"
              variant="outline"
              aria-label="Edit goal"
              onClick={() => onEdit?.(data)}
            >
              <PenLine />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" aria-label="More actions">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onArchive?.(data)}>
                <Archive />
                {data.isActive ? "Archive goal" : "Restore goal"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete?.(data)}
              >
                <Trash2 />
                Delete goal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Amount and progress */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-end justify-between gap-2">
          <div className="flex min-w-0 flex-row flex-wrap items-baseline gap-x-2">
            <span className="text-2xl lg:text-3xl font-bold tabular-nums">
              {format(data.savedAmount)}
            </span>
            <span className="text-sm lg:text-base text-muted-foreground">of {format(target)}</span>
          </div>
          <span className="font-semibold tabular-nums">{progress}%</span>
        </div>
        <StackedBar
          segments={[
            { label: "Saved amount", value: data.savedAmount, color: bar },
          ]}
          maxColor="hsl(var(--primary))"
          maxValue={target}
          mode="progress"
        />
      </div>

      {/* Key numbers. gap-px over a border-colored grid draws the dividers */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-4">
        <Stat
          label="Remaining"
          value={data.isCompleted ? "Done" : format(data.remainingAmount)}
          sub={data.isCompleted ? undefined : `${100 - progress}% to go`}
        />
        <Stat
          label="Needed pace"
          value={
            data.isCompleted || required == null ? "—" : `${format(required)}/mo`
          }
          sub={
            data.isCompleted
              ? undefined
              : due
                ? `Until ${due.format("MMM YYYY")}`
                : "No due date"
          }
        />
        {/* Manual goals have no contribution history, so their pace is unknown,
            not zero */}
        <Stat
          label="Your pace"
          value={isLinked ? `${format(recent)}/mo` : "—"}
          sub={isLinked ? paceLabel : "Not tracked for manual goals"}
          tone={isLinked ? paceTone : "neutral"}
        />
        <Stat
          label={data.isCompleted ? "Status" : "Projected finish"}
          value={
            data.isCompleted
              ? "Reached"
              : projected
                ? projected.format("MMM YYYY")
                : "—"
          }
          sub={projectedSub}
          tone={
            data.isCompleted
              ? "positive"
              : projected && due && projected.isAfter(due, "month")
                ? "warning"
                : "neutral"
          }
        />
      </div>

      <p
        className={cn(
          "flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm",
          toneNote[note.tone],
        )}
      >
        <NoteIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>{note.text}</span>
      </p>

      {/* Linked goals show their history in the widgets below this card.
          mt-auto pins this to the bottom when the card stretches to the list */}
      {!isLinked && (
        <div className="mt-auto flex flex-col items-start gap-3 rounded-lg border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Link an account to track contributions and see your monthly history.
          </p>
          <Button size="sm" variant="outline" onClick={() => onEdit?.(data)}>
            <Link2 />
            Link account
          </Button>
        </div>
      )}
    </Card>
  );
};


export default GoalsInfoCard;
