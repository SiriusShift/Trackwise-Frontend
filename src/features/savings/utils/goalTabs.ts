import { SavingsData } from "../types/savings.types";

export type GoalTab = "active" | "completed" | "archived";

// Archived goals only show in their own tab, completed or not
export const isInTab = (saving: SavingsData, tab: GoalTab) => {
  if (tab === "archived") return !saving.isActive;
  return saving.isActive && saving.isCompleted === (tab === "completed");
};
