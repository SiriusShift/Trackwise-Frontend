import { ScheduledItem } from "@/shared/types";
import moment from "moment";

export interface ScheduleSummary {
  /** Recurring expenses due in the period. */
  outgoing: number;
  /** Recurring income due in the period. */
  incoming: number;
  /** incoming - outgoing. Transfers and card bills are excluded. */
  net: number;
  /** Credit card statement balances due in the period. */
  cardBills: number;
  projectedCount: number;
  total: number;
}

/**
 * Totals for the calendar summary strip.
 *
 * Transfers are internal moves between the user's own accounts, so they are
 * left out of in/out/net. Credit statements are excluded from `net` because
 * the card spending they settle is already counted through its own items;
 * they are reported separately as `cardBills`.
 */
export const summarizeSchedules = (
  items: ScheduledItem[],
): ScheduleSummary => {
  const summary: ScheduleSummary = {
    outgoing: 0,
    incoming: 0,
    net: 0,
    cardBills: 0,
    projectedCount: 0,
    total: items.length,
  };

  for (const item of items) {
    const amount = item.amount ?? 0;
    if (item.projected) summary.projectedCount += 1;

    if (item.source === "CREDIT_STATEMENT") {
      summary.cardBills += amount;
    } else if (item.type === "Expense") {
      summary.outgoing += amount;
    } else if (item.type === "Income") {
      summary.incoming += amount;
    }
  }

  summary.net = summary.incoming - summary.outgoing;
  return summary;
};

export interface ScheduleDayGroup {
  /** YYYY-MM-DD */
  key: string;
  date: moment.Moment;
  items: ScheduledItem[];
}

/** Groups items by due day, earliest first. Input order is kept within a day. */
export const groupByDueDay = (items: ScheduledItem[]): ScheduleDayGroup[] => {
  const groups = new Map<string, ScheduleDayGroup>();

  for (const item of items) {
    const date = moment(item.dueDate);
    const key = date.format("YYYY-MM-DD");
    const group = groups.get(key);
    if (group) group.items.push(item);
    else groups.set(key, { key, date: date.startOf("day"), items: [item] });
  }

  return [...groups.values()].sort((a, b) => a.date.diff(b.date));
};

/** "Today", "Tomorrow", or e.g. "Wed, Nov 18". */
export const formatDayLabel = (date: moment.Moment, now = moment()) => {
  if (date.isSame(now, "day")) return "Today";
  if (date.isSame(moment(now).add(1, "day"), "day")) return "Tomorrow";
  return date.format("ddd, MMM D");
};
