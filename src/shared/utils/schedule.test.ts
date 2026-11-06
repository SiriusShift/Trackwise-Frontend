import { expenseSchema } from "@/features/transactions/schema/expense.schema";
import { transferSchema } from "@/features/transactions/schema/transfer.schema";
import moment from "moment";
import { describe, expect, it } from "vitest";
import {
  buildScheduleFields,
  getFirstDueDate,
  getFirstWeekdayDate,
  getFrequencyLabel,
  getNextDuePreview,
} from "./schedule";

describe("getFrequencyLabel", () => {
  it("labels day schedules", () => {
    expect(getFrequencyLabel(1, "month", [10, 25])).toBe(
      "Monthly on the 10th and 25th",
    );
    expect(getFrequencyLabel(1, "month", [1, 2, 3, 11, 22])).toBe(
      "Monthly on the 1st, 2nd, 3rd, 11th and 22nd",
    );
    expect(getFrequencyLabel(1, "month", [15])).toBe("Monthly on the 15th");
  });

  it("keeps existing labels without days", () => {
    expect(getFrequencyLabel(1, "month", [])).toBe("Monthly");
    expect(getFrequencyLabel(2, "week")).toBe("Bi-weekly");
  });
});

describe("getNextDuePreview", () => {
  it("rolls to the next chosen day", () => {
    const rule = { interval: 1, unit: "month", daysOfMonth: [10, 25] };
    expect(getNextDuePreview("2026-11-10", rule)).toBe("November 25, 2026");
    expect(getNextDuePreview("2026-11-25", rule)).toBe("December 10, 2026");
  });

  it("clamps the 31st and returns to it", () => {
    const rule = { interval: 1, unit: "month", daysOfMonth: [31] };
    expect(getNextDuePreview("2027-01-31", rule)).toBe("February 28, 2027");
    expect(getNextDuePreview("2027-02-28", rule)).toBe("March 31, 2027");
  });

  it("anchors interval schedules on the start date", () => {
    const rule = { interval: 1, unit: "month", startDate: "2026-01-31" };
    expect(getNextDuePreview("2026-02-28", rule)).toBe("March 31, 2026");
  });

  it("shows the due date when there is no rule", () => {
    expect(getNextDuePreview("2026-11-10")).toBe("November 10, 2026");
    expect(getNextDuePreview()).toBe("—");
  });
});

describe("first due date", () => {
  it("finds the first chosen day on or after the start", () => {
    const first = (start: string, days: number[]) =>
      getFirstDueDate(start, days).format("YYYY-MM-DD");
    expect(first("2026-11-10", [10, 25])).toBe("2026-11-10");
    expect(first("2026-11-11", [10, 25])).toBe("2026-11-25");
    expect(first("2026-11-26", [10, 25])).toBe("2026-12-10");
    expect(first("2026-11-02", [31])).toBe("2026-11-30");
  });

  it("finds the first weekday, with Sunday as 0", () => {
    // Nov 2 2026 is a Monday
    const first = (weekday: number) =>
      getFirstWeekdayDate("2026-11-02", weekday).format("YYYY-MM-DD");
    expect(first(1)).toBe("2026-11-02");
    expect(first(0)).toBe("2026-11-08");
    expect(first(3)).toBe("2026-11-04");
  });
});

describe("buildScheduleFields", () => {
  const formOnly = (out: any) => {
    expect(out.repeatBy).toBeUndefined();
    expect(out.dayPeriod).toBeUndefined();
    expect(out.weekday).toBeUndefined();
  };

  it("maps monthly days", () => {
    const out = buildScheduleFields({
      repeatBy: "days",
      dayPeriod: "month",
      daysOfMonth: [25, 10],
      date: "2026-11-02",
      every: 5,
      frequency: "week",
    });
    expect(out).toMatchObject({
      every: 1,
      frequency: "month",
      daysOfMonth: [10, 25],
      date: "2026-11-02",
    });
    formOnly(out);
  });

  it("maps a weekday to its first date, ignoring stale days", () => {
    const out = buildScheduleFields({
      repeatBy: "days",
      dayPeriod: "week",
      weekday: 0,
      daysOfMonth: [10],
      date: "2026-11-02",
    });
    expect(out).toMatchObject({ every: 1, frequency: "week" });
    expect(out.daysOfMonth).toBeUndefined();
    expect(moment(out.date).format("YYYY-MM-DD")).toBe("2026-11-08");
    formOnly(out);
  });

  it("leaves frequency schedules alone, without stale days", () => {
    const out = buildScheduleFields({
      repeatBy: "frequency",
      daysOfMonth: [10],
      every: 2,
      frequency: "week",
      date: "2026-11-02",
    });
    expect(out).toMatchObject({ every: 2, frequency: "week" });
    expect(out.daysOfMonth).toBeUndefined();
    formOnly(out);
  });
});

describe("recurring transfer validation", () => {
  const errors = (over: object) => {
    const result = transferSchema.schema.safeParse({
      category: { id: 1, name: "Savings" },
      description: "Move",
      amount: 100,
      date: new Date("2026-11-02"),
      to: { id: 2 },
      recurring: true,
      ...over,
    });
    return result.success ? [] : result.error.issues.map((i) => i.path[0]);
  };

  it("requires what the API requires", () => {
    expect(errors({}).sort()).toEqual(
      ["account", "behaviour", "every", "frequency"],
    );
  });

  it("accepts a complete recurring transfer", () => {
    expect(
      errors({
        account: { id: 1 },
        behaviour: "REMIND",
        every: 1,
        frequency: "month",
      }),
    ).toEqual([]);
  });
});

describe("schedule validation", () => {
  const form = (over: object) => ({
    category: { id: 1 },
    description: "Salary",
    amount: 100,
    date: new Date("2026-11-02"),
    account: { id: 1 },
    recurring: true,
    behaviour: "REMIND",
    ...over,
  });
  const errors = (over: object) => {
    const result = expenseSchema.schema.safeParse(form(over));
    return result.success ? [] : result.error.issues.map((i) => i.path[0]);
  };

  it("accepts Sunday as a weekday", () => {
    expect(errors({ repeatBy: "days", dayPeriod: "week", weekday: 0 })).toEqual([]);
  });

  it("requires a weekday", () => {
    expect(errors({ repeatBy: "days", dayPeriod: "week", weekday: null })).toEqual([
      "weekday",
    ]);
  });

  it("requires at least one day of the month", () => {
    expect(errors({ repeatBy: "days", dayPeriod: "month", daysOfMonth: [] })).toEqual([
      "daysOfMonth",
    ]);
    expect(errors({ repeatBy: "days", dayPeriod: "month", daysOfMonth: [10] })).toEqual([]);
  });

  it("still requires frequency fields in frequency mode", () => {
    expect(errors({ repeatBy: "frequency" })).toEqual(["frequency", "every"]);
    expect(errors({})).toEqual(["frequency", "every"]);
    expect(errors({ every: 2, frequency: "week" })).toEqual([]);
  });
});
