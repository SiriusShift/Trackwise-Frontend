import { Field } from "@/shared/types";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
// import TimePicker from "./TimePicker";

const DatePicker = ({
  field,
  setOpen,
  setDate,
  open,
  removeTime,
  disablePast,
  disableFuture,
  clearable,
}: {
  field: Field;
  setDate?: (field: Field, date: Date) => void;
  setOpen: (open: boolean) => void;
  open: boolean;
  removeTime?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  clearable?: boolean;
}) => {
  //   const [timeOpen, setTimeOpen] = useState(false);
  const formatTime = (value: unknown) => {
    if (!value) return "";
    const m = moment(value as Date);
    return m.isValid() ? m.format("HH:mm") : "";
  };
  const [timeValue, setTimeValue] = useState(formatTime(field.value));

  // Keep local input in sync when the date changes from outside (calendar, clear, etc.)
  useEffect(() => {
    setTimeValue(formatTime(field.value));
  }, [field.value]);

  const selected = moment(field.value);
  const now = moment();

  const dateChanged = !selected.isSame(now, "day");
  const timeChanged =
    selected.hour() !== now.hour() || selected.minute() !== now.minute();
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          removeClose
          className="max-w-[300px] sm:h-auto sm:w-auto p-4 flex justify-center"
        >
          <div className="flex flex-col space-y-4">
            {/* Calendar for Date Selection */}
            <Calendar
              className="responsive-calendar"
              mode="single"
              selected={field.value ? new Date(field.value) : undefined}
              onSelect={(date?: Date) => {
                if (!date) return;
                const newDate = new Date(
                  date.setHours(
                    field.value ? new Date(field.value).getHours() : 0,
                    field.value ? new Date(field.value).getMinutes() : 0,
                  ),
                );
                if (disableFuture && newDate > new Date()) {
                  return toast.error("Can't set date to future");
                }
                if (setDate) {
                  setDate(field, newDate);
                }
                field.onChange(newDate);
              }}
              onClear={clearable ? () => field.onChange(null) : undefined}
              initialFocus
              disabled={(date) => {
                if (disablePast) {
                  const today = moment().startOf("day").toDate();
                  return date < today;
                }
                if (disableFuture) {
                  const today = moment().startOf("day").toDate();
                  return date > today;
                }
                const minDate = new Date("2000-01-01"); // Minimum date
                return date < minDate;
              }}
            />
            {/* Time Picker for Time Selection */}
            <div
              className={`flex items-center px-4 ${(dateChanged || timeChanged) && !removeTime ? "justify-between" : "justify-end"}`}
            >
              {(dateChanged || timeChanged) && (
                <Button
                  variant="ghost"
                  onClick={() => field.onChange(new Date())}
                >
                  Now
                </Button>
              )}
              {/* <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                //   setTimeOpen(true);
                }}
                type="button"
                className="w-28 h-8 flex justify-between"
              >
                {field.value
                  ? moment(field.value).format("hh:mm A")
                  : "-- : -- --"}{" "}
                <Clock />
              </Button> */}
              {!removeTime && (
                <Input
                  type="time"
                  className="w-32 px-2 h-7 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  value={timeValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTimeValue(value);
                    // Partial/cleared input emits "" — don't push an invalid date to the form
                    if (!/^\d{2}:\d{2}$/.test(value)) return;
                    const [hours, minutes] = value.split(":").map(Number);
                    const base = field.value
                      ? new Date(field.value)
                      : new Date();
                    const updatedDate = isNaN(base.getTime())
                      ? new Date()
                      : base;
                    updatedDate.setHours(hours, minutes, 0, 0);
                    field.onChange(updatedDate);
                  }}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* <TimePicker open={timeOpen} setDateOpen={setOpen} setOpen={setTimeOpen} /> */}
    </>
  );
};

export default DatePicker;
