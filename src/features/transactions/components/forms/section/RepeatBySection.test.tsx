// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { afterEach, describe, expect, it } from "vitest";

import { scheduleDefaults } from "@/shared/schema/fields";
import { RepeatBySection } from "./RepeatBySection";

const Harness = ({ mode = "add", values = {} }: { mode?: string; values?: object }) => {
  const form = useForm({
    defaultValues: {
      ...scheduleDefaults,
      date: new Date(2026, 10, 2),
      every: null,
      frequency: null,
      ...values,
    },
  });
  return (
    <FormProvider {...form}>
      <RepeatBySection mode={mode} />
    </FormProvider>
  );
};

const press = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }));

afterEach(cleanup);

describe("RepeatBySection", () => {
  it("shows the frequency inputs by default", () => {
    render(<Harness />);
    expect(screen.getByText("Every")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Day 10" })).toBeNull();
  });

  it("shows frequency validation errors", async () => {
    const WithErrors = () => {
      const form = useForm({ defaultValues: { ...scheduleDefaults } });
      useEffect(() => {
        form.setError("frequency" as never, { message: "Repeat is required" });
        form.setError("every" as never, { message: "Unit is required" });
      }, [form]);
      return (
        <FormProvider {...form}>
          <RepeatBySection mode="add" />
        </FormProvider>
      );
    };
    render(<WithErrors />);
    expect(await screen.findByText("Repeat is required")).toBeTruthy();
    expect(await screen.findByText("Unit is required")).toBeTruthy();
  });

  it("picks salary days and shows the first due date", () => {
    render(<Harness />);
    press("Specific days");
    press("Day 25");
    press("Day 10");
    expect(screen.getByText("First due: Nov 10, 2026")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Day 10" }).getAttribute("aria-pressed"),
    ).toBe("true");
    press("Day 10");
    expect(screen.getByText("First due: Nov 25, 2026")).toBeTruthy();
  });

  it("explains month ends only for days 29-31", () => {
    render(<Harness />);
    press("Specific days");
    press("Day 28");
    expect(screen.queryByText(/use the last day/)).toBeNull();
    press("Day 31");
    expect(
      screen.getByText("Months without this day use the last day."),
    ).toBeTruthy();
  });

  it("picks a single weekday, including Sunday", () => {
    render(<Harness />);
    press("Specific days");
    press("Weekly");
    press("Sunday");
    expect(screen.getByText("First due: Nov 08, 2026")).toBeTruthy();
    press("Monday");
    expect(screen.getByText("First due: Nov 02, 2026")).toBeTruthy();
  });

  it("locks how a saved schedule repeats but keeps its days editable", () => {
    render(
      <Harness mode="edit" values={{ repeatBy: "days", daysOfMonth: [10, 25] }} />,
    );
    expect(
      (screen.getByRole("button", { name: "Frequency" }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(screen.queryByRole("button", { name: "Weekly" })).toBeNull();
    press("Day 10");
    expect(
      screen.getByRole("button", { name: "Day 10" }).getAttribute("aria-pressed"),
    ).toBe("false");
  });
});
