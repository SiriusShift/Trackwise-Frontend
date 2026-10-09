import { frequencies } from "@/shared/constants/dateConstants";
import { ScheduleCategory, ScheduledItem, ScheduleType } from "@/shared/types";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import moment from "moment";
import { getLucideIcon } from "./icons";

// Wording for the "complete this cycle" action, per transaction type.
export const scheduleActionLabels: Record<
  ScheduleType,
  { action: string; title: string; done: string; amount: string; date: string }
> = {
  Expense: {
    action: "Pay",
    title: "Mark as paid",
    done: "Paid",
    amount: "Amount paid",
    date: "Date paid",
  },
  Income: {
    action: "Receive",
    title: "Mark as received",
    done: "Received",
    amount: "Amount received",
    date: "Date received",
  },
  Transfer: {
    action: "Transfer",
    title: "Mark as transferred",
    done: "Transferred",
    amount: "Amount transferred",
    date: "Date transferred",
  },
};

const TYPE_COLORS: Record<ScheduleType, string> = {
  Expense: "#ef4444",
  Income: "#10b981",
  Transfer: "#3b82f6",
};

type ScheduleLike = Pick<ScheduledItem, "type" | "source"> & {
  category?: ScheduleCategory | null;
  toAsset?: { color?: string | null } | null;
};

export const getScheduleColor = (item?: ScheduleLike | null) =>
  item?.category?.color ??
  (item?.source === "CREDIT_STATEMENT" ? item?.toAsset?.color : null) ??
  (item ? TYPE_COLORS[item.type] : undefined) ??
  "#94a3b8";

export const getScheduleIcon = (item?: ScheduleLike | null): LucideIcon =>
  item?.source === "CREDIT_STATEMENT"
    ? Icons.CreditCard
    : getLucideIcon(item?.category?.icon, Icons.CircleDollarSign);

export const getScheduleSubtitle = (item: ScheduledItem) => {
  if (item.source === "CREDIT_STATEMENT") return "Credit card bill";
  if (item.type === "Transfer")
    return `${item.fromAsset?.name ?? "—"} → ${item.toAsset?.name ?? "—"}`;
  return item.category?.name ?? "Uncategorized";
};

// Income adds money; everything else takes it out of an account.
export const getAmountPrefix = (type: ScheduleType) =>
  type === "Income" ? "+" : type === "Expense" ? "−" : "";

export const getFrequencyLabel = (interval?: number, unit?: string) => {
  if (!interval || !unit) return "—";
  const preset = frequencies.find(
    (f) => f.unit === unit.toLowerCase() && f.interval === interval,
  );
  if (preset) return preset.name;
  return `Every ${interval} ${unit.toLowerCase()}${interval === 1 ? "" : "s"}`;
};

// The cycle after `dueDate`. Units come from the API as day|week|month|year.
export const getNextDuePreview = (
  dueDate?: string,
  interval?: number,
  unit?: string,
) => {
  if (!dueDate) return "—";
  if (!interval || !unit) return moment(dueDate).format("MMMM DD, YYYY");
  return moment(dueDate)
    .add(interval, unit.toLowerCase() as moment.unitOfTime.DurationConstructor)
    .format("MMMM DD, YYYY");
};
