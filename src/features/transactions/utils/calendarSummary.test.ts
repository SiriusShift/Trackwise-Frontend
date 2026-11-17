import { ScheduledItem } from "@/shared/types";
import moment from "moment";
import { describe, expect, it } from "vitest";
import {
  formatDayLabel,
  groupByDueDay,
  summarizeSchedules,
} from "./calendarSummary";

const item = (overrides: Partial<ScheduledItem>): ScheduledItem =>
  ({
    key: "k",
    source: "RECURRING",
    sourceId: 1,
    type: "Expense",
    description: "Item",
    amount: 0,
    dueDate: "2026-11-18T00:00:00.000Z",
    projected: false,
    ...overrides,
  }) as ScheduledItem;

describe("summarizeSchedules", () => {
  it("totals recurring expenses and income, and nets them", () => {
    const summary = summarizeSchedules([
      item({ type: "Expense", amount: 1850 }),
      item({ type: "Expense", amount: 249, projected: true }),
      item({ type: "Income", amount: 42000 }),
    ]);

    expect(summary.outgoing).toBe(2099);
    expect(summary.incoming).toBe(42000);
    expect(summary.net).toBe(39901);
    expect(summary.projectedCount).toBe(1);
    expect(summary.total).toBe(3);
  });

  it("keeps transfers out of in, out and net", () => {
    const summary = summarizeSchedules([
      item({ type: "Transfer", amount: 5000 }),
    ]);

    expect(summary.outgoing).toBe(0);
    expect(summary.incoming).toBe(0);
    expect(summary.net).toBe(0);
  });

  it("reports credit statements as card bills, not as spending", () => {
    const summary = summarizeSchedules([
      item({
        source: "CREDIT_STATEMENT",
        type: "Expense",
        amount: 12450,
        projected: true,
      }),
    ]);

    expect(summary.cardBills).toBe(12450);
    expect(summary.outgoing).toBe(0);
    expect(summary.net).toBe(0);
    expect(summary.projectedCount).toBe(1);
  });

  it("returns zeros for an empty period", () => {
    expect(summarizeSchedules([])).toEqual({
      outgoing: 0,
      incoming: 0,
      net: 0,
      cardBills: 0,
      projectedCount: 0,
      total: 0,
    });
  });
});

describe("groupByDueDay", () => {
  it("groups by due day in date order and keeps input order inside a day", () => {
    const groups = groupByDueDay([
      item({ key: "a", dueDate: "2026-11-20T00:00:00.000Z" }),
      item({ key: "b", dueDate: "2026-11-18T00:00:00.000Z" }),
      item({ key: "c", dueDate: "2026-11-18T00:00:00.000Z" }),
    ]);

    expect(groups.map((g) => g.items.map((i) => i.key))).toEqual([
      ["b", "c"],
      ["a"],
    ]);
  });
});

describe("formatDayLabel", () => {
  const now = moment("2026-11-17T09:00:00");

  it("labels today and tomorrow relatively", () => {
    expect(formatDayLabel(moment("2026-11-17"), now)).toBe("Today");
    expect(formatDayLabel(moment("2026-11-18"), now)).toBe("Tomorrow");
  });

  it("falls back to a short date", () => {
    expect(formatDayLabel(moment("2026-11-20"), now)).toBe("Fri, Nov 20");
  });
});
