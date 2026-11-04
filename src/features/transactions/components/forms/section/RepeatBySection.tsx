import moment from "moment";
import { useFormContext } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { frequencyList } from "@/shared/constants/dateConstants";
import {
  getFirstDueDate,
  getFirstWeekdayDate,
} from "@/shared/utils/schedule";

const REPEAT_OPTIONS = [
  { value: "frequency", label: "Frequency" },
  { value: "days", label: "Specific days" },
];

const PERIOD_OPTIONS = [
  { value: "month", label: "Monthly" },
  { value: "week", label: "Weekly" },
];

// Monday first; values follow moment, where Sunday = 0.
const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0];
const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => i + 1);

interface SegmentedChoiceProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label: string;
}

const SegmentedChoice = ({
  options,
  value,
  onChange,
  disabled,
  label,
}: SegmentedChoiceProps) => (
  <div role="group" aria-label={label} className="grid grid-cols-2 gap-2">
    {options.map((option) => (
      <Button
        key={option.value}
        type="button"
        size="sm"
        variant={value === option.value ? "default" : "outline"}
        aria-pressed={value === option.value}
        disabled={disabled}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </Button>
    ))}
  </div>
);

const RepeatBySection = ({ mode }: { mode: string }) => {
  const { control, watch, setValue } = useFormContext();

  const isEdit = mode === "edit";
  const repeatBy = watch("repeatBy") ?? "frequency";
  const dayPeriod = watch("dayPeriod") ?? "month";
  const weekday = watch("weekday");
  const daysOfMonth: number[] = watch("daysOfMonth") ?? [];
  const startDate = watch("date");

  const firstDue =
    repeatBy !== "days" || !startDate
      ? null
      : dayPeriod === "week"
        ? weekday === null || weekday === undefined
          ? null
          : getFirstWeekdayDate(startDate, weekday)
        : daysOfMonth.length
          ? getFirstDueDate(startDate, daysOfMonth)
          : null;

  return (
    <>
      <FormItem>
        <FormLabel>Repeat by</FormLabel>
        {/* NOTE: a saved schedule can't switch how it repeats. */}
        <SegmentedChoice
          label="Repeat by"
          options={REPEAT_OPTIONS}
          value={repeatBy}
          disabled={isEdit}
          onChange={(value) =>
            setValue("repeatBy", value, { shouldValidate: true })
          }
        />
      </FormItem>

      {repeatBy === "frequency" && (
        <div className="grid grid-cols-2 gap-3">
          <FormField
            name="every"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Every</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    placeholder="1"
                    className="text-sm"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="frequency"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <FormControl>
                  <Select value={value ?? ""} onValueChange={onChange}>
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyList.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {repeatBy === "days" && (
        <>
          {!isEdit && (
            <SegmentedChoice
              label="Repeat period"
              options={PERIOD_OPTIONS}
              value={dayPeriod}
              onChange={(value) =>
                setValue("dayPeriod", value, { shouldValidate: true })
              }
            />
          )}

          {dayPeriod === "month" ? (
            <FormField
              control={control}
              name="daysOfMonth"
              render={() => (
                <FormItem>
                  <FormLabel>Days of the month</FormLabel>
                  <div className="grid grid-cols-7 gap-1">
                    {DAYS_OF_MONTH.map((day) => {
                      const selected = daysOfMonth.includes(day);
                      return (
                        <Button
                          key={day}
                          type="button"
                          size="sm"
                          variant={selected ? "default" : "outline"}
                          aria-pressed={selected}
                          aria-label={`Day ${day}`}
                          className="h-10 min-w-0 px-0 text-sm"
                          onClick={() =>
                            setValue(
                              "daysOfMonth",
                              selected
                                ? daysOfMonth.filter((d) => d !== day)
                                : [...daysOfMonth, day],
                              { shouldValidate: true },
                            )
                          }
                        >
                          {day}
                        </Button>
                      );
                    })}
                  </div>
                  <FormMessage />
                  {daysOfMonth.some((day) => day >= 29) && (
                    <p className="text-xs text-muted-foreground">
                      Months without this day use the last day.
                    </p>
                  )}
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={control}
              name="weekday"
              render={() => (
                <FormItem>
                  <FormLabel>Day of the week</FormLabel>
                  <div className="grid grid-cols-7 gap-1">
                    {WEEKDAYS.map((day) => {
                      const name = moment().day(day);
                      return (
                        <Button
                          key={day}
                          type="button"
                          size="sm"
                          variant={weekday === day ? "default" : "outline"}
                          aria-pressed={weekday === day}
                          aria-label={name.format("dddd")}
                          className="h-10 min-w-0 px-0 text-xs"
                          onClick={() =>
                            setValue("weekday", day, { shouldValidate: true })
                          }
                        >
                          {name.format("dd")}
                        </Button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {firstDue && (
            <p className="text-sm text-muted-foreground">
              First due: {firstDue.format("MMM DD, YYYY")}
            </p>
          )}
        </>
      )}
    </>
  );
};

export { RepeatBySection };
