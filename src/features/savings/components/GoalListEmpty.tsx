import { GoalTab } from "../utils/goalTabs";

// Fills the list's reserved space when a tab has no goals. Kept to one quiet
// line: the details panel has the full explanation and actions, and on small
// screens it sits below the list, so this is what says the tab is empty.
// flex-1 rather than h-full, since the list has no fixed height to fill
const GoalListEmpty = ({ tab }: { tab: GoalTab }) => (
  <div className="flex flex-1 animate-in fade-in-0 duration-200 items-center justify-center rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
    No {tab} goals
  </div>
);

export default GoalListEmpty;
