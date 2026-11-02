export interface SavingsTemplate {
  success: boolean;
  message: string;
  data: SavingsData[];
  summary: SavingsSummary;
}

export interface SavingsData {
  id: number;
  name: string;
  // Prisma Decimals serialize as strings
  targetAmount: string;
  currentAmount: string;
  targetDate: string | null;
  isActive: boolean;
  // Lucide icon name, e.g. "Plane"
  icon: string;
  assetId: number | null;
  asset: {
    id: number;
    name: string;
    currency: string;
    isActive: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;

  savedAmount: number;
  remainingAmount: number;
  progress: number;
  isCompleted: boolean;
  isOnTrack: boolean;
  // Per month from now to hit the target on time; null without a deadline
  requiredMonthlyPace: number | null;
  // Average contributed per month over the last 3 months (fewer for newer goals)
  recentMonthlyPace: number;
  // Contributions per calendar month, last 6 months, oldest first
  monthlyContributions: number[];
}

export interface GoalContribution {
  id: number;
  date: string;
  amount: number;
  description: string | null;
  status: "Pending" | "Completed";
  // Withdrawals are tagged with the goal too
  type: "contribution" | "withdrawal";
  recurringId: number | null;
  fromAsset: { id: number; name: string };
  toAsset: { id: number; name: string } | null;
}

export interface GoalContributionsTemplate {
  success: boolean;
  message: string;
  data: GoalContribution[];
}

export interface SavingsSummary {
  totalSaved: number;
  activeGoals: number;
  // Active goals with a target date: the ones pace, progress and health cover
  datedGoals: number;
  savedThisMonth: number;
  savedLastMonth: number;
  neededPace: number;
  currentPace: number;
  // null when there's nothing last month to compare against
  monthOverMonthChange: number | null;
  totalTarget: number;
  overallProgress: number;
  // Percentage points gained this month, e.g. 0.08 = +8 pts
  progressChange: number;
  onTrack: number;
  behindSchedule: number;
  // Monthly points for the card sparklines, oldest first
  trend: {
    saved: number[];
    // Contributions to goals with a target date only
    pace: number[];
    progress: number[];
    // One entry per active goal
    health: GoalHealth[];
  };
}

export interface GoalHealth {
  id: number;
  name: string;
  status: "onTrack" | "behind" | "noDeadline";
}

export interface SavingsPayload {
  isActive?: boolean;
}

export interface SavingsGoalTemplate {
  success: boolean;
  message: string;
  data: SavingsData;
}

// Unlinked goals send currentAmount; linked ones follow the account balance
export interface GoalPayload {
  name: string;
  targetAmount: number;
  targetDate: string | null;
  icon: string;
  assetId: number | null;
  currentAmount?: number;
}

export type GoalTransferDirection = "contribute" | "withdraw";

// The goal's account is the other side, so only one account is sent:
// the source for a contribution, the destination for a withdrawal
export interface GoalTransferPayload {
  amount: number;
  account: number;
  category: number;
  date: string;
  description?: string;
}
