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

const ordinal = (day: number) => {
  const tens = day % 100;
  if (tens >= 11 && tens <= 13) return `${day}th`;
  return `${day}${{ 1: "st", 2: "nd", 3: "rd" }[day % 10] ?? "th"}`;
};

const joinWithAnd = (items: string[]) =>
  items.length < 2
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export const getFrequencyLabel = (
  interval?: number,
  unit?: string,
  daysOfMonth?: number[],
) => {
  if (daysOfMonth?.length) {
    return `Monthly on the ${joinWithAnd(daysOfMonth.map(ordinal))}`;
  }
  if (!interval || !unit) return "—";
  const preset = frequencies.find(
    (f) => f.unit === unit.toLowerCase() && f.interval === interval,
  );
  if (preset) return preset.name;
  return `Every ${interval} ${unit.toLowerCase()}${interval === 1 ? "" : "s"}`;
};

export interface ScheduleRule {
  interval?: number;
  unit?: string;
  startDate?: string;
  daysOfMonth?: number[];
}

// A day the month doesn't have falls on its last day (31st -> Nov 30).
// Same rules as the backend's utils/recurringSchedule.js.
const clampedDate = (monthStart: moment.Moment, day: number) =>
  monthStart.clone().date(Math.min(day, monthStart.daysInMonth()));

const firstDayOfMonthOnOrAfter = (from: moment.Moment, days: number[]) => {
  const thisMonth = from.clone().startOf("month");
  const candidates = [thisMonth, thisMonth.clone().add(1, "month")]
    .flatMap((monthStart) => days.map((day) => clampedDate(monthStart, day)))
    .filter((date) => !date.isBefore(from))
    .sort((a, b) => a.valueOf() - b.valueOf());
  return candidates[0];
};

export const getFirstDueDate = (
  startDate: moment.MomentInput,
  daysOfMonth: number[],
) => firstDayOfMonthOnOrAfter(moment(startDate).startOf("day"), daysOfMonth);

// `weekday` follows moment: Sunday = 0.
export const getFirstWeekdayDate = (
  startDate: moment.MomentInput,
  weekday: number,
) => {
  const start = moment(startDate).startOf("day");
  return start.clone().add((weekday - start.day() + 7) % 7, "day");
};

// The cycle after `dueDate`. Units come from the API as day|week|month|year.
export const getNextDuePreview = (dueDate?: string, rule?: ScheduleRule) => {
  if (!dueDate) return "—";
  const due = moment(dueDate).startOf("day");

  if (rule?.daysOfMonth?.length) {
    return firstDayOfMonthOnOrAfter(
      due.clone().add(1, "day"),
      rule.daysOfMonth,
    ).format("MMMM DD, YYYY");
  }

  if (!rule?.interval || !rule?.unit) return due.format("MMMM DD, YYYY");
  const step = rule.interval;
  const unit = rule.unit.toLowerCase() as moment.unitOfTime.DurationConstructor;

  // Anchored on the start date so months don't drift (Feb 28 -> Mar 31).
  const anchor = moment(rule.startDate ?? dueDate).startOf("day");
  let k = 1;
  let next = anchor.clone().add(step, unit);
  while (!next.isAfter(due)) {
    k++;
    next = anchor.clone().add(k * step, unit);
  }
  return next.format("MMMM DD, YYYY");
};

// Turns the form's Repeat by fields into what the recurring API expects.
export const buildScheduleFields = (data: any) => {
  const { repeatBy, dayPeriod, weekday, daysOfMonth, ...rest } = data;
  if (repeatBy !== "days") return rest;

  if (dayPeriod === "week") {
    return {
      ...rest,
      every: 1,
      frequency: "week",
      date: getFirstWeekdayDate(rest.date, weekday).toDate(),
    };
  }

  return {
    ...rest,
    every: 1,
    frequency: "month",
    daysOfMonth: [...daysOfMonth].sort((a: number, b: number) => a - b),
  };
};
