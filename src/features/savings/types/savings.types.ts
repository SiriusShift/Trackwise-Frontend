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
  savedThisMonth: number;
  savedLastMonth: number;
  // null when there's nothing last month to compare against
  monthOverMonthChange: number | null;
  totalTarget: number;
  overallProgress: number;
  onTrack: number;
  behindSchedule: number;
}

export interface SavingsPayload {
  isActive?: boolean;
}
