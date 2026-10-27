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
